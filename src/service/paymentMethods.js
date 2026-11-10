import { useEffect, useState } from 'react';
import { ref, get, set } from '@firebase/database';
import {
  MdAccountBalance,
  MdAccountBalanceWallet,
  MdCreditCard,
  MdPayment,
  MdPayments,
  MdQrCode2,
} from 'react-icons/md';
import { realtimeDb } from '../firebase';

const key = localStorage.getItem('token');
const path = () => `${key}/settings/paymentMethods`;

export const PAYMENT_ICONS = {
  upi: { label: 'UPI / QR', icon: MdQrCode2 },
  cash: { label: 'Cash', icon: MdPayments },
  card: { label: 'Card', icon: MdCreditCard },
  bank: { label: 'Bank', icon: MdAccountBalance },
  wallet: { label: 'Wallet', icon: MdAccountBalanceWallet },
  other: { label: 'Other', icon: MdPayment },
};

// Same values the app used before, so old transactions still match
export const DEFAULT_PAYMENT_METHODS = [
  { name: 'UPI / Netbanking', icon: 'upi' },
  { name: 'Cash', icon: 'cash' },
  { name: 'Card', icon: 'card' },
];

// Icon for a method name; guesses from the name when it isn't configured
export const paymentIcon = (name, methods = cache) => {
  const found = (methods || []).find((m) => m.name === name);
  if (found && PAYMENT_ICONS[found.icon]) return PAYMENT_ICONS[found.icon].icon;
  const n = String(name || '').toLowerCase();
  if (n.includes('upi') || n.includes('qr')) return MdQrCode2;
  if (n.includes('cash')) return MdPayments;
  if (n.includes('card')) return MdCreditCard;
  if (n.includes('bank') || n.includes('neft') || n.includes('imps'))
    return MdAccountBalance;
  if (n.includes('wallet') || n.includes('pay')) return MdAccountBalanceWallet;
  return MdPayment;
};

const clean = (list) =>
  (Array.isArray(list) ? list : Object.values(list || {}))
    .filter((m) => m && String(m.name || '').trim())
    .map((m) => ({
      name: String(m.name).trim(),
      icon: PAYMENT_ICONS[m.icon] ? m.icon : 'other',
    }));

let cache = null;
let pending = null;
const listeners = new Set();

export const fetchPaymentMethods = async () => {
  if (cache) return cache;
  if (!pending) {
    pending = get(ref(realtimeDb, path()))
      .then((snap) => {
        const list = clean(snap.val());
        cache = list.length ? list : DEFAULT_PAYMENT_METHODS;
        return cache;
      })
      .catch((error) => {
        console.error('Error fetching payment methods:', error);
        return DEFAULT_PAYMENT_METHODS;
      })
      .finally(() => {
        pending = null;
      });
  }
  return pending;
};

export const savePaymentMethods = async (methods) => {
  const list = clean(methods);
  await set(ref(realtimeDb, path()), list);
  cache = list.length ? list : DEFAULT_PAYMENT_METHODS;
  listeners.forEach((fn) => fn(cache));
  return cache;
};

// Payment methods from Settings; defaults until loaded
export function usePaymentMethods() {
  const [methods, setMethods] = useState(cache || DEFAULT_PAYMENT_METHODS);
  useEffect(() => {
    let alive = true;
    fetchPaymentMethods().then((list) => alive && setMethods(list));
    listeners.add(setMethods);
    return () => {
      alive = false;
      listeners.delete(setMethods);
    };
  }, []);
  return methods;
}

// ---- Split payments: one bill paid by several methods ----

const num = (v) => Number(v) || 0;
export const sumPayments = (payments) =>
  (payments || []).reduce((s, p) => s + num(p.amount), 0);

// [{ method, amount }] for a bill. Older bills only have paymentOption, so
// the whole received amount is put on that one method.
export const billPayments = (tx) => {
  const list = (tx?.payments || []).filter((p) => p && p.method);
  if (list.length)
    return list.map((p) => ({ method: p.method, amount: num(p.amount) }));
  if (!tx?.paymentOption) return [];
  const received =
    tx.paymentMode === 'Partial Payment'
      ? num(tx.partialPayment)
      : num(tx.totalAmmount);
  return [{ method: tx.paymentOption, amount: received }];
};

// Text stored in paymentOption, e.g. "Card + Cash"
export const paymentLabel = (payments) =>
  (payments || []).map((p) => p.method).join(' + ');

// What gets saved on the bill: a single method takes the whole received
// amount, split amounts are stored as numbers
export const finalizePayments = (payments, received) => {
  const list = (payments || []).filter((p) => p && p.method);
  if (list.length === 1)
    return [{ method: list[0].method, amount: num(received) }];
  return list.map((p) => ({ method: p.method, amount: num(p.amount) }));
};

// Error message for a split, or '' when it's fine (or not a split)
export const splitProblem = (payments, { total, partial }) => {
  const list = payments || [];
  if (list.length < 2) return '';
  if (list.some((p) => num(p.amount) <= 0))
    return 'Enter an amount for each payment method';
  const sum = sumPayments(list);
  if (partial) {
    if (sum > num(total) + 0.01)
      return "Split total can't be more than the bill total";
    return '';
  }
  if (Math.abs(sum - num(total)) > 0.01)
    return 'Split amounts must add up to the bill total';
  return '';
};
