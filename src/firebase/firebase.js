import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAuth, setPersistence, inMemoryPersistence } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyCSwrP9YtA0RyTNv6JN58ZMBuLbpFEAvog",
  authDomain: "haikuchain.firebaseapp.com",
  projectId: "haikuchain",
  storageBucket: "haikuchain.appspot.com",
  messagingSenderId: "295417598691",
  appId: "1:295417598691:web:28f5b2e2ace5b328d5abd6",
  measurementId: "G-5W05XZQ40X"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore();
export const storage = getStorage();

export const auth = getAuth(app);

setPersistence(auth, inMemoryPersistence);


export default app;