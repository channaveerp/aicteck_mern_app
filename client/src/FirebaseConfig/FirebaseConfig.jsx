// firebaseConfig.js
import { initializeApp, getApps } from 'firebase/app';
import { getStorage } from 'firebase/storage';

console.log('Firebase apps:', getApps());
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyADBfZlNJyVINqPCq4wmtsms_B0kkzy8nI',
  authDomain: 'uploadingfile-c9cf9.firebaseapp.com',
  projectId: 'uploadingfile-c9cf9',
  storageBucket: 'uploadingfile-c9cf9.appspot.com',
  messagingSenderId: '247314125315',
  appId: '1:247314125315:web:877d3d8249ad33c25f3436',
  measurementId: 'G-CE4BV8Q3SM',
};

// Initialize Firebase
const app =
  getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const storage = getStorage(app);
// console.log('storage', storage());
// vbvbv
console.log('Firebase initialized:', app);

export { app, storage }; // Ensure both app and storage are exported
