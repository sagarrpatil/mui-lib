import { initializeApp } from '@firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithRedirect,
} from '@firebase/auth';
import { getFirestore } from '@firebase/firestore';
import { getDatabase } from '@firebase/database';
var firebaseConfig = {
  apiKey: 'AIzaSyCRaOwpNVRQpLvR4BBhiZRDgGOeh1QeKlQ',
  authDomain: 'fitnessspacehub.firebaseapp.com',
  databaseURL: 'https://fitnessspacehub-default-rtdb.firebaseio.com',
  projectId: 'fitnessspacehub',
  storageBucket: 'fitnessspacehub.appspot.com',
  messagingSenderId: '557014361022',
  appId: '1:557014361022:web:432618e887aa7a4d998fef',
  measurementId: 'G-QQ63KRPMXK',
};
// Initialize Firebase

// if (!firebase.apps.length) {
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// }
// const storage = firebase.storage();
export { db, app as default };
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const realtimeDb = getDatabase(app);
// export const googleProvider = signInWithRedirect(auth, provider);
