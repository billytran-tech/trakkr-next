import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';
import {
  UserInfo,
  createUserWithEmailAndPassword,
  getAdditionalUserInfo,
  onAuthStateChanged,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  TwitterAuthProvider,
  signInAnonymously,
} from 'firebase/auth';
import { auth, db } from 'config/firebase';
import { doc, getDoc, onSnapshot, setDoc, updateDoc } from 'firebase/firestore';

import { User } from 'interfaces/user';

type Response = Promise<void | { error?: { message: string } }>;

interface AuthContext {
  user: User;
  signUp: (
    credentials: { name: string; email: string; password: string },
    teamId: string
  ) => Response;
  signIn: (credentials: {
    email: string;
    password: string;
  }) => Promise<UserInfo | { error?: { message: string } }>;
  signOut: () => Response;
  resetPassword: (email: string) => Response;
  updateUser: (user: { id: string; data: any }) => Response;
  deleteUser: () => Response;
  signWithGoogle: () => Response;
  signWithTwitter: () => Response;
  signWithDiscord: (token) => Response;
}

const authContext = createContext({ user: {} } as AuthContext);
const { Provider } = authContext;

// AuthProvider is a Context Provider that wraps our app and makes an auth object
// available to any child component that calls the useAuth() hook.
export function AuthProvider(props: { children: ReactNode }): JSX.Element {
  const auth = useAuthProvider();
  return <Provider value={auth}>{props.children}</Provider>;
}

// useAuth is a hook that enables any component to subscribe to auth state
export const useAuth = () => {
  return useContext(authContext);
};

// Provider hook that creates auth object and handles state
const useAuthProvider = () => {
  const [user, setUser] = useState(null);

  const createUser = async (currentUser: User) => {
    try {
      return setDoc(
        doc(db, 'users', currentUser.uid),
        { ...currentUser },
        { merge: true }
      );
    } catch (error) {
      return { error };
    }
  };

  const updateUser = async ({ id, data }) => {
    try {
      await updateDoc(doc(db, 'users', id), data);
      setUser({ ...user, ...data });
    } catch (error) {
      return { error };
    }
  };

  const deleteUser = async () => {
    try {
      await auth.currentUser.delete();
      setTimeout(() => setUser(false), 1000);
    } catch (error) {
      return { error };
    }
  };

  const signUp = async ({ name, email, password }, teamId: string) => {
    try {
      return await createUserWithEmailAndPassword(auth, email, password).then(
        (response) => {
          sendEmailVerification(auth.currentUser);
          return createUser({
            uid: response.user.uid,
            email,
            name,
            nickname: '',
            bio: '',
            phone: '',
            instagram: '',
            twitter: '',
            teamId: teamId || '',
            isAdmin: false,
            createdAt: Date.now(),
          });
        }
      );
    } catch (error) {
      return { error };
    }
  };

  const signWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      signInWithPopup(auth, provider);
    } catch (error) {
      console.log(error);
      return { error };
    }
  };

  const signWithTwitter = async () => {
    const provider = new TwitterAuthProvider();
    try {
      signInWithPopup(auth, provider);
    } catch (error) {
      console.log(error);
    }
  };

  const signWithDiscord = async (discordName) => {
    try {
      return getDoc(doc(db, 'users', discordName)).then(function (user) {
        if (user.exists()) {
          setUser({ id: user.id, ...user, ...user.data() });
        } else {
          signInAnonymously(auth);
          setDoc(
            doc(db, 'users', discordName),
            { id: discordName, name: discordName, isAdmin: false },
            { merge: true }
          );
        }
      });
    } catch (error) {
      console.log(error);
      return { error };
    }
  };

  const signIn = async ({ email, password }) => {
    try {
      const response = await signInWithEmailAndPassword(auth, email, password);
      const { user } = response;
      const additionalUserInfo = getAdditionalUserInfo(response);
      const currentUser = { ...user, ...additionalUserInfo };
      setUser(currentUser);
      getUserAdditionalData(currentUser);
      return currentUser;
    } catch (error) {
      return { error };
    }
  };

  const signOut = async () => {
    try {
      await auth.signOut();
      return setUser(false);
    } catch (error) {
      return { error };
    }
  };

  const resetPassword = async (email: string) => {
    const response = await sendPasswordResetEmail(auth, email);
    return response;
  };

  // Get the user data from Firestore
  const getUserAdditionalData = async (user: UserInfo) => {
    return getDoc(doc(db, 'users', user.uid)).then(function (doc) {
      if (doc.exists()) {
        setUser({ id: doc.id, ...user, ...doc.data() });
      } else {
        console.log('No such document!');
      }
    });
  };

  useEffect(() => {
    // Subscribe to user on mount
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user?.uid) {
        setUser(user);
        getUserAdditionalData(user);
      }
    });

    // Unsubscribe on cleanup
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (user?.uid) {
      // Subscribe to user document and update state on changes
      onSnapshot(doc(db, 'users', user.uid), (doc) => {
        if (doc.exists()) {
          setUser(doc.data());
        } else {
          console.log('No such document!');
        }
      });
    }
  }, [user?.uid]);

  return {
    user,
    signUp,
    signIn,
    signOut,
    resetPassword,
    updateUser,
    deleteUser,
    signWithGoogle,
    signWithTwitter,
    signWithDiscord,
  };
};
