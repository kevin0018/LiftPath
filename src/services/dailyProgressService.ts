import { getFirestore, collection, addDoc, updateDoc, deleteDoc, doc, getDocs, query, where, getDoc } from 'firebase/firestore';
import { firebaseApp } from './firebaseConfig';
import { auth } from './firebaseConfig';
import { WorkoutRoutine, Exercise } from './routineService';

// Initialize Firestore
const db = getFirestore(firebaseApp);

// Define un tipo para el estado de cada ejercicio
export enum ExerciseStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  SKIPPED = 'skipped'
}

// Define un tipo para cada ejercicio en el plan diario
export interface DailyExercise {
  id: string;
  routineId: string;
  exerciseId: string;
  name: string;
  sets?: number;
  reps?: string;
  weight?: string;
  status: ExerciseStatus;
  notes?: string;
  completedAt?: number;
}

// Define un tipo para el plan diario
export interface DailyWorkout {
  id?: string;
  userId: string;
  date: string; // formato YYYY-MM-DD
  dayOfWeek: number; // 0-6 (0 = domingo, 1 = lunes, etc.)
  routineId?: string;
  routineName?: string;
  exercises: DailyExercise[];
  completed: boolean;
  createdAt: number;
  updatedAt: number;
}

// Define un tipo para la configuración del plan semanal
export interface WeeklyPlanConfig {
  id?: string;
  userId: string;
  monday?: string; // Routine ID
  tuesday?: string;
  wednesday?: string;
  thursday?: string;
  friday?: string;
  saturday?: string;
  sunday?: string;
  createdAt: number;
  updatedAt: number;
}

/**
 * Gets the current weekly plan configuration for the user
 */
export const getWeeklyPlanConfig = async (): Promise<WeeklyPlanConfig | null> => {
  try {
    if (!auth.currentUser) {
      throw new Error('User not authenticated');
    }

    const userId = auth.currentUser.uid;
    const planConfigRef = collection(db, 'weeklyPlans');
    const q = query(planConfigRef, where('userId', '==', userId));
    
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      return null;
    }
    
    // Debería haber solo un plan semanal por usuario
    const planDoc = querySnapshot.docs[0];
    return { id: planDoc.id, ...planDoc.data() } as WeeklyPlanConfig;
  } catch (error) {
    console.error('Error getting weekly plan config:', error);
    throw error;
  }
};

/**
 * Saves or updates the weekly plan configuration
 */
export const saveWeeklyPlanConfig = async (config: Partial<WeeklyPlanConfig>): Promise<WeeklyPlanConfig> => {
  try {
    if (!auth.currentUser) {
      throw new Error('User not authenticated');
    }

    const userId = auth.currentUser.uid;
    const timestamp = Date.now();
    
    // Verificar si ya existe un plan semanal
    const existingPlan = await getWeeklyPlanConfig();
    
    if (existingPlan) {
      // Actualizar el plan existente
      const planRef = doc(db, 'weeklyPlans', existingPlan.id!);
      await updateDoc(planRef, {
        ...config,
        updatedAt: timestamp
      });
      
      return { 
        ...existingPlan, 
        ...config, 
        updatedAt: timestamp 
      };
    } else {
      // Crear un nuevo plan
      const newPlan: WeeklyPlanConfig = {
        userId,
        ...config,
        createdAt: timestamp,
        updatedAt: timestamp
      };
      
      const docRef = await addDoc(collection(db, 'weeklyPlans'), newPlan);
      
      return {
        id: docRef.id,
        ...newPlan
      };
    }
  } catch (error) {
    console.error('Error saving weekly plan config:', error);
    throw error;
  }
};

/**
 * Creates a new daily workout based on the assigned routine
 */
export const createDailyWorkout = async (date: string, routineId: string): Promise<DailyWorkout> => {
  try {
    if (!auth.currentUser) {
      throw new Error('User not authenticated');
    }

    const userId = auth.currentUser.uid;
    const timestamp = Date.now();
    
    // Check if a workout already exists for the given date
    const existingWorkout = await getDailyWorkout(date);
    if (existingWorkout) {
      throw new Error(`A workout already exists for ${date}`);
    }
    
    // Get routine information
    const routineDoc = doc(db, 'routines', routineId);
    const routineSnap = await getDoc(routineDoc);
    
    if (!routineSnap.exists()) {
      throw new Error('Routine not found');
    }
    
    const routine = { id: routineSnap.id, ...routineSnap.data() } as WorkoutRoutine;
    
    // Create daily exercises from the routine
    const dailyExercises: DailyExercise[] = (routine.exercises || []).map(exercise => ({
      id: `daily-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      routineId: routineId,
      exerciseId: exercise.id!,
      name: exercise.name,
      sets: exercise.sets,
      reps: exercise.reps,
      weight: exercise.weight,
      status: ExerciseStatus.PENDING,
      notes: ''
    }));
    
    // Calculate day of week
    const dateObj = new Date(date);
    const dayOfWeek = dateObj.getDay(); // 0-6 (0 = Sunday, 1 = Monday, etc.)
    
    const newDailyWorkout: Omit<DailyWorkout, 'id'> = {
      userId,
      date,
      dayOfWeek,
      routineId: routineId,
      routineName: routine.name,
      exercises: dailyExercises,
      completed: false,
      createdAt: timestamp,
      updatedAt: timestamp
    };
    
    const docRef = await addDoc(collection(db, 'dailyWorkouts'), newDailyWorkout);
    
    return {
      id: docRef.id,
      ...newDailyWorkout
    };
  } catch (error) {
    console.error('Error creating daily workout:', error);
    throw error;
  }
};

/**
 * Gets the daily workout for a specific date
 */
export const getDailyWorkout = async (date: string): Promise<DailyWorkout | null> => {
  try {
    if (!auth.currentUser) {
      throw new Error('User not authenticated');
    }

    const userId = auth.currentUser.uid;
    const workoutsRef = collection(db, 'dailyWorkouts');
    const q = query(workoutsRef, 
      where('userId', '==', userId),
      where('date', '==', date)
    );
    
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      return null;
    }
    
    // Debería haber solo un workout por día
    const workoutDoc = querySnapshot.docs[0];
    return { id: workoutDoc.id, ...workoutDoc.data() } as DailyWorkout;
  } catch (error) {
    console.error('Error getting daily workout:', error);
    throw error;
  }
};

/**
 * Updates the status of an exercise in the daily workout
 */
export const updateExerciseStatus = async (
  workoutId: string, 
  exerciseId: string,
  status: ExerciseStatus,
  notes?: string
): Promise<DailyWorkout> => {
  try {
    if (!auth.currentUser) {
      throw new Error('User not authenticated');
    }

    const workoutRef = doc(db, 'dailyWorkouts', workoutId);
    const workoutSnap = await getDoc(workoutRef);
    
    if (!workoutSnap.exists()) {
      throw new Error('Workout not found');
    }
    
    const workout = { id: workoutSnap.id, ...workoutSnap.data() } as DailyWorkout;
    
    // Encontrar y actualizar el ejercicio
    const updatedExercises = workout.exercises.map(ex => {
      if (ex.id === exerciseId) {
        return {
          ...ex,
          status,
          notes: notes || ex.notes,
          completedAt: status === ExerciseStatus.COMPLETED ? Date.now() : undefined
        };
      }
      return ex;
    });
    
    // Verificar si todos los ejercicios están completados o saltados
    const allCompleted = updatedExercises.every(ex => 
      ex.status === ExerciseStatus.COMPLETED || ex.status === ExerciseStatus.SKIPPED
    );
    
    // Actualizar el documento
    await updateDoc(workoutRef, {
      exercises: updatedExercises,
      completed: allCompleted,
      updatedAt: Date.now()
    });
    
    return {
      ...workout,
      exercises: updatedExercises,
      completed: allCompleted,
      updatedAt: Date.now()
    };
  } catch (error) {
    console.error('Error updating exercise status:', error);
    throw error;
  }
};

/**
 * Gets daily workouts for a date range
 */
export const getDailyWorkoutsByDateRange = async (startDate: string, endDate: string): Promise<DailyWorkout[]> => {
  try {
    if (!auth.currentUser) {
      throw new Error('User not authenticated');
    }

    const userId = auth.currentUser.uid;
    const workoutsRef = collection(db, 'dailyWorkouts');
    const q = query(workoutsRef, 
      where('userId', '==', userId),
      where('date', '>=', startDate),
      where('date', '<=', endDate)
    );
    
    const querySnapshot = await getDocs(q);
    
    const workouts: DailyWorkout[] = [];
    querySnapshot.forEach((doc) => {
      workouts.push({ 
        id: doc.id, 
        ...doc.data() 
      } as DailyWorkout);
    });
    
    // Ordenar por fecha
    return workouts.sort((a, b) => {
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    });
  } catch (error) {
    console.error('Error getting daily workouts by date range:', error);
    throw error;
  }
};

/**
 * Gets the recommended routine for a specific day according to the weekly plan
 */
export const getRoutineForDay = async (dayOfWeek: number): Promise<string | null> => {
  try {
    const weeklyPlan = await getWeeklyPlanConfig();
    
    if (!weeklyPlan) return null;
    
    // Map day of week to corresponding property
    const dayMapping: Record<number, keyof Omit<WeeklyPlanConfig, 'id' | 'userId' | 'createdAt' | 'updatedAt'>> = {
      0: 'sunday',
      1: 'monday',
      2: 'tuesday',
      3: 'wednesday',
      4: 'thursday',
      5: 'friday',
      6: 'saturday'
    };
    
    const routineId = weeklyPlan[dayMapping[dayOfWeek]];
    return routineId || null;
  } catch (error) {
    console.error('Error getting routine for day:', error);
    return null;
  }
};

/**
 * Generates today's workout according to the weekly plan
 */
export const generateTodaysWorkout = async (): Promise<DailyWorkout | null> => {
  try {
    // Get current date in YYYY-MM-DD format
    const today = new Date();
    const dateString = today.toISOString().split('T')[0];
    
    // Check if a workout already exists for today
    const existingWorkout = await getDailyWorkout(dateString);
    if (existingWorkout) {
      return existingWorkout;
    }
    
    // Get recommended routine for today
    const dayOfWeek = today.getDay();
    const routineId = await getRoutineForDay(dayOfWeek);
    
    if (!routineId) {
      // No routine configured for today
      return null;
    }
    
    // Create workout for today
    return await createDailyWorkout(dateString, routineId);
  } catch (error) {
    console.error('Error generating today\'s workout:', error);
    return null;
  }
};

/**
 * Initializes the weekly plan configuration with Push-Pull-Legs pattern
 */
export const initializeWeeklyPlanWithPPL = async (
  pushRoutineId?: string, 
  pullRoutineId?: string, 
  legRoutineId?: string
): Promise<WeeklyPlanConfig> => {
  try {
    if (!auth.currentUser) {
      throw new Error('User not authenticated');
    }
    
    // If no specific IDs are provided, search for routines with those names
    let pushId = pushRoutineId;
    let pullId = pullRoutineId;
    let legId = legRoutineId;
    
    if (!pushId || !pullId || !legId) {
      // Search for routines by name
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
      
      // Assign IDs based on routine names
      if (!pushId) {
        const pushRoutine = routines.find(r => r.name.toLowerCase().includes('push'));
        pushId = pushRoutine?.id;
      }
      
      if (!pullId) {
        const pullRoutine = routines.find(r => r.name.toLowerCase().includes('pull'));
        pullId = pullRoutine?.id;
      }
      
      if (!legId) {
        const legRoutine = routines.find(r => r.name.toLowerCase().includes('leg'));
        legId = legRoutine?.id;
      }
    }
    
    // Weekly plan configuration
    const planConfig: Partial<WeeklyPlanConfig> = {
      monday: pushId,
      tuesday: pullId,
      wednesday: legId,
      thursday: pushId,
      friday: pullId,
      saturday: legId,
      // Sunday is rest day (undefined)
    };
    
    // Guardar la configuración
    return await saveWeeklyPlanConfig(planConfig);
  } catch (error) {
    console.error('Error initializing weekly plan with PPL:', error);
    throw error;
  }
};
