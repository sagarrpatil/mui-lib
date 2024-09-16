import { realtimeDb } from "../firebase";
import { getDatabase, ref, onValue, once, set , push} from "@firebase/database";
const key = localStorage.getItem("token");

export const fetchAvailableProduct = async () => {
    try {
        const dataRefs = ref(realtimeDb, `${key}/availableStock`);
        const unsubscribe = onValue(dataRefs, (snapshot) => {
            let value = snapshot.val();
            return value;
        })
    } catch (error) {
        console.error("Error fetching data:", error);
        return error;
    }
}
export const addInAvailableProduct = async (object) => {
    try {
        const dataRefs = ref(realtimeDb, `${key}/availableStock`);
        push(dataRefs, object)
            .then((snapshot) => {
              return snapshot.val();
            });
     
    } catch (error) {
        console.error("Error fetching data:", error);
        return error;
    }
}