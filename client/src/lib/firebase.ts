import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { WhereFilterOp } from 'firebase/firestore';

// Firebase configuration for hosting (matrimony-final project)
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyDNsXs5_M_NhvTtoYjS5-I9LyECxGZruY8",
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "matrimony-final.firebaseapp.com",
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "matrimony-final",
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "matrimony-final.firebasestorage.app",
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "738610697545",
    appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:738610697545:web:0c26093b694181d9787698",
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-7ER1K1BD66"
  };

// Firebase configuration for database and storage (existing data from matrimony-events)
const firebaseConfigDB = {
    apiKey: "AIzaSyBHCdGBysevoCNZeI0oAXVBEbKUtyuai4k",
    authDomain: "matrimony-events.firebaseapp.com",
    projectId: "matrimony-events",
    storageBucket: "matrimony-events.firebasestorage.app",
    messagingSenderId: "719624016803",
    appId: "1:719624016803:web:f332698f12225f1fbdc016",
    measurementId: "G-MK7T3DHCK6"
  };

// Initialize Firebase for hosting and authentication (matrimony-final project)
const app = initializeApp(firebaseConfig);

// Initialize Firebase for database and storage (matrimony-events project)
const appDB = initializeApp(firebaseConfigDB, 'database');

// Initialize Firebase Authentication and get a reference to the service (using DB config for consistency)
export const auth = getAuth(appDB);

// Initialize Cloud Firestore and get a reference to the service (using DB config)
export const db = getFirestore(appDB);

// Initialize Firebase Storage and get a reference to the service (using DB config)
export const storage = getStorage(appDB);

// TEMPORARY: Make Firebase globally accessible for setup script
// Remove this after setup is complete
if (typeof window !== 'undefined') {
  (window as any).firebase = {
    firestore: () => ({
      collection: (collectionName: string) => ({
        doc: (docId: string) => ({
          set: async (data: any) => {
            const { doc, setDoc } = await import('firebase/firestore');
            const docRef = doc(db, collectionName, docId);
            return setDoc(docRef, data);
          }
        }),
        where: (field: string, operator: WhereFilterOp, value: any) => ({
          get: async () => {
            const { collection, query, where, getDocs } = await import('firebase/firestore');
            const q = query(collection(db, collectionName), where(field, operator, value));
            return getDocs(q);
          }
        }),
        orderBy: (field: string, direction: 'asc' | 'desc' = 'desc') => ({
          get: async () => {
            const { collection, query, orderBy, getDocs } = await import('firebase/firestore');
            const q = query(collection(db, collectionName), orderBy(field, direction));
            return getDocs(q);
          }
        })
      })
    })
  };
  
  // console.log('✅ Firebase made globally accessible for setup script');
}

export default app;
