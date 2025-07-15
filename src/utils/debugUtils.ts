import { getUserRoutines, initializeDefaultRoutines } from '../services/routineService';
import { auth } from '../services/firebaseConfig';

/**
 * Debug utilities for testing workout functionality
 */
export const debugRoutines = async () => {
  try {
    console.log('🔍 Debug: Checking user authentication...');
    console.log('User:', auth.currentUser?.email);
    
    console.log('🔍 Debug: Getting user routines...');
    const routines = await getUserRoutines();
    console.log('📋 User routines:', routines);
    
    if (routines.length === 0) {
      console.log('⚠️ No routines found, initializing default routines...');
      const defaultRoutines = await initializeDefaultRoutines();
      console.log('✅ Default routines created:', defaultRoutines);
    } else {
      console.log('✅ Found routines:', routines.length);
      routines.forEach((routine, index) => {
        console.log(`📋 Routine ${index + 1}:`, routine.name);
        console.log('  - Description:', routine.description);
        console.log('  - Exercises:', routine.exercises?.length || 0);
        if (routine.exercises) {
          routine.exercises.forEach((exercise, i) => {
            console.log(`    ${i + 1}. ${exercise.name} (${exercise.sets}x${exercise.reps})`);
          });
        }
      });
    }
    
    return routines;
  } catch (error) {
    console.error('❌ Debug error:', error);
    throw error;
  }
};

export const debugWeeklyPlan = async () => {
  try {
    const { getWeeklyPlanConfig, initializeWeeklyPlanWithPPL } = await import('../services/dailyProgressService');
    
    console.log('🔍 Debug: Getting weekly plan...');
    let weeklyPlan = await getWeeklyPlanConfig();
    console.log('📅 Weekly plan:', weeklyPlan);
    
    if (!weeklyPlan) {
      console.log('⚠️ No weekly plan found, initializing PPL...');
      weeklyPlan = await initializeWeeklyPlanWithPPL();
      console.log('✅ PPL plan created:', weeklyPlan);
    }
    
    return weeklyPlan;
  } catch (error) {
    console.error('❌ Debug error:', error);
    throw error;
  }
};
