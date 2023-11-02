import firebase from 'firebase/app';

import 'firebase/analytics';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/storage';
const firebaseConfig = {
    apiKey: 'AIzaSyCOIdnKCfEzdfWEJg2mEJMyQsCvNKGihfo',
    authDomain: 'chat-app-vn-ea3bc.firebaseapp.com',
    projectId: 'chat-app-vn-ea3bc',
    storageBucket: 'chat-app-vn-ea3bc.appspot.com',
    messagingSenderId: '885670364208',
    appId: '1:885670364208:web:bb5629867de66d4030d9f5',
    measurementId: 'G-KT9DJ6E492',
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
