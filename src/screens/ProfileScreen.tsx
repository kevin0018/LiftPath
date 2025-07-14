import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, TextInput, FlatList, SafeAreaView, Modal, ActivityIndicator, Alert } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import theme from "../constants/theme";
import { 
  WorkoutRoutine, 
  getUserRoutines, 
  createRoutine, 
  updateRoutine, 
  deleteRoutine 
} from "../services/routineService";

interface ProfileScreenProps {
  onRoutinesUpdated?: () => void;
}

const ProfileScreen = ({ onRoutinesUpdated }: ProfileScreenProps) => {
  const [routines, setRoutines] = useState<WorkoutRoutine[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingRoutine, setEditingRoutine] = useState<WorkoutRoutine | null>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadRoutines();
  }, []);

  const loadRoutines = async () => {
    try {
      setLoading(true);
      const userRoutines = await getUserRoutines();
      setRoutines(userRoutines);
    } catch (error) {
      console.error('Error loading routines:', error);
      Alert.alert('Error', 'No se pudieron cargar las rutinas');
    } finally {
      setLoading(false);
    }
  };

  const openAddModal = () => {
    setEditingRoutine(null);
    setName("");
    setDescription("");
    setModalVisible(true);
  };

  const openEditModal = (routine: WorkoutRoutine) => {
    setEditingRoutine(routine);
    setName(routine.name);
    setDescription(routine.description);
    setModalVisible(true);
  };

  const handleSave = async () => {
    if (!name.trim()) return;
    
    try {
      setIsSubmitting(true);
      
      if (editingRoutine && editingRoutine.id) {
        await updateRoutine(editingRoutine.id, { name, description });
      } else {
        await createRoutine({ name, description });
      }
      
      await loadRoutines();
      if (onRoutinesUpdated) {
        onRoutinesUpdated();
      }
      
      setModalVisible(false);
    } catch (error) {
      console.error('Error saving routine:', error);
      Alert.alert('Error', 'No se pudo guardar la rutina');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      setLoading(true);
      await deleteRoutine(id);
      await loadRoutines();
      if (onRoutinesUpdated) {
        onRoutinesUpdated();
      }
    } catch (error) {
      console.error('Error deleting routine:', error);
      Alert.alert('Error', 'No se pudo eliminar la rutina');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 min-h-screen bg-primary w-full h-full items-center justify-center px-4">
      <SafeAreaView className="w-full flex-1 min-h-screen bg-primary items-center justify-center">
        <View className="w-full max-w-sm flex-1 justify-center bg-primary rounded-2xl shadow-lg p-6">
          {/* Title */}
          <Text className="text-white text-center font-bold text-2xl mb-6">Perfil</Text>
          <Text className="text-white text-center mb-4">Gestiona tus rutinas</Text>

          {/* Add Routine Button */}
          <TouchableOpacity 
            className="bg-accent rounded-xl py-3 mb-6" 
            onPress={openAddModal}
            disabled={loading || isSubmitting}
          >
            <Text className="text-white text-center font-bold text-base">Añadir rutina</Text>
          </TouchableOpacity>

          {/* Loading State */}
          {loading ? (
            <View className="flex-1 justify-center items-center">
              <ActivityIndicator size="large" color="#ffffff" />
              <Text className="text-white mt-4">Cargando rutinas...</Text>
            </View>
          ) : (
            /* Routines List */
            <FlatList
              data={routines}
              keyExtractor={item => item.id || ''}
              contentContainerStyle={{ paddingBottom: 24 }}
              renderItem={({ item }) => (
                <View className="bg-white rounded-xl px-5 py-4 mb-4 shadow-sm">
                  <Text className="text-black font-bold text-lg mb-1">{item.name}</Text>
                  <Text className="text-gray-600 text-sm mb-2">{item.description}</Text>
                  <View className="flex-row justify-end space-x-2">
                    <TouchableOpacity onPress={() => openEditModal(item)}>
                      <Ionicons name="create-outline" size={20} color={theme.colors.accent} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => item.id && handleDelete(item.id)}>
                      <Ionicons name="trash-outline" size={20} color="#f87171" />
                    </TouchableOpacity>
                  </View>
                </View>
              )}
              ListEmptyComponent={
                <Text className="text-secondary text-center mt-8">No tienes rutinas guardadas.</Text>
              }
            />
          )}
        </View>

        {/* Modal for Add/Edit Routine */}
        <Modal
          visible={modalVisible}
          transparent
          animationType="slide"
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <View className="w-full max-w-sm bg-primary rounded-2xl p-6">
              <Text className="text-white text-xl font-bold mb-4 text-center">
                {editingRoutine ? 'Editar rutina' : 'Añadir rutina'}
              </Text>
              <TextInput
                className="bg-white rounded-xl px-4 py-3 text-base text-black mb-4"
                placeholder="Nombre de la rutina"
                placeholderTextColor="#666"
                value={name}
                onChangeText={setName}
              />
              <TextInput
                className="bg-white rounded-xl px-4 py-3 text-base text-black mb-4"
                placeholder="Descripción"
                placeholderTextColor="#666"
                value={description}
                onChangeText={setDescription}
              />
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
      </SafeAreaView>
    </View>
  );
};

export default ProfileScreen;
