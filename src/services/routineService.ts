import { getFirestore, collection, addDoc, updateDoc, deleteDoc, doc, getDocs, query, where, getDoc } from 'firebase/firestore';
import { firebaseApp } from './firebaseConfig';
import { auth } from './firebaseConfig';

// Initialize Firestore
const db = getFirestore(firebaseApp);

// Define Workout Routine type
export interface WorkoutRoutine {
  id?: string;
  name: string;
  description: string;
  userId: string;
  createdAt?: number;
  updatedAt?: number;
}

/**
 * Fetches all routines for the current user
 */
export const getUserRoutines = async (): Promise<WorkoutRoutine[]> => {
  try {
    if (!auth.currentUser) {
      throw new Error('User not authenticated');
    }

    const userId = auth.currentUser.uid;
    const routinesRef = collection(db, 'routines');
    const q = query(routinesRef, where('userId', '==', userId));
    
    const querySnapshot = await getDocs(q);
    
    const routines: WorkoutRoutine[] = [];
    querySnapshot.forEach((doc) => {
      routines.push({ 
        id: doc.id, 
        ...doc.data() 
      } as WorkoutRoutine);
    });
    
    // Sort by updatedAt descending (newest first)
    return routines.sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0));
  } catch (error) {
    console.error('Error fetching user routines:', error);
    throw error;
  }
};

/**
 * Gets a single routine by ID
 */
export const getRoutineById = async (routineId: string): Promise<WorkoutRoutine> => {
  try {
    const routineRef = doc(db, 'routines', routineId);
    const routineSnap = await getDoc(routineRef);
    
    if (routineSnap.exists()) {
      return { id: routineSnap.id, ...routineSnap.data() } as WorkoutRoutine;
    } else {
      throw new Error('Routine not found');
    }
  } catch (error) {
    console.error('Error fetching routine:', error);
    throw error;
  }
};

/**
 * Creates a new workout routine
 */
export const createRoutine = async (routineData: Omit<WorkoutRoutine, 'id' | 'userId' | 'createdAt' | 'updatedAt'>): Promise<WorkoutRoutine> => {
  try {
    if (!auth.currentUser) {
      throw new Error('User not authenticated');
    }

    const userId = auth.currentUser.uid;
    const timestamp = Date.now();
    
    const newRoutine: Omit<WorkoutRoutine, 'id'> = {
      ...routineData,
      userId,
      createdAt: timestamp,
      updatedAt: timestamp
    };
    
    const docRef = await addDoc(collection(db, 'routines'), newRoutine);
    
    return {
      id: docRef.id,
      ...newRoutine
    };
  } catch (error) {
    console.error('Error creating routine:', error);
    throw error;
  }
};

/**
 * Updates an existing workout routine
 */
export const updateRoutine = async (routineId: string, routineData: Partial<WorkoutRoutine>): Promise<void> => {
  try {
    if (!auth.currentUser) {
      throw new Error('User not authenticated');
    }

    const routineRef = doc(db, 'routines', routineId);
    const routineSnap = await getDoc(routineRef);
    
    // Check if routine exists and belongs to current user
    if (routineSnap.exists()) {
      const routine = routineSnap.data();
      if (routine.userId !== auth.currentUser.uid) {
        throw new Error('Not authorized to update this routine');
      }
      
      // Update the document
      await updateDoc(routineRef, {
        ...routineData,
        updatedAt: Date.now()
      });
    } else {
      throw new Error('Routine not found');
    }
  } catch (error) {
    console.error('Error updating routine:', error);
    throw error;
  }
};

/**
 * Deletes a workout routine
 */
export const deleteRoutine = async (routineId: string): Promise<void> => {
  try {
    if (!auth.currentUser) {
      throw new Error('User not authenticated');
    }

    const routineRef = doc(db, 'routines', routineId);
    const routineSnap = await getDoc(routineRef);
    
    // Check if routine exists and belongs to current user
    if (routineSnap.exists()) {
      const routine = routineSnap.data();
      if (routine.userId !== auth.currentUser.uid) {
        throw new Error('Not authorized to delete this routine');
      }
      
      // Delete the document
      await deleteDoc(routineRef);
    } else {
      throw new Error('Routine not found');
    }
  } catch (error) {
    console.error('Error deleting routine:', error);
    throw error;
  }
};
