import { initializeApp, getApps } from 'firebase/app';
import { initializeAuth, getAuth, type Auth } from 'firebase/auth';
import { setupAuthStatePersistence } from '../utils/asyncStoragePersistence';
import Constants from 'expo-constants';

// Check if the environment variables are available
if (!Constants.expoConfig?.extra) {
  throw new Error("Variables de entorno no encontradas en Constants.expoConfig.extra");
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

// Verify that all required environment variables are present
const requiredVars = ['API_KEY', 'AUTH_DOMAIN', 'PROJECT_ID', 'STORAGE_BUCKET', 'MESSAGING_SENDER_ID', 'APP_ID'];
for (const varName of requiredVars) {
  if (!Constants.expoConfig.extra[varName]) {
    throw new Error(`Variable de entorno faltante: ${varName}`);
  }
}

console.log("Configurando Firebase...", {
  projectId: firebaseConfig.projectId,
  hasApiKey: !!firebaseConfig.apiKey
});

// Initialize Firebase App
let firebaseApp;
if (getApps().length === 0) {
  firebaseApp = initializeApp(firebaseConfig);
  console.log("Firebase app inicializada");
} else {
  firebaseApp = getApps()[0];
  console.log("Firebase app ya existía");
}

// Initialize Auth
let auth: Auth;
try {
  auth = getAuth(firebaseApp);
  console.log("Firebase Auth obtenido de instancia existente");
} catch (error) {
  try {
    auth = initializeAuth(firebaseApp);
    console.log("Firebase Auth inicializado nuevo");
  } catch (initError) {
    auth = getAuth(firebaseApp);
    console.log("Firebase Auth fallback a getAuth");
  }
}

// Configure persistence with AsyncStorage
setupAuthStatePersistence(auth);
console.log("Persistencia de Auth configurada con AsyncStorage");

export { firebaseApp, auth };