import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut,
  GoogleAuthProvider,
  signInWithCredential
} from "firebase/auth";
import { auth } from "./firebaseConfig";
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import Constants from 'expo-constants';

// Configurar Google Sign-In
GoogleSignin.configure({
  webClientId: Constants.expoConfig?.extra?.GOOGLE_WEB_CLIENT_ID || '', // Del proyecto Firebase
});

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
export const signInWithGoogle = async () => {
  try {
    // Verificar si Google Play Services está disponible
    await GoogleSignin.hasPlayServices();
    
    // Obtener información del usuario de Google
    const userInfo = await GoogleSignin.signIn();
    
    // Crear credencial de Firebase con el token de Google
    const googleCredential = GoogleAuthProvider.credential(
      userInfo.data?.idToken
    );
    
    // Autenticar con Firebase usando la credencial de Google
    return await signInWithCredential(auth, googleCredential);
  } catch (error: any) {
    console.error('Error en Google Sign-In:', error);
    throw error;
  }
};