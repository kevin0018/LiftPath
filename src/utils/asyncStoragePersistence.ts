import AsyncStorage from '@react-native-async-storage/async-storage';
import { Auth, User } from 'firebase/auth';

// The key we'll use to store the auth user data in AsyncStorage
const AUTH_USER_KEY = 'firebase:authUser';

// Helper to handle auth state persistence
export const setupAuthStatePersistence = (auth: Auth) => {
  // Listen for auth state changes and store them in AsyncStorage
  auth.onAuthStateChanged(async (user) => {
    if (user) {
      // User is signed in - store minimal user data
      try {
        const userData = {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
        };
        await AsyncStorage.setItem(AUTH_USER_KEY, JSON.stringify(userData));
      } catch (error) {
        console.error('Error storing auth user:', error);
      }
    } else {
      // User is signed out
      try {
        await AsyncStorage.removeItem(AUTH_USER_KEY);
      } catch (error) {
        console.error('Error removing auth user:', error);
      }
    }
  });
};

// Helper to check if a user is stored in AsyncStorage
export const getStoredUser = async (): Promise<Partial<User> | null> => {
  try {
    const userJSON = await AsyncStorage.getItem(AUTH_USER_KEY);
    return userJSON ? JSON.parse(userJSON) : null;
  } catch (error) {
    console.error('Error getting stored user:', error);
    return null;
  }
};
