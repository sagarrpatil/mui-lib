// Shared profit math for the dashboard widgets and exports.
// Bills keep a snapshot of each product in Cart, so profit must not depend on
// the product still existing in availableStock.

// Parses numbers saved as strings like "1,250" or "₹ 40"; null when unusable
export const toNum = (v) => {
  if (v === null || v === undefined || v === '') return null;
  const n =
    typeof v === 'number' ? v : parseFloat(String(v).replace(/[^0-9.-]/g, ''));
  return Number.isFinite(n) ? n : null;
};

// A deleted bill is zeroed out (totalAmmount 0) but keeps its Cart
export const isActiveBill = (t) => (toNum(t?.totalAmmount) || 0) > 0;

export const productLabel = (c) =>
  (c?.name || 'Deleted product') + (c?.flavour ? ` (${c.flavour})` : '');

// Fallback buy prices from current stock, by id and by name/flavour, for old
// cart lines that were saved without a buyPrice
export const buildCostLookup = (stock) => {
  const byId = {};
  const byName = {};
  (stock || []).forEach((p) => {
    const buy = toNum(p?.buyPrice);
    if (buy === null) return;
    if (p.id) byId[p.id] = buy;
    if (p.name) byName[productLabel(p)] = buy;
  });
  return { byId, byName };
};

// Profit for one cart line; costKnown=false when no buy price can be found
export const cartLine = (c, lookup) => {
  const qty = toNum(c?.buyingQty) || 0;
  const sell = toNum(c?.sellPrice) || 0;
  let buy = toNum(c?.buyPrice);
  if (buy === null && lookup)
    buy = lookup.byId[c?.id] ?? lookup.byName[productLabel(c)] ?? null;
  const costKnown = buy !== null;
  const revenue = qty * sell;
  const cost = costKnown ? qty * buy : 0;
  return {
    name: productLabel(c),
    qty,
    revenue,
    cost,
    profit: costKnown ? revenue - cost : 0,
    costKnown,
  };
};

// Totals over active bills. Lines without a known cost are left out of
// revenue/cost/profit (so margin stays honest) and counted in missingCost.
export const summarizeProfit = (transactions, stock) => {
  const lookup = buildCostLookup(stock);
  const out = { revenue: 0, cost: 0, profit: 0, qty: 0, missingCost: 0 };
  (transactions || []).filter(isActiveBill).forEach((t) =>
    (t.Cart || []).forEach((c) => {
      const l = cartLine(c, lookup);
      out.qty += l.qty;
      if (!l.costKnown) {
        out.missingCost += 1;
        return;
      }
      out.revenue += l.revenue;
      out.cost += l.cost;
      out.profit += l.profit;
    }),
  );
  return out;
};
