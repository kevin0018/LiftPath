import { initializeApp } from 'firebase/app';
import { initializeAuth, browserLocalPersistence } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';

// Ensure Expo configuration exists
if (!Constants.expoConfig || !Constants.expoConfig.extra) {
  throw new Error("¡Faltan las variables de configuración de Expo!");
}

// Firebase configuration
const firebaseConfig = {
  apiKey: Constants.expoConfig.extra.API_KEY,
  authDomain: Constants.expoConfig.extra.AUTH_DOMAIN,
  projectId: Constants.expoConfig.extra.PROJECT_ID,
  storageBucket: Constants.expoConfig.extra.STORAGE_BUCKET,
  messagingSenderId: Constants.expoConfig.extra.MESSAGING_SENDER_ID,
  appId: Constants.expoConfig.extra.APP_ID,
};

// Initialize Firebase App
const firebaseApp = initializeApp(firebaseConfig);

// Initialize Firebase Auth
const auth = initializeAuth(firebaseApp, {
  persistence: browserLocalPersistence,
});

export { firebaseApp, auth };