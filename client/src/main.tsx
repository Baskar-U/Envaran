import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { db, auth } from './lib/firebase';
import { collection, addDoc, getDocs, getDoc, setDoc, query, where, orderBy, doc, updateDoc } from 'firebase/firestore';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';

// Temporarily expose Firebase functions for console access
if (typeof window !== 'undefined') {
  (window as any).db = db;
  (window as any).auth = auth;
  (window as any).collection = collection;
  (window as any).addDoc = addDoc;
  (window as any).getDocs = getDocs;
  (window as any).query = query;
  (window as any).where = where;
  (window as any).orderBy = orderBy;
  (window as any).doc = doc;
  (window as any).updateDoc = updateDoc;
  (window as any).getDoc = getDoc;
  (window as any).setDoc = setDoc;
  (window as any).createUserWithEmailAndPassword = createUserWithEmailAndPassword;
  (window as any).signInWithEmailAndPassword = signInWithEmailAndPassword;
  
  // Add a helper function to check Firebase availability
  (window as any).checkFirebaseReady = () => {
    // console.log('🔧 Firebase Status Check:');
    // console.log('✅ Database:', !!window.db);
    // console.log('✅ Auth:', !!window.auth);
    // console.log('✅ Collection:', !!window.collection);
    // console.log('✅ UpdateDoc:', !!window.updateDoc);
    // console.log('✅ GetDocs:', !!window.getDocs);
    return !!(window.db && window.auth && window.collection && window.updateDoc && window.getDocs);
  };
  
  // console.log('🔧 Firebase functions exposed to window for console access');
  // console.log('💡 Available: window.db, window.auth, window.collection, window.addDoc, window.getDocs, window.query, window.where, window.orderBy, window.doc, window.updateDoc, window.createUserWithEmailAndPassword, window.signInWithEmailAndPassword');
  // console.log('💡 Helper: window.checkFirebaseReady() - Check if Firebase is ready');
}
createRoot(document.getElementById("root")!).render(<App />);
