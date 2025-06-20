import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from "firebase/auth";
import { firebaseApp } from "./firebaseConfig";

const auth = getAuth(firebaseApp);

/**
 * Sign in a user with email and password
 */
export const signIn = async (email: string, password: string) => {
  try {
    return await signInWithEmailAndPassword(auth, email, password);
  } catch (error) {
    throw error;
  }
};

/**
 * Register a new user
 */
export const registerUser = async (email: string, password: string) => {
  try {
    return await createUserWithEmailAndPassword(auth, email, password);
  } catch (error) {
    throw error;
  }
};

/**
 * Sign out the current user
 */
export const logout = async () => {
  try {
    return await signOut(auth);
  } catch (error) {
    throw error;
  }
};