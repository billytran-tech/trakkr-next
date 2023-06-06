import { auth, db } from 'config/firebase';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  updateDoc,
  where,
} from 'firebase/firestore';

import { makeId } from 'utils/makeId';

export const createTeam = (data: { name: string }): Promise<any> => {
  const { name } = data;
  const id = makeId(name);
  const ownerId = auth.currentUser.uid;
  const users = [
    {
      uid: auth.currentUser.uid,
      email: auth.currentUser.email,
      role: 'owner',
      status: 'active',
      createdAt: Date.now(),
    },
  ];
  const teamData = { id, name, ownerId, users };

  return setDoc(doc(db, 'teams', id), teamData, { merge: true });
};

export const updateTeam = (id: string, data: any): Promise<any> => {
  return updateDoc(doc(db, 'teams', id), data);
};

export const getTeam = (teamId: string): Promise<any> => {
  return getDoc(doc(db, 'teams', teamId)).then((doc) => doc.data());
};

export const getTeamName = (teamId: string): Promise<any> => {
  return getDoc(doc(db, 'teams', teamId)).then((doc) => doc.data()?.name);
};

/**
 * isSlugAvailable checks if a team already has the given slug
 */
export const isSlugAvailable = async (slug: string): Promise<boolean> => {
  const q = await query(collection(db, 'teams'), where('slug', '==', slug));
  const querySnapshot = await getDocs(q);
  return querySnapshot.empty;
};
