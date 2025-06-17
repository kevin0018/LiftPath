import { initializeApp } from 'firebase/app';
import Constants from 'expo-constants';

if (!Constants.expoConfig || !Constants.expoConfig.extra) {
  throw new Error("Expo configuration or extra variables are missing!");
}

// Firebase configuration object
const firebaseConfig = {
  apiKey: Constants.expoConfig.extra.API_KEY,
  authDomain: Constants.expoConfig.extra.AUTH_DOMAIN,
  projectId: Constants.expoConfig.extra.PROJECT_ID,
  storageBucket: Constants.expoConfig.extra.STORAGE_BUCKET,
  messagingSenderId: Constants.expoConfig.extra.MESSAGING_SENDER_ID,
  appId: Constants.expoConfig.extra.APP_ID
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);

export default firebaseApp;