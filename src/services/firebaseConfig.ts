import { initializeApp, getApps } from 'firebase/app';
import { initializeAuth, getReactNativePersistence, type Auth, getAuth } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';

// Validate that all required environment variables are present in expoConfig.extra
const requiredVars = [
  'API_KEY',
  'AUTH_DOMAIN',
  'PROJECT_ID',
  'STORAGE_BUCKET',
  'MESSAGING_SENDER_ID',
  'APP_ID',
  'GOOGLE_WEB_CLIENT_ID',
];

if (!Constants.expoConfig?.extra) {
  throw new Error('Environment variables not found in Constants.expoConfig.extra');
}

for (const varName of requiredVars) {
  if (!Constants.expoConfig.extra[varName]) {
    throw new Error(`Missing environment variable: ${varName}`);
  }
}

// Firebase configuration object
const firebaseConfig = {
  apiKey: Constants.expoConfig.extra.API_KEY,
  authDomain: Constants.expoConfig.extra.AUTH_DOMAIN,
  projectId: Constants.expoConfig.extra.PROJECT_ID,
  storageBucket: Constants.expoConfig.extra.STORAGE_BUCKET,
  messagingSenderId: Constants.expoConfig.extra.MESSAGING_SENDER_ID,
  appId: Constants.expoConfig.extra.APP_ID,
};

// Initialize Firebase App (singleton)
const firebaseApp = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// Initialize Auth with AsyncStorage persistence (singleton, safe pattern)
let auth: Auth;
try {
  auth = initializeAuth(firebaseApp, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
} catch (e: any) {
  // If already initialized, fallback to getAuth
  auth = getAuth(firebaseApp);
}

export { firebaseApp, auth };