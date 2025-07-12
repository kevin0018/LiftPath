import { getFirestore, collection, addDoc, updateDoc, deleteDoc, doc, getDocs, query, where, getDoc } from 'firebase/firestore';
import { firebaseApp } from './firebaseConfig';
import { auth } from './firebaseConfig';

// Initialize Firestore
const db = getFirestore(firebaseApp);

// Flag to track if default routines have been initialized
let defaultRoutinesInitialized = false;

// Define Exercise type
export interface Exercise {
  id?: string;
  name: string;
  sets?: number;
  reps?: string;
  weight?: string;
  notes?: string;
}

// Define Workout Routine type
export interface WorkoutRoutine {
  id?: string;
  name: string;
  description: string;
  userId: string;
  exercises?: Exercise[];
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
    
    // If no routines exist, initialize default routines
    if (routines.length === 0) {
      if (!defaultRoutinesInitialized) {
        console.log("No routines found, initializing defaults");
        try {
          const defaultRoutines = await initializeDefaultRoutines();
          // Set flag to avoid repeated initialization attempts
          defaultRoutinesInitialized = true;
          return defaultRoutines;
        } catch (initError) {
          console.error('Error initializing default routines:', initError);
          // Return empty array instead of throwing to avoid breaking the UI
          return [];
        }
      } else {
        console.log("Default routines were already initialized but none found");
        return [];
      }
    }
    
    // Set flag to avoid repeated initialization attempts if user already has routines
    defaultRoutinesInitialized = true;
    
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
/**
 * Helper function to handle Firebase permission errors
 */
const handleFirebaseError = (error: any): never => {
  if (error.code === 'permission-denied') {
    console.error('Firebase permission denied. This might be due to missing security rules:', error);
    throw new Error('No tienes permiso para realizar esta operación. Contacta al administrador.');
  }
  
  if (error.message && error.message.includes('insufficient permissions')) {
    console.error('Firebase insufficient permissions:', error);
    throw new Error('No tienes permiso suficiente para realizar esta operación. Contacta al administrador.');
  }
  
  throw error;
};

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
    return handleFirebaseError(error);
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
    return handleFirebaseError(error);
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
    return handleFirebaseError(error);
  }
};

/**
 * Add an exercise to a routine
 */
export const addExerciseToRoutine = async (routineId: string, exercise: Omit<Exercise, 'id'>): Promise<Exercise> => {
  try {
    if (!auth.currentUser) {
      throw new Error('User not authenticated');
    }

    // First check if the routine exists and belongs to the current user
    const routineRef = doc(db, 'routines', routineId);
    const routineSnap = await getDoc(routineRef);
    
    if (!routineSnap.exists()) {
      throw new Error('Routine not found');
    }
    
    const routineData = routineSnap.data();
    if (routineData.userId !== auth.currentUser.uid) {
      throw new Error('Not authorized to update this routine');
    }
    
    // Create the new exercise with ID
    const newExercise: Exercise = {
      ...exercise,
      id: Date.now().toString() // Simple ID generation
    };
    
    // Add the exercise to the routine
    const exercises = routineData.exercises || [];
    await updateDoc(routineRef, {
      exercises: [...exercises, newExercise],
      updatedAt: Date.now()
    });
    
    return newExercise;
  } catch (error) {
    console.error('Error adding exercise to routine:', error);
    return handleFirebaseError(error);
  }
};

/**
 * Update an exercise in a routine
 */
export const updateExerciseInRoutine = async (
  routineId: string, 
  exerciseId: string, 
  updatedExercise: Partial<Exercise>
): Promise<Exercise> => {
  try {
    if (!auth.currentUser) {
      throw new Error('User not authenticated');
    }

    // Check if the routine exists and belongs to the current user
    const routineRef = doc(db, 'routines', routineId);
    const routineSnap = await getDoc(routineRef);
    
    if (!routineSnap.exists()) {
      throw new Error('Routine not found');
    }
    
    const routineData = routineSnap.data();
    if (routineData.userId !== auth.currentUser.uid) {
      throw new Error('Not authorized to update this routine');
    }
    
    // Find and update the exercise
    const exercises = routineData.exercises || [];
    const exerciseIndex = exercises.findIndex((ex: Exercise) => ex.id === exerciseId);
    
    if (exerciseIndex === -1) {
      throw new Error('Exercise not found in the routine');
    }
    
    // Update the exercise
    const updatedExercises = [...exercises];
    updatedExercises[exerciseIndex] = {
      ...updatedExercises[exerciseIndex],
      ...updatedExercise
    };
    
    // Update the routine document
    await updateDoc(routineRef, {
      exercises: updatedExercises,
      updatedAt: Date.now()
    });
    
    return updatedExercises[exerciseIndex] as Exercise;
  } catch (error) {
    console.error('Error updating exercise:', error);
    return handleFirebaseError(error);
  }
};

/**
 * Delete an exercise from a routine
 */
export const deleteExerciseFromRoutine = async (routineId: string, exerciseId: string): Promise<void> => {
  try {
    if (!auth.currentUser) {
      throw new Error('User not authenticated');
    }

    // Check if the routine exists and belongs to the current user
    const routineRef = doc(db, 'routines', routineId);
    const routineSnap = await getDoc(routineRef);
    
    if (!routineSnap.exists()) {
      throw new Error('Routine not found');
    }
    
    const routineData = routineSnap.data();
    if (routineData.userId !== auth.currentUser.uid) {
      throw new Error('Not authorized to update this routine');
    }
    
    // Filter out the exercise to delete
    const exercises = routineData.exercises || [];
    const updatedExercises = exercises.filter((ex: Exercise) => ex.id !== exerciseId);
    
    // Update the routine document
    await updateDoc(routineRef, {
      exercises: updatedExercises,
      updatedAt: Date.now()
    });
  } catch (error) {
    console.error('Error deleting exercise:', error);
    return handleFirebaseError(error);
  }
};

/**
 * Initialize default workout routines for a user
 * This should be called when a user first logs in or when they have no routines
 */
export const initializeDefaultRoutines = async (): Promise<WorkoutRoutine[]> => {
  try {
    // Verificar si el usuario está autenticado
    if (!auth.currentUser) {
      console.error("No se pueden crear rutinas predeterminadas: usuario no autenticado");
      return [];
    }
    
    // Si ya inicializamos antes, no lo hacemos de nuevo
    if (defaultRoutinesInitialized) {
      console.log("Las rutinas predeterminadas ya fueron inicializadas anteriormente");
      return [];
    }
    
    // Revisar si el usuario ya tiene rutinas (sin usar getUserRoutines para evitar bucle)
    const userId = auth.currentUser.uid;
    const routinesRef = collection(db, 'routines');
    const q = query(routinesRef, where('userId', '==', userId));
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      console.log("El usuario ya tiene rutinas, omitiendo inicialización predeterminada");
      defaultRoutinesInitialized = true;
      
      // Convertir y devolver las rutinas existentes
      const existingRoutines: WorkoutRoutine[] = [];
      querySnapshot.forEach((doc) => {
        existingRoutines.push({ 
          id: doc.id, 
          ...doc.data() 
        } as WorkoutRoutine);
      });
      return existingRoutines;
    }

    const userId = auth.currentUser.uid;
    const timestamp = Date.now();
    const defaultRoutines: Array<Omit<WorkoutRoutine, 'id'>> = [
      // Push Day Routine
      {
        name: "Push Day",
        description: "Enfocada en pecho, hombros y tríceps",
        userId,
        createdAt: timestamp,
        updatedAt: timestamp,
        exercises: [
          {
            id: `push-1-${Date.now()}`,
            name: "Press de banca",
            sets: 4,
            reps: "8-10",
            notes: "Controlar el descenso, tocar el pecho"
          },
          {
            id: `push-2-${Date.now() + 1}`,
            name: "Press militar",
            sets: 3,
            reps: "8-12",
            notes: "Mantener core activo, no arquear la espalda"
          },
          {
            id: `push-3-${Date.now() + 2}`,
            name: "Press inclinado con mancuernas",
            sets: 3,
            reps: "10-12",
            notes: "Mantén los codos a 45° del cuerpo"
          },
          {
            id: `push-4-${Date.now() + 3}`,
            name: "Fondos en paralelas",
            sets: 3,
            reps: "10-12",
            notes: "Si es necesario, usar máquina de asistencia"
          },
          {
            id: `push-5-${Date.now() + 4}`,
            name: "Extensiones de tríceps en polea alta",
            sets: 3,
            reps: "12-15",
            notes: "Mantener los codos pegados al cuerpo"
          },
          {
            id: `push-6-${Date.now() + 5}`,
            name: "Elevaciones laterales",
            sets: 3,
            reps: "12-15",
            notes: "Mantener una ligera flexión en los codos"
          }
        ]
      },
      // Pull Day Routine
      {
        name: "Pull Day",
        description: "Enfocada en espalda y bíceps",
        userId,
        createdAt: timestamp,
        updatedAt: timestamp,
        exercises: [
          {
            id: `pull-1-${Date.now()}`,
            name: "Dominadas",
            sets: 4,
            reps: "6-10",
            notes: "Si es necesario, usar máquina de asistencia"
          },
          {
            id: `pull-2-${Date.now() + 1}`,
            name: "Remo con barra",
            sets: 4,
            reps: "8-10",
            notes: "Mantener espalda recta, llevar la barra al abdomen"
          },
          {
            id: `pull-3-${Date.now() + 2}`,
            name: "Remo con mancuerna a una mano",
            sets: 3,
            reps: "10-12",
            notes: "Apoyar una rodilla y una mano en el banco"
          },
          {
            id: `pull-4-${Date.now() + 3}`,
            name: "Pulldown en polea",
            sets: 3,
            reps: "10-12",
            notes: "Llevar la barra hacia el pecho, no hacia la nuca"
          },
          {
            id: `pull-5-${Date.now() + 4}`,
            name: "Curl de bíceps con barra",
            sets: 3,
            reps: "10-12",
            notes: "No balancear el cuerpo"
          },
          {
            id: `pull-6-${Date.now() + 5}`,
            name: "Curl martillo",
            sets: 3,
            reps: "12-15",
            notes: "Mantener muñecas neutras durante todo el movimiento"
          }
        ]
      },
      // Leg Day Routine
      {
        name: "Leg Day",
        description: "Enfocada en piernas y glúteos",
        userId,
        createdAt: timestamp,
        updatedAt: timestamp,
        exercises: [
          {
            id: `leg-1-${Date.now()}`,
            name: "Sentadilla con barra",
            sets: 4,
            reps: "8-10",
            notes: "Mantener la espalda recta, profundidad por debajo de paralelo"
          },
          {
            id: `leg-2-${Date.now() + 1}`,
            name: "Peso muerto rumano",
            sets: 3,
            reps: "8-10",
            notes: "Mantener espalda recta, descender hasta sentir estiramiento en isquios"
          },
          {
            id: `leg-3-${Date.now() + 2}`,
            name: "Extensiones de cuádriceps",
            sets: 3,
            reps: "12-15",
            notes: "Contraer completamente el cuádriceps en la parte alta"
          },
          {
            id: `leg-4-${Date.now() + 3}`,
            name: "Curl de isquiotibiales",
            sets: 3,
            reps: "12-15",
            notes: "Contraer glúteos durante el ejercicio"
          },
          {
            id: `leg-5-${Date.now() + 4}`,
            name: "Elevaciones de pantorrilla de pie",
            sets: 4,
            reps: "15-20",
            notes: "Elevar al máximo y descender completamente"
          },
          {
            id: `leg-6-${Date.now() + 5}`,
            name: "Hip thrust",
            sets: 3,
            reps: "12-15",
            notes: "Contraer glúteos en la parte alta del movimiento"
          }
        ]
      }
    ];

    // Create each routine in Firestore
    const createdRoutines: WorkoutRoutine[] = [];
    let errorCount = 0;
    
    for (const routine of defaultRoutines) {
      try {
        const docRef = await addDoc(collection(db, 'routines'), routine);
        createdRoutines.push({
          id: docRef.id,
          ...routine
        });
        console.log(`Rutina predeterminada creada: ${routine.name}`);
      } catch (e: any) {
        errorCount++;
        console.error(`Error al añadir rutina predeterminada "${routine.name}":`, e?.message || e);
        
        // Si es un error de permisos, mostramos un mensaje más detallado
        if (e?.code === 'permission-denied' || (e?.message && e.message.includes('insufficient permissions'))) {
          console.error(`⚠️ Error de permisos al crear rutina "${routine.name}". Verifica las reglas de Firebase.`);
        }
      }
    }

    // Establecemos la bandera incluso si hubo errores para evitar intentos repetidos
    defaultRoutinesInitialized = true;
    
    if (createdRoutines.length > 0) {
      console.log(`✅ Se crearon ${createdRoutines.length} rutinas predeterminadas exitosamente`);
      if (errorCount > 0) {
        console.warn(`⚠️ ${errorCount} rutinas no pudieron ser creadas debido a errores`);
      }
      return createdRoutines;
    } else {
      console.error("❌ No se pudo crear ninguna rutina predeterminada");
      return [];
    }
  } catch (error: any) {
    console.error('Error al inicializar rutinas predeterminadas:', error?.message || error);
    defaultRoutinesInitialized = true; // Evitar intentos repetidos
    return []; // Devolver array vacío en lugar de lanzar error para evitar romper la UI
  }
};
