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
