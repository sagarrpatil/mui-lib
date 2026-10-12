import { utils, writeFile } from 'xlsx';
import moment from 'moment';
import { billTime } from 'service/bill';
import { cartLine, toNum } from 'service/profit';

const formatDate = (t) => moment(billTime(t)).format('DD-MM-YYYY hh:mm A');

// Same rule the dashboard uses for "Received Amount"
const paidAmount = (item) =>
  Number(item.balance)
    ? Number(item.partialPayment) || 0
    : Number(item.totalAmmount) || 0;

const autoWidth = (rows) =>
  Object.keys(rows[0] || {}).map((key) => ({
    wch: Math.min(
      40,
      Math.max(key.length, ...rows.map((r) => String(r[key] ?? '').length)) + 2,
    ),
  }));

export const exportTransactionsToExcel = (transactions, fileLabel) => {
  const list = transactions || [];

  const summaryRows = list.map((item) => ({
    Date: formatDate(item),
    'Bill No': item.id,
    Customer: item.customerName || '',
    Phone: item.phoneNumber || '',
    'Receipter / Notes': item.receipterName || '',
    'Payment Option': item.paymentOption || '',
    'Payment Mode': item.paymentMode || '',
    Items: (item.Cart || []).reduce((sum, c) => sum + (c.buyingQty || 0), 0),
    'Additional Charges': item.checkedAddittional
      ? Number(item.checkedAddittional.amount) || 0
      : 0,
    'Additional Type': item.checkedAddittional?.type || '',
    'Total Amount': Number(item.totalAmmount) || 0,
    Paid: paidAmount(item),
    Balance: Number(item.balance) || 0,
  }));

  if (summaryRows.length) {
    summaryRows.push({
      Date: 'TOTAL',
      Items: summaryRows.reduce((s, r) => s + r.Items, 0),
      'Additional Charges': summaryRows.reduce(
        (s, r) => s + r['Additional Charges'],
        0,
      ),
      'Total Amount': summaryRows.reduce((s, r) => s + r['Total Amount'], 0),
      Paid: summaryRows.reduce((s, r) => s + r.Paid, 0),
      Balance: summaryRows.reduce((s, r) => s + r.Balance, 0),
    });
  }

  const itemRows = list.flatMap((item) =>
    (item.Cart || []).map((c) => {
      const l = cartLine(c);
      return {
        Date: formatDate(item),
        'Bill No': item.id,
        Customer: item.customerName || '',
        Phone: item.phoneNumber || '',
        Product: l.name,
        Qty: l.qty,
        'Buy Price': l.costKnown ? toNum(c.buyPrice) : '',
        'Sell Price': toNum(c.sellPrice) || 0,
        Amount: l.revenue,
        Profit: l.costKnown ? l.profit : '',
      };
    }),
  );

  const wb = utils.book_new();
  const summarySheet = utils.json_to_sheet(summaryRows);
  summarySheet['!cols'] = autoWidth(summaryRows);
  utils.book_append_sheet(wb, summarySheet, 'Transactions');

  const itemSheet = utils.json_to_sheet(itemRows);
  itemSheet['!cols'] = autoWidth(itemRows);
  utils.book_append_sheet(wb, itemSheet, 'Items');

  writeFile(
    wb,
    `transactions_${fileLabel}_${moment().format('YYYY-MM-DD_HHmm')}.xlsx`,
  );
};
