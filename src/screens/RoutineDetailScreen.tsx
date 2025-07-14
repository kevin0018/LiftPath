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
  Alert
} from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { 
  WorkoutRoutine, 
  Exercise, 
  ProgressEntry,
  getRoutineById, 
  addExerciseToRoutine, 
  updateExerciseInRoutine, 
  deleteExerciseFromRoutine,
  recordExerciseProgress,
  getExerciseProgressHistory
} from "../services/routineService";
import theme from "../constants/theme";

interface RoutineDetailScreenProps {
  routineId: string;
  onClose?: () => void;
  onRoutineUpdated?: () => void;
}

const RoutineDetailScreen = ({ routineId, onClose, onRoutineUpdated }: RoutineDetailScreenProps) => {
  const [routine, setRoutine] = useState<WorkoutRoutine | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingExercise, setEditingExercise] = useState<Exercise | null>(null);
  
  // Exercise form states
  const [name, setName] = useState("");
  const [sets, setSets] = useState("");
  const [reps, setReps] = useState("");
  const [weight, setWeight] = useState("");
  const [notes, setNotes] = useState("");
  
  // Tracking progress states
  const [trackingModalVisible, setTrackingModalVisible] = useState(false);
  const [trackingExercise, setTrackingExercise] = useState<Exercise | null>(null);
  const [trackReps, setTrackReps] = useState("");
  const [trackWeight, setTrackWeight] = useState("");
  const [trackNotes, setTrackNotes] = useState("");
  const [isRecordingProgress, setIsRecordingProgress] = useState(false);
  const [progressHistory, setProgressHistory] = useState<ProgressEntry[]>([]);

  // Tracking modal states


  useEffect(() => {
    loadRoutine();
  }, [routineId]);

  const loadRoutine = async () => {
    try {
      setLoading(true);
      setError(null);
      const routineData = await getRoutineById(routineId);
      setRoutine(routineData);
    } catch (err) {
      console.error('Error loading routine:', err);
      setError('No se pudo cargar la rutina');
    } finally {
      setLoading(false);
    }
  };

  const openAddModal = () => {
    setEditingExercise(null);
    setName("");
    setSets("");
    setReps("");
    setWeight("");
    setNotes("");
    setModalVisible(true);
  };

  const openEditModal = (exercise: Exercise) => {
    setEditingExercise(exercise);
    setName(exercise.name);
    setSets(exercise.sets?.toString() || "");
    setReps(exercise.reps || "");
    setWeight(exercise.weight || "");
    setNotes(exercise.notes || "");
    setModalVisible(true);
  };

  const handleSave = async () => {
    if (!name.trim()) return;
    if (!routine) return;

    try {
      setIsSubmitting(true);
      
      const exerciseData: Partial<Exercise> = {
        name,
        sets: sets ? parseInt(sets) : undefined,
        reps,
        weight,
        notes
      };

      if (editingExercise?.id) {
        // Update existing exercise
        await updateExerciseInRoutine(routineId, editingExercise.id, exerciseData);
      } else {
        // Add new exercise
        await addExerciseToRoutine(routineId, exerciseData as Omit<Exercise, 'id'>);
      }

      await loadRoutine();
      if (onRoutineUpdated) {
        onRoutineUpdated();
      }
      setModalVisible(false);
    } catch (error) {
      console.error('Error saving exercise:', error);
      Alert.alert('Error', 'No se pudo guardar el ejercicio');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (exerciseId: string) => {
    try {
      await deleteExerciseFromRoutine(routineId, exerciseId);
      await loadRoutine();
      if (onRoutineUpdated) {
        onRoutineUpdated();
      }
    } catch (error) {
      console.error('Error deleting exercise:', error);
      Alert.alert('Error', 'No se pudo eliminar el ejercicio');
    }
  };

  const openTrackingModal = async (exercise: Exercise) => {
    setTrackingExercise(exercise);
    setTrackReps(exercise.currentReps || "");
    setTrackWeight(exercise.currentWeight || "");
    setTrackNotes("");
    setTrackingModalVisible(true);
    
    try {
      if (exercise.id) {
        // Cargar historial de progreso
        const history = await getExerciseProgressHistory(routineId, exercise.id);
        setProgressHistory(history);
      }
    } catch (error) {
      console.error('Error loading progress history:', error);
      setProgressHistory([]);
    }
  };

  const handleRecordProgress = async () => {
    if (!trackingExercise || !trackingExercise.id) return;
    if (!trackReps.trim() && !trackWeight.trim()) return;

    try {
      setIsRecordingProgress(true);

      // Datos para registrar el progreso
      const progressData = {
        reps: trackReps,
        weight: trackWeight,
        notes: trackNotes
      };
      
      // Guardar el progreso
      await recordExerciseProgress(routineId, trackingExercise.id, progressData);

      // Refresh routine and close modal
      await loadRoutine();
      setTrackingModalVisible(false);
      if (onRoutineUpdated) {
        onRoutineUpdated();
      }
    } catch (error) {
      console.error('Error recording progress:', error);
      Alert.alert('Error', 'No se pudo registrar el progreso');
    } finally {
      setIsRecordingProgress(false);
    }
  };

  return (
    <View className="flex-1 bg-primary">
      {/* Header */}
      <SafeAreaView className="w-full">
        <View className="w-full flex-row items-center justify-between px-4 py-3 bg-primary shadow-sm">
          <View className="flex-row items-center">
            {onClose && (
              <TouchableOpacity onPress={onClose} className="mr-3">
                <Ionicons name="arrow-back" size={24} color="white" />
              </TouchableOpacity>
            )}
            <Text className="text-white text-xl font-bold">
              {routine?.name || 'Detalle de Rutina'}
            </Text>
          </View>
        </View>
      </SafeAreaView>

      {/* Content */}
      <View className="flex-1 px-4 pt-2">
        {loading ? (
          <View className="flex-1 justify-center items-center">
            <ActivityIndicator size="large" color="#ffffff" />
            <Text className="text-white mt-4">Cargando rutina...</Text>
          </View>
        ) : error ? (
          <View className="flex-1 justify-center items-center px-4">
            <Text className="text-red-400 text-center mb-4">{error}</Text>
            <TouchableOpacity 
              className="bg-secondary px-4 py-2 rounded-lg" 
              onPress={loadRoutine}
            >
              <Text className="text-white">Reintentar</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            {/* Routine Description */}
            <Text className="text-white text-base mb-6">{routine?.description}</Text>

            {/* Add Exercise Button */}
            <TouchableOpacity
              className="bg-accent rounded-xl py-3 mb-6"
              onPress={openAddModal}
            >
              <Text className="text-white text-center font-bold text-base">
                Añadir ejercicio
              </Text>
            </TouchableOpacity>

            {/* Exercise List */}
            {routine?.exercises && routine.exercises.length > 0 ? (
              <FlatList
                data={routine.exercises}
                keyExtractor={item => item.id || `exercise-${Date.now()}`}
                renderItem={({ item }) => (
                  <View className="bg-white rounded-xl p-4 mb-3">
                    <View className="flex-row justify-between">
                      <Text className="text-black font-bold text-lg">{item.name}</Text>
                      <View className="flex-row">
                        <TouchableOpacity onPress={() => openTrackingModal(item)} className="mr-3">
                          <Ionicons name="fitness-outline" size={20} color={theme.colors.primary} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => openEditModal(item)} className="mr-3">
                          <Ionicons name="create-outline" size={20} color={theme.colors.accent} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => item.id && handleDelete(item.id)}>
                          <Ionicons name="trash-outline" size={20} color="#f87171" />
                        </TouchableOpacity>
                      </View>
                    </View>
                    
                    <View className="flex-row mt-2 flex-wrap">
                      {item.sets && (
                        <View className="bg-gray-100 rounded-full px-3 py-1 mr-2 mb-2">
                          <Text className="text-gray-800">{item.sets} series</Text>
                        </View>
                      )}
                      {item.reps && (
                        <View className="bg-gray-100 rounded-full px-3 py-1 mr-2 mb-2">
                          <Text className="text-gray-800">{item.reps} reps objetivo</Text>
                        </View>
                      )}
                      {item.weight && (
                        <View className="bg-gray-100 rounded-full px-3 py-1 mr-2 mb-2">
                          <Text className="text-gray-800">Peso objetivo: {item.weight}</Text>
                        </View>
                      )}
                    </View>
                    
                    {/* Mostrar información actual si existe */}
                    {(item.currentReps || item.currentWeight || item.lastPerformed) && (
                      <View className="mt-2 border-t border-gray-200 pt-2">
                        <Text className="text-gray-800 font-medium">Último progreso:</Text>
                        <View className="flex-row mt-1 flex-wrap">
                          {item.currentReps && (
                            <View className="bg-green-100 rounded-full px-3 py-1 mr-2 mb-1">
                              <Text className="text-green-800">{item.currentReps} reps</Text>
                            </View>
                          )}
                          {item.currentWeight && (
                            <View className="bg-green-100 rounded-full px-3 py-1 mr-2 mb-1">
                              <Text className="text-green-800">{item.currentWeight}</Text>
                            </View>
                          )}
                        </View>
                        {item.lastPerformed && item.lastPerformed > 0 && (
                          <Text className="text-gray-500 text-xs mt-1">
                            Última vez: {new Date(item.lastPerformed).toLocaleDateString()}
                          </Text>
                        )}
                      </View>
                    )}
                    
                    {item.notes && (
                      <Text className="text-gray-600 mt-2">{item.notes}</Text>
                    )}
                  </View>
                )}
              />
            ) : (
              <View className="flex-1 justify-center items-center">
                <Ionicons name="barbell-outline" size={64} color="#FFFFFF80" />
                <Text className="text-white text-center mt-4 mb-2">
                  No hay ejercicios en esta rutina
                </Text>
                <Text className="text-gray-300 text-center mb-8">
                  Toca el botón "Añadir ejercicio" para empezar
                </Text>
              </View>
            )}
          </>
        )}
      </View>

      {/* Modal for Add/Edit Exercise */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <View className="w-full max-w-sm mx-4 bg-primary rounded-2xl p-6">
            <Text className="text-white text-xl font-bold mb-4 text-center">
              {editingExercise ? 'Editar ejercicio' : 'Añadir ejercicio'}
            </Text>
            
            {/* Exercise Form */}
            <TextInput
              className="bg-white rounded-xl px-4 py-3 text-base text-black mb-4"
              placeholder="Nombre del ejercicio"
              placeholderTextColor="#666"
              value={name}
              onChangeText={setName}
            />
            
            <View className="flex-row mb-4">
              <TextInput
                className="bg-white rounded-xl px-4 py-3 text-base text-black flex-1 mr-2"
                placeholder="Series"
                placeholderTextColor="#666"
                value={sets}
                onChangeText={setSets}
                keyboardType="number-pad"
              />
              <TextInput
                className="bg-white rounded-xl px-4 py-3 text-base text-black flex-1 ml-2"
                placeholder="Repeticiones"
                placeholderTextColor="#666"
                value={reps}
                onChangeText={setReps}
              />
            </View>
            
            <TextInput
              className="bg-white rounded-xl px-4 py-3 text-base text-black mb-4"
              placeholder="Peso (ej: 10kg, 25lb)"
              placeholderTextColor="#666"
              value={weight}
              onChangeText={setWeight}
            />
            
            <TextInput
              className="bg-white rounded-xl px-4 py-3 text-base text-black mb-4"
              placeholder="Notas adicionales"
              placeholderTextColor="#666"
              value={notes}
              onChangeText={setNotes}
              multiline={true}
              numberOfLines={3}
              textAlignVertical="top"
            />

            {/* Action Buttons */}
            <View className="flex-row justify-between">
              <TouchableOpacity
                className="bg-gray-500 rounded-xl py-2 px-4"
                onPress={() => setModalVisible(false)}
                disabled={isSubmitting}
              >
                <Text className="text-white font-bold">Cancelar</Text>
              </TouchableOpacity>
              
              {isSubmitting ? (
                <View className="bg-accent rounded-xl py-2 px-4 flex-row items-center">
                  <ActivityIndicator size="small" color="#ffffff" />
                  <Text className="text-white font-bold ml-2">Guardando...</Text>
                </View>
              ) : (
                <TouchableOpacity
                  className="bg-accent rounded-xl py-2 px-4"
                  onPress={handleSave}
                >
                  <Text className="text-white font-bold">Guardar</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal para registrar progreso */}
      <Modal
        visible={trackingModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setTrackingModalVisible(false)}
      >
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <View className="w-full max-w-sm mx-4 bg-primary rounded-2xl p-6">
            <Text className="text-white text-xl font-bold mb-2 text-center">
              Registrar Progreso
            </Text>
            
            {trackingExercise && (
              <Text className="text-white text-center mb-4">
                {trackingExercise.name}
              </Text>
            )}
            
            {/* Formulario de progreso */}
            <TextInput
              className="bg-white rounded-xl px-4 py-3 text-base text-black mb-4"
              placeholder="Repeticiones realizadas (ej: 8-10-8)"
              placeholderTextColor="#666"
              value={trackReps}
              onChangeText={setTrackReps}
            />
            
            <TextInput
              className="bg-white rounded-xl px-4 py-3 text-base text-black mb-4"
              placeholder="Peso utilizado (ej: 20kg, 45lb)"
              placeholderTextColor="#666"
              value={trackWeight}
              onChangeText={setTrackWeight}
            />
            
            <TextInput
              className="bg-white rounded-xl px-4 py-3 text-base text-black mb-4"
              placeholder="Notas adicionales"
              placeholderTextColor="#666"
              value={trackNotes}
              onChangeText={setTrackNotes}
              multiline={true}
              numberOfLines={3}
              textAlignVertical="top"
            />

            {/* Historial de progreso */}
            {progressHistory.length > 0 && (
              <View className="mb-4 mt-2">
                <Text className="text-white font-bold mb-2">Historial reciente:</Text>
                {progressHistory.slice(0, 3).map((entry, index) => (
                  <View key={index} className="bg-gray-800 rounded-lg p-2 mb-2">
                    <Text className="text-white text-sm">
                      {new Date(entry.date).toLocaleDateString()}: {entry.reps} reps
                      {entry.weight ? `, ${entry.weight}` : ''}
                    </Text>
                    {entry.notes && (
                      <Text className="text-gray-400 text-xs mt-1">{entry.notes}</Text>
                    )}
                  </View>
                ))}
              </View>
            )}

            {/* Botones de acción */}
            <View className="flex-row justify-between">
              <TouchableOpacity
                className="bg-gray-500 rounded-xl py-2 px-4"
                onPress={() => setTrackingModalVisible(false)}
                disabled={isRecordingProgress}
              >
                <Text className="text-white font-bold">Cancelar</Text>
              </TouchableOpacity>
              
              {isRecordingProgress ? (
                <View className="bg-accent rounded-xl py-2 px-4 flex-row items-center">
                  <ActivityIndicator size="small" color="#ffffff" />
                  <Text className="text-white font-bold ml-2">Guardando...</Text>
                </View>
              ) : (
                <TouchableOpacity
                  className="bg-accent rounded-xl py-2 px-4"
                  onPress={handleRecordProgress}
                >
                  <Text className="text-white font-bold">Guardar progreso</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default RoutineDetailScreen;
