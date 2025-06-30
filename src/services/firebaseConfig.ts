import { initializeApp, getApps } from 'firebase/app';
import { initializeAuth, type Auth, getAuth } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { setupAuthStatePersistence } from '../utils/asyncStoragePersistence';
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

// Initialize Auth with proper error handling for React Native
let auth: Auth;
try {
  // Try to initialize auth first
  auth = initializeAuth(firebaseApp);
} catch (e: any) {
  // If already initialized, get existing instance
  auth = getAuth(firebaseApp);
}

// Setup custom AsyncStorage persistence
setupAuthStatePersistence(auth);

export { firebaseApp, auth };