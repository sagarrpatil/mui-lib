import { realtimeDb } from '../firebase';
import { ref, set, push, get, runTransaction } from '@firebase/database';
const key = localStorage.getItem('token');

export const fetchAvailableProduct = async () => {
  try {
    const dataRefs = ref(realtimeDb, `${key}/availableStock`);
    const snapshot = await get(dataRefs); // Use get() to fetch a single snapshot
    const value = snapshot.val();

    if (value === null || value === undefined) {
      console.warn('Data not found or empty.');
      return null; // Return null or an appropriate default value
    }
    const resultArray = Object.keys(value).map((key) => ({
      id: key,
      ...value[key],
    }));

    return resultArray;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error; // Re-throw the error for proper error handling
  }
};
export const fetchAvailableProductbyID = async (id) => {
  try {
    const dataRefs = ref(realtimeDb, `${key}/availableStock/${id}`);
    const snapshot = await get(dataRefs); // Use get() to fetch a single snapshot
    const value = snapshot.val();

    if (value === null || value === undefined) {
      console.warn('Data not found or empty.');
      return null; // Return null or an appropriate default value
    }
    const resultArray = value;

    return resultArray;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error; // Re-throw the error for proper error handling
  }
};
export const updateInAvailableProductbyIDPutBack = async (object, id) => {
  try {
    // Nothing to put back if the product was deleted
    if (!object) return null;
    console.log(object);
    const dataRefs = ref(realtimeDb, `${key}/availableStock/${id}`);
    set(dataRefs, object).then((snapshot) => {
      return snapshot;
    });
  } catch (error) {
    console.error('Error fetching data:', error);
    return error;
  }
};
export const addInAvailableProduct = async (object) => {
  try {
    const dataRefs = ref(realtimeDb, `${key}/availableStock`);
    push(dataRefs, object).then((snapshot) => {
      return snapshot;
    });
  } catch (error) {
    console.error('Error fetching data:', error);
    return error;
  }
};
export const updateInAvailableProduct = async (object, id) => {
  try {
    console.log(object);
    const dataRefs = ref(realtimeDb, `${key}/availableStock/${id}`);
    set(dataRefs, object).then((snapshot) => {
      return snapshot;
    });
  } catch (error) {
    console.error('Error fetching data:', error);
    return error;
  }
};

export const saveAndBillApiCall = async (object) => {
  try {
    let dateNow = Date.now();
    await Promise.all(object.Cart.map((val) => availableProductDeduction(val)));
    const dataRefs = ref(realtimeDb, `${key}/transactions/${dateNow}`);
    await set(dataRefs, object).then((snapshot) => {});
    return dateNow;
  } catch (error) {
    console.error('Error fetching data:', error);
    return error;
  }
};
export const availableProductDeduction = async (object) => {
  try {
    let deduct = object.quantity - object.buyingQty;
    // Product deleted meanwhile: writing quantity would recreate it as a
    // stub with no name/buyPrice
    const product = await get(
      ref(realtimeDb, `${key}/availableStock/${object.id}`),
    );
    if (!product.exists()) return null;
    const dataRefs = ref(
      realtimeDb,
      `${key}/availableStock/${object.id}/quantity`,
    );
    set(dataRefs, deduct).then((snapshot) => {
      return snapshot;
    });
  } catch (error) {
    console.error('Error fetching data:', error);
    return error;
  }
};

export const fetchAvailableTransaction = async () => {
  try {
    const dataRefs = ref(realtimeDb, `${key}/transactions`);
    const snapshot = await get(dataRefs); // Use get() to fetch a single snapshot
    const value = snapshot.val();

    if (value === null || value === undefined) {
      console.warn('Data not found or empty.');
      return null; // Return null or an appropriate default value
    }
    const resultArray = Object.keys(value).map((key) => ({
      id: key,
      ...value[key],
    }));

    return resultArray;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error; // Re-throw the error for proper error handling
  }
};
export const updateInAvailableDueBalance = async (object, id) => {
  try {
    delete object.id;
    console.log(object);
    const dataRefs = ref(realtimeDb, `${key}/transactions/${id}`);
    set(dataRefs, object).then((snapshot) => {
      return snapshot;
    });
  } catch (error) {
    console.error('Error fetching data:', error);
    return error;
  }
};
export const deleteAvailableDueBalance = async (object, id) => {
  try {
    delete object.id;
    console.log(object);
    const dataRefs = ref(realtimeDb, `${key}/transactions/${id}`);
    set(dataRefs, object).then((snapshot) => {
      return snapshot;
    });
  } catch (error) {
    console.error('Error fetching data:', error);
    return error;
  }
};
export const longformatDate = (parameter) => {
  const date = new Date(parameter);
  const unixTime = Math.floor(date.getTime());
  if (parameter) return unixTime;
  else return '';
};
export const addExpenseIn = async (object, id) => {
  try {
    const dataRefs = ref(realtimeDb, `${key}/expenses/${id}`);
    set(dataRefs, object).then((snapshot) => {
      return snapshot;
    });
  } catch (error) {
    console.error('Error fetching data:', error);
    return error;
  }
};
export const fetchExpenseIn = async () => {
  try {
    const dataRefs = ref(realtimeDb, `${key}/expenses`);
    const snapshot = await get(dataRefs); // Use get() to fetch a single snapshot
    const value = snapshot.val();

    if (value === null || value === undefined) {
      console.warn('Data not found or empty.');
      return null; // Return null or an appropriate default value
    }
    const resultArray = Object.keys(value).map((key) => ({
      id: key,
      ...value[key],
    }));

    return resultArray;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error; // Re-throw the error for proper error handling
  }
};
export const deleteAvailableProduct = async (id) => {
  try {
    const dataRefs = ref(realtimeDb, `${key}/availableStock/${id}`);
    await set(dataRefs, null); // Set to null to delete
    return { success: true };
  } catch (error) {
    console.error('Error deleting product:', error);
    throw error;
  }
};

// Adds each cart line's quantity back to stock. Runs as a Firebase
// transaction so concurrent sales are not overwritten, and never recreates a
// product that was deleted. Resolves to [{ id, name, qty, restored }].
export const restockCart = async (cart) => {
  const lines = {};
  (cart || []).forEach((c) => {
    const qty = Number(c?.buyingQty) || 0;
    if (!c?.id || qty <= 0) return;
    lines[c.id] = lines[c.id] || { id: c.id, name: c.name, qty: 0 };
    lines[c.id].qty += qty;
  });
  return Promise.all(
    Object.values(lines).map(async (line) => {
      try {
        const result = await runTransaction(
          ref(realtimeDb, `${key}/availableStock/${line.id}`),
          // null may just mean "not cached yet"; returning null keeps a
          // missing product missing, and Firebase retries with server data
          (product) =>
            product
              ? {
                  ...product,
                  quantity: (Number(product.quantity) || 0) + line.qty,
                }
              : null,
        );
        return { ...line, restored: result.snapshot.exists() };
      } catch (error) {
        console.error('Error restocking product:', line.id, error);
        return { ...line, restored: false };
      }
    }),
  );
};

// Soft delete: keeps the bill and its items for history, zeroes the amounts
// so it drops out of totals, and puts the items back in stock
export const deleteTransaction = async (tx) => {
  const { id, ...bill } = JSON.parse(JSON.stringify(tx));
  const restocked = await restockCart(bill.Cart);
  await set(ref(realtimeDb, `${key}/transactions/${id}`), {
    ...bill,
    deleted: true,
    deletedAt: Date.now(),
    deletedTotal: Number(bill.totalAmmount) || 0,
    totalAmmount: 0,
    paymentOption: '',
    partialPayment: 0,
    balance: 0,
  });
  return restocked;
};

export const saveTransaction = async (tx) => {
  const { id, ...bill } = JSON.parse(JSON.stringify(tx));
  await set(ref(realtimeDb, `${key}/transactions/${id}`), bill);
};
