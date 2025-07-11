import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut,
  GoogleAuthProvider,
  signInWithCredential
} from "firebase/auth";
import { auth } from "./firebaseConfig";
import Constants from 'expo-constants';

// Check if running in Expo Go environment
const isExpoGo = Constants.appOwnership === 'expo';

// Configure Google Sign-In only if not in Expo Go
let GoogleSignin: any = null;
if (!isExpoGo) {
  try {
    GoogleSignin = require('@react-native-google-signin/google-signin').GoogleSignin;
    GoogleSignin.configure({
      webClientId: Constants.expoConfig?.extra?.GOOGLE_WEB_CLIENT_ID || '',
    });
  } catch (error) {
    console.warn('Google Sign-In not available in Expo Go environment');
  }
}

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

/**
 * Sign in with Google
 */
/**
 * Sign in with Google - Only works in custom development builds, not Expo Go
 */
export const signInWithGoogle = async () => {
  // Check if running in Expo Go
  if (isExpoGo || !GoogleSignin) {
    throw new Error('Google Sign-In no está disponible en Expo Go. Usa un custom development build.');
  }

  try {
    // Verify Google Play Services availability
    await GoogleSignin.hasPlayServices();
    
    // Get user info from Google
    const userInfo = await GoogleSignin.signIn();
    
    // Create Firebase credential with Google token
    const googleCredential = GoogleAuthProvider.credential(
      userInfo.data?.idToken
    );
    
    // Authenticate with Firebase using Google credential
    return await signInWithCredential(auth, googleCredential);
  } catch (error: any) {
    console.error('Error in Google Sign-In:', error);
    throw error;
  }
};