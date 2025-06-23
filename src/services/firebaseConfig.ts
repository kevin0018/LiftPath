import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import Constants from 'expo-constants';

// Verificar configuración de Expo
if (!Constants.expoConfig?.extra) {
  throw new Error("Variables de entorno no encontradas en Constants.expoConfig.extra");
}

// Firebase configuration - SOLO desde variables de entorno
const firebaseConfig = {
  apiKey: Constants.expoConfig.extra.API_KEY,
  authDomain: Constants.expoConfig.extra.AUTH_DOMAIN,
  projectId: Constants.expoConfig.extra.PROJECT_ID,
  storageBucket: Constants.expoConfig.extra.STORAGE_BUCKET,
  messagingSenderId: Constants.expoConfig.extra.MESSAGING_SENDER_ID,
  appId: Constants.expoConfig.extra.APP_ID,
};

// Verificar que todas las variables estén presentes
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

// Initialize Firebase App (evitar reinicialización)
let firebaseApp;
if (getApps().length === 0) {
  firebaseApp = initializeApp(firebaseConfig);
  console.log("Firebase app inicializada");
} else {
  firebaseApp = getApps()[0];
  console.log("Firebase app ya existía");
}

// Initialize Auth - SIMPLE approach debido a problemas con initializeAuth
const auth = getAuth(firebaseApp);
console.log("Firebase Auth inicializado (simple)");

export { firebaseApp, auth };