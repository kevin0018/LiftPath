import React, { useState, useEffect } from "react";
import { 
  View, 
  Text, 
  TouchableOpacity, 
  SafeAreaView, 
  FlatList, 
  Modal, 
  TextInput, 
  ActivityIndicator,
  Alert,
  StyleSheet
} from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import theme from "../constants/theme";
import { 
  DailyWorkout, 
  DailyExercise, 
  ExerciseStatus, 
  getDailyWorkout,
  updateExerciseStatus,
  generateTodaysWorkout,
  getWeeklyPlanConfig,
  initializeWeeklyPlanWithPPL
} from '../services/dailyProgressService';

const DAYS = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];

interface DailyProgressScreenProps {
  date?: string; // Optional: format YYYY-MM-DD, if not provided uses current date
  onClose?: () => void;
}

const DailyProgressScreen = ({ date: initialDate, onClose }: DailyProgressScreenProps) => {
  const router = useRouter();
  const [date, setDate] = useState<string>(initialDate || new Date().toISOString().split('T')[0]);
  const [workout, setWorkout] = useState<DailyWorkout | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [noteModalVisible, setNoteModalVisible] = useState(false);
  const [currentExercise, setCurrentExercise] = useState<DailyExercise | null>(null);
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [infoModalVisible, setInfoModalVisible] = useState(false);

  const handleGoBack = () => {
    if (onClose) {
      onClose();
    } else {
      router.back();
    }
  };

  const formatDate = (dateString: string) => {
    const dateObj = new Date(dateString);
    const day = dateObj.getDate();
    const month = dateObj.getMonth() + 1;
    const year = dateObj.getFullYear();
    const dayOfWeek = DAYS[dateObj.getDay()];
    return `${dayOfWeek}, ${day}/${month}/${year}`;
  };

  useEffect(() => {
    loadWorkout();
  }, [date]);

  const loadWorkout = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Try to get the workout for the date
      let dailyWorkout = await getDailyWorkout(date);
      
      // If it doesn't exist and it's today, try to generate it
      if (!dailyWorkout && date === new Date().toISOString().split('T')[0]) {
        // Check if weekly plan configuration exists
        const weeklyPlan = await getWeeklyPlanConfig();
        
        if (!weeklyPlan) {
          // Initialize weekly plan with PPL
          await initializeWeeklyPlanWithPPL();
        }
        
        dailyWorkout = await generateTodaysWorkout();
      }
      
      setWorkout(dailyWorkout);
    } catch (err) {
      console.error('Error loading workout:', err);
      setError('No se pudo cargar el entrenamiento del día');
    } finally {
      setLoading(false);
    }
  };

  const handlePreviousDay = () => {
    const dateObj = new Date(date);
    dateObj.setDate(dateObj.getDate() - 1);
    setDate(dateObj.toISOString().split('T')[0]);
  };

  const handleNextDay = () => {
    const dateObj = new Date(date);
    dateObj.setDate(dateObj.getDate() + 1);
    setDate(dateObj.toISOString().split('T')[0]);
  };

  const handleToday = () => {
    setDate(new Date().toISOString().split('T')[0]);
  };

  const openNoteModal = (exercise: DailyExercise) => {
    setCurrentExercise(exercise);
    setNotes(exercise.notes || "");
    setNoteModalVisible(true);
  };

  const handleStatusChange = async (exercise: DailyExercise, status: ExerciseStatus) => {
    if (!workout?.id) return;
    
    try {
      setSubmitting(true);
      const updatedWorkout = await updateExerciseStatus(
        workout.id,
        exercise.id,
        status,
        exercise.notes
      );
      setWorkout(updatedWorkout);
    } catch (err) {
      console.error('Error updating exercise status:', err);
      Alert.alert('Error', 'No se pudo actualizar el estado del ejercicio');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSaveNotes = async () => {
    if (!workout?.id || !currentExercise) return;
    
    try {
      setSubmitting(true);
      const updatedWorkout = await updateExerciseStatus(
        workout.id,
        currentExercise.id,
        currentExercise.status,
        notes
      );
      setWorkout(updatedWorkout);
      setNoteModalVisible(false);
    } catch (err) {
      console.error('Error saving notes:', err);
      Alert.alert('Error', 'No se pudieron guardar las notas');
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusIcon = (status: ExerciseStatus) => {
    switch (status) {
      case ExerciseStatus.COMPLETED:
        return <Ionicons name="checkmark-circle" size={24} color={theme.colors.success} />;
      case ExerciseStatus.SKIPPED:
        return <Ionicons name="close-circle" size={24} color={theme.colors.warning} />;
      default:
        return <Ionicons name="ellipse-outline" size={24} color={theme.colors.secondary} />;
    }
  };

  const renderStatusButton = (exercise: DailyExercise) => {
    const isCompleted = exercise.status === ExerciseStatus.COMPLETED;
    const isSkipped = exercise.status === ExerciseStatus.SKIPPED;
    
    return (
      <View style={styles.statusButtons}>
        <TouchableOpacity
          style={[
            styles.statusButton,
            isCompleted ? styles.activeButton : styles.inactiveButton
          ]}
          onPress={() => handleStatusChange(exercise, ExerciseStatus.COMPLETED)}
          disabled={submitting}
        >
          <Ionicons 
            name={isCompleted ? "checkmark-circle" : "checkmark-circle-outline"} 
            size={24} 
            color={isCompleted ? theme.colors.white : theme.colors.success} 
          />
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.statusButton,
            isSkipped ? styles.activeButton : styles.inactiveButton
          ]}
          onPress={() => handleStatusChange(exercise, ExerciseStatus.SKIPPED)}
          disabled={submitting}
        >
          <Ionicons 
            name={isSkipped ? "close-circle" : "close-circle-outline"} 
            size={24} 
            color={isSkipped ? theme.colors.white : theme.colors.warning} 
          />
        </TouchableOpacity>
      </View>
    );
  };

  const calculateCompletion = () => {
    if (!workout || workout.exercises.length === 0) return 0;
    
    const completed = workout.exercises.filter(ex => 
      ex.status === ExerciseStatus.COMPLETED
    ).length;
    
    return Math.round((completed / workout.exercises.length) * 100);
  };

  return (
    <View className="flex-1 min-h-screen bg-primary w-full h-full items-center justify-center px-4">
      <SafeAreaView className="w-full flex-1 min-h-screen bg-primary items-center justify-center">
        <View className="w-full max-w-sm flex-1 justify-center bg-primary rounded-2xl shadow-lg p-6">
          {/* Header */}
          <View className="flex-row items-center justify-between mb-6">
            <TouchableOpacity onPress={handleGoBack}>
              <Ionicons name="arrow-back" size={24} color="white" />
            </TouchableOpacity>
            <Text className="text-white text-center font-bold text-2xl">
              Progreso Diario
            </Text>
            <TouchableOpacity onPress={() => setInfoModalVisible(true)}>
              <Ionicons name="information-circle-outline" size={24} color="white" />
            </TouchableOpacity>
          </View>

          {/* Date Navigation */}
          <View className="flex-row items-center justify-between mb-4">
            <TouchableOpacity onPress={handlePreviousDay}>
              <Ionicons name="chevron-back" size={24} color="white" />
            </TouchableOpacity>
            
            <TouchableOpacity onPress={handleToday} className="flex-row items-center">
              <Text className="text-white font-bold text-lg">
                {formatDate(date)}
              </Text>
              {date !== new Date().toISOString().split('T')[0] && (
                <Text className="text-accent text-xs ml-2">(Hoy)</Text>
              )}
            </TouchableOpacity>
            
            <TouchableOpacity onPress={handleNextDay}>
              <Ionicons name="chevron-forward" size={24} color="white" />
            </TouchableOpacity>
          </View>

          {/* Progress Bar */}
          {workout && (
            <View className="mb-4">
              <View className="flex-row items-center justify-between">
                <Text className="text-white font-bold">Progreso</Text>
                <Text className="text-white">{calculateCompletion()}%</Text>
              </View>
              <View className="bg-gray-700 h-2 rounded-full mt-1">
                <View 
                  className="bg-accent h-2 rounded-full"
                  style={{ width: `${calculateCompletion()}%` }}
                />
              </View>
            </View>
          )}

          {/* Content */}
          {loading ? (
            <View className="flex-1 items-center justify-center">
              <ActivityIndicator size="large" color={theme.colors.accent} />
              <Text className="text-white mt-2">Cargando entrenamiento...</Text>
            </View>
          ) : error ? (
            <View className="flex-1 items-center justify-center">
              <Ionicons name="alert-circle" size={48} color={theme.colors.error} />
              <Text className="text-white text-center mt-2">{error}</Text>
              <TouchableOpacity
                className="bg-accent mt-4 py-3 px-6 rounded-xl"
                onPress={loadWorkout}
              >
                <Text className="text-white font-bold">Reintentar</Text>
              </TouchableOpacity>
            </View>
          ) : !workout ? (
            <View className="flex-1 items-center justify-center">
              <Ionicons name="fitness" size={48} color={theme.colors.accent} />
              <Text className="text-white text-center text-lg font-bold mt-4 mb-2">
                {(() => {
                  const dayOfWeek = new Date(date).getDay();
                  const dayNames = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
                  const routineNames = ["Descanso", "Push", "Pull", "Legs", "Push", "Pull", "Legs"];
                  
                  return dayOfWeek === 0 
                    ? "Día de descanso" 
                    : `${dayNames[dayOfWeek]} - ${routineNames[dayOfWeek]}`;
                })()}
              </Text>
              <Text className="text-gray-300 text-center mb-6 text-sm">
                {(() => {
                  const dayOfWeek = new Date(date).getDay();
                  if (dayOfWeek === 0) {
                    return "Los domingos son para descansar y recuperarse";
                  }
                  return date === new Date().toISOString().split('T')[0] 
                    ? "No hay entrenamiento programado para hoy. Intenta crear uno." 
                    : "No hay entrenamiento programado para esta fecha.";
                })()}
              </Text>
              {date === new Date().toISOString().split('T')[0] && new Date().getDay() !== 0 && (
                <TouchableOpacity
                  className="bg-accent mt-2 py-3 px-6 rounded-xl"
                  onPress={loadWorkout}
                >
                  <Text className="text-white font-bold">Crear Entrenamiento</Text>
                </TouchableOpacity>
              )}
            </View>
          ) : (
            <>
              {/* Routine Name */}
              <View className="bg-white rounded-xl px-5 py-4 mb-4 shadow-sm">
                <View className="flex-row items-center justify-between">
                  <View className="flex-1">
                    <Text className="text-black font-bold text-lg">{workout.routineName}</Text>
                    <Text className="text-gray-600 text-sm mt-1">
                      {(() => {
                        const dayOfWeek = new Date(date).getDay();
                        const dayNames = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
                        const routineTypes = ["Descanso", "Push Day", "Pull Day", "Leg Day", "Push Day", "Pull Day", "Leg Day"];
                        
                        return `${dayNames[dayOfWeek]} • ${routineTypes[dayOfWeek]}`;
                      })()}
                    </Text>
                  </View>
                  <View className="items-center">
                    <Ionicons 
                      name={workout.completed ? "checkmark-circle" : "time"} 
                      size={24} 
                      color={workout.completed ? theme.colors.success : theme.colors.accent} 
                    />
                  </View>
                </View>
                
                {workout.completed ? (
                  <View className="flex-row items-center mt-3 bg-green-100 py-2 px-4 rounded-lg">
                    <Ionicons name="checkmark-circle" size={18} color={theme.colors.success} />
                    <Text className="text-success ml-2 font-medium">Completado</Text>
                  </View>
                ) : (
                  <View className="flex-row items-center mt-3 bg-blue-100 py-2 px-4 rounded-lg">
                    <Ionicons name="time" size={18} color={theme.colors.accent} />
                    <Text className="text-accent ml-2 font-medium">En progreso</Text>
                  </View>
                )}
              </View>

              {/* Exercises List */}
              <FlatList
                data={workout.exercises}
                keyExtractor={(item) => item.id}
                contentContainerStyle={{ paddingBottom: 24 }}
                renderItem={({ item }) => (
                  <View className="bg-white rounded-xl px-5 py-4 mb-4 shadow-sm">
                    <View className="flex-row items-center justify-between">
                      <View className="flex-1 mr-2">
                        <Text className="text-black font-bold text-base">{item.name}</Text>
                        {(item.sets || item.reps) && (
                          <Text className="text-gray-600 text-sm">
                            {item.sets && `${item.sets} series`}
                            {item.sets && item.reps && ' x '}
                            {item.reps && `${item.reps} reps`}
                            {item.weight && ` · ${item.weight}`}
                          </Text>
                        )}
                      </View>
                      
                      {renderStatusButton(item)}
                    </View>
                    
                    {/* Notes */}
                    <TouchableOpacity 
                      className="flex-row items-center mt-3" 
                      onPress={() => openNoteModal(item)}
                    >
                      <Ionicons name="create-outline" size={16} color={theme.colors.accent} />
                      <Text className="text-accent text-sm ml-1">
                        {item.notes ? 'Editar notas' : 'Añadir notas'}
                      </Text>
                    </TouchableOpacity>
                    
                    {item.notes && (
                      <View className="bg-gray-100 px-3 py-2 rounded-md mt-2">
                        <Text className="text-gray-700 text-sm">{item.notes}</Text>
                      </View>
                    )}
                  </View>
                )}
              />
            </>
          )}

          {/* Note Modal */}
          <Modal
            visible={noteModalVisible}
            transparent={true}
            animationType="fade"
            onRequestClose={() => setNoteModalVisible(false)}
          >
            <View className="flex-1 bg-black bg-opacity-50 items-center justify-center p-4">
              <View className="bg-white w-full max-w-sm p-6 rounded-2xl">
                <Text className="text-black font-bold text-lg mb-4">
                  Notas para {currentExercise?.name}
                </Text>
                
                <TextInput
                  className="bg-gray-100 p-3 rounded-xl h-32 text-black"
                  placeholder="Escribe tus notas aquí..."
                  placeholderTextColor="#666"
                  multiline={true}
                  value={notes}
                  onChangeText={setNotes}
                />
                
                <View className="flex-row justify-end mt-4">
                  <TouchableOpacity
                    className="py-2 px-4"
                    onPress={() => setNoteModalVisible(false)}
                  >
                    <Text className="text-gray-700 font-medium">Cancelar</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    className="bg-accent py-2 px-4 rounded-xl ml-2"
                    onPress={handleSaveNotes}
                    disabled={submitting}
                  >
                    {submitting ? (
                      <ActivityIndicator size="small" color="white" />
                    ) : (
                      <Text className="text-white font-medium">Guardar</Text>
                    )}
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>

          {/* Info Modal */}
          <Modal
            visible={infoModalVisible}
            transparent={true}
            animationType="fade"
            onRequestClose={() => setInfoModalVisible(false)}
          >
            <View className="flex-1 bg-black bg-opacity-50 items-center justify-center p-4">
              <View className="bg-white w-full max-w-sm p-6 rounded-2xl">
                <View className="flex-row items-center justify-between mb-4">
                  <Text className="text-black font-bold text-lg">Plan Push-Pull-Legs</Text>
                  <TouchableOpacity onPress={() => setInfoModalVisible(false)}>
                    <Ionicons name="close" size={24} color="#666" />
                  </TouchableOpacity>
                </View>
                
                <View className="space-y-4">
                  <View>
                    <Text className="text-black font-semibold text-base mb-2">Estructura semanal:</Text>
                    <View className="space-y-2">
                      <View className="flex-row items-center">
                        <View className="w-3 h-3 bg-accent rounded-full mr-3" />
                        <Text className="text-gray-700">Lunes & Jueves: Push Day</Text>
                      </View>
                      <View className="flex-row items-center">
                        <View className="w-3 h-3 bg-blue-500 rounded-full mr-3" />
                        <Text className="text-gray-700">Martes & Viernes: Pull Day</Text>
                      </View>
                      <View className="flex-row items-center">
                        <View className="w-3 h-3 bg-green-500 rounded-full mr-3" />
                        <Text className="text-gray-700">Miércoles & Sábado: Leg Day</Text>
                      </View>
                      <View className="flex-row items-center">
                        <View className="w-3 h-3 bg-gray-400 rounded-full mr-3" />
                        <Text className="text-gray-700">Domingo: Descanso</Text>
                      </View>
                    </View>
                  </View>
                  
                  <View>
                    <Text className="text-black font-semibold text-base mb-2">¿Qué significa cada día?</Text>
                    <View className="space-y-2">
                      <View>
                        <Text className="text-accent font-medium">Push Day:</Text>
                        <Text className="text-gray-600 text-sm">Pecho, hombros y tríceps</Text>
                      </View>
                      <View>
                        <Text className="text-blue-600 font-medium">Pull Day:</Text>
                        <Text className="text-gray-600 text-sm">Espalda y bíceps</Text>
                      </View>
                      <View>
                        <Text className="text-green-600 font-medium">Leg Day:</Text>
                        <Text className="text-gray-600 text-sm">Piernas y glúteos</Text>
                      </View>
                    </View>
                  </View>
                </View>
                
                <TouchableOpacity
                  className="bg-accent mt-6 py-3 px-6 rounded-xl"
                  onPress={() => setInfoModalVisible(false)}
                >
                  <Text className="text-white font-bold text-center">Entendido</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        </View>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  statusButtons: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  statusButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8
  },
  activeButton: {
    backgroundColor: theme.colors.accent
  },
  inactiveButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: theme.colors.secondary
  }
});

export default DailyProgressScreen;
