import { realtimeDb } from "../firebase";
import { getDatabase, ref, onValue, once, set } from "@firebase/database";
const key = localStorage.getItem("token");

export const fetchAvailableProduct = async () => {
    try {
        const dataRefs = ref(realtimeDb, `available/${key}`);
        const unsubscribe = onValue(dataRefs, (snapshot) => {
            let value = snapshot.val();
            // const items = [];
            // Object.keys(value).map((id) => {
            //     items.push({ id: id, ...value[id] });
            // });
            return value;
        })
    } catch (error) {
        console.error("Error fetching data:", error);
        return error;
    }
}