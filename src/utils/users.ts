import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';

import { db } from 'config/firebase';

export function getUser(uid) {
  return getDoc(doc(db, 'users', uid));
}

export function createUser(uid, data) {
  return setDoc(doc(db, 'users', uid), data, { merge: true });
}

export function updateUser(uid, data) {
  return updateDoc(doc(db, 'users', uid), data);
}
