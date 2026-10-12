import moment from 'moment';

// A bill's id is its creation timestamp (and is used in receipt links, so it
// never changes). An edited bill date is stored separately in `billDate`.
export const billTime = (t) => Number(t?.billDate) || Number(t?.id) || 0;

export const billMoment = (t) => moment(billTime(t));

// Deleted bills keep their Cart for history but are zeroed out
export const isDeletedBill = (t) =>
  Boolean(t?.deleted) || Number(t?.totalAmmount) === 0;

// Value for <input type="datetime-local">
export const toDateTimeInput = (ms) =>
  ms ? moment(ms).format('YYYY-MM-DDTHH:mm') : '';

export const fromDateTimeInput = (value) => {
  const m = moment(value, 'YYYY-MM-DDTHH:mm', true);
  return m.isValid() ? m.valueOf() : null;
};
