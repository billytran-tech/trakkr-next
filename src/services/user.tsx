import { doc, getDoc } from 'firebase/firestore';

import { db } from 'config/firebase';

export const getUser = (uid: string): any => {
  return getDoc(doc(db, 'users', uid)).then((doc) => doc.data());
};
