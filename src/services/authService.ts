import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import firebaseApp from './firebaseConfig';

const auth = getAuth(firebaseApp);

/**
 * Sign in a user with email and password
 */
export const signIn = async (email: string, password: string) => {
  return await signInWithEmailAndPassword(auth, email, password);
};

/**
 * Register a new user
 */
export const registerUser = async (email: string, password: string) => {
  return await createUserWithEmailAndPassword(auth, email, password);
};

/**
 * Sign out the current user
 */
export const logout = async () => {
  return await signOut(auth);
};