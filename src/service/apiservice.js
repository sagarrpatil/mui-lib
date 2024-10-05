import { realtimeDb } from '../firebase';
import {
  getDatabase,
  ref,
  onValue,
  once,
  set,
  push,
  get,
} from '@firebase/database';
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
    const dataRefs = ref(realtimeDb, `${key}/transactions/${dateNow}`);
    object.Cart.map((val) => availableProductDeduction(val));
    set(dataRefs, object).then((snapshot) => {});
    return dateNow;
  } catch (error) {
    console.error('Error fetching data:', error);
    return error;
  }
};
export const availableProductDeduction = async (object) => {
  try {
    let deduct = object.quantity - object.buyingQty;
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
