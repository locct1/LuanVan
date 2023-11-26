import firebase from 'firebase/app';

import 'firebase/analytics';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/storage';
const firebaseConfig = {
    apiKey: 'AIzaSyAc_drYZam41ufjsXC6tWiekTuyc5mJ4gc',
    authDomain: 'chat-25-11.firebaseapp.com',
    projectId: 'chat-25-11',
    storageBucket: 'chat-25-11.appspot.com',
    messagingSenderId: '510313477458',
    appId: '1:510313477458:web:a578b41358c886efd5f68b',
    measurementId: 'G-J7W9G739G0',
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();

const auth = firebase.auth();
const db = firebase.firestore();
const storage = firebase.storage();

if (window.location.hostname === 'localhost') {
    // auth.useEmulator('http://localhost:9099');
    // db.useEmulator('localhost', '8080');
}

export { db, auth, storage };
export default firebase;
