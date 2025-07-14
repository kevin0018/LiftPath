import React, { useState, useEffect } from "react";
import { View, TouchableOpacity, Text, Modal, Pressable, ActivityIndicator } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAuth } from "../context/AuthContext";
import * as Linking from 'expo-linking';
import WorkoutRoutinesScreen from "./WorkoutRoutinesScreen";
import ProfileScreen from "./ProfileScreen";
import RoutineDetailScreen from "./RoutineDetailScreen";
import { getUserRoutines, type WorkoutRoutine } from "../services/routineService";

const HomeScreen = () => {
  const router = useRouter();
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [profileModalVisible, setProfileModalVisible] = useState(false);
  const [routines, setRoutines] = useState<WorkoutRoutine[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedRoutineId, setSelectedRoutineId] = useState<string | null>(null);
  const [routineDetailVisible, setRoutineDetailVisible] = useState(false);
  
  useEffect(() => {
    loadRoutines();
  }, []);
  
  const loadRoutines = async () => {
    try {
      setLoading(true);
      setError(null);
      const userRoutines = await getUserRoutines();
      setRoutines(userRoutines);
    } catch (err) {
      console.error('Error loading routines:', err);
      setError('No se pudieron cargar las rutinas');
    } finally {
      setLoading(false);
    }
  };

  const handleRoutineSelect = (id: string) => {
    if (id) {
      setSelectedRoutineId(id);
      setRoutineDetailVisible(true);
    }
  };

  const { logout } = useAuth();
  
  const handleProfile = () => {
    setDropdownVisible(false);
    setProfileModalVisible(true);
  };

  const handleLogout = async () => {
    setDropdownVisible(false);
    try {
      await logout();
      // La redirección a login debería ocurrir automáticamente debido a AuthProtection en _layout.tsx
      // Pero por si acaso, redirigimos manualmente
      const loginUrl = Linking.createURL('/login');
      Linking.openURL(loginUrl);
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  return (
    <View className="flex-1 bg-primary">
      {/* Top Bar */}
      <View className="w-full flex-row items-center justify-between px-4 py-3 bg-primary shadow-sm">
        <Text className="text-white text-xl font-bold">Inicio</Text>
        <TouchableOpacity onPress={() => setDropdownVisible(true)}>
          <Ionicons name="person-circle-outline" size={32} color="white" />
        </TouchableOpacity>
      </View>

      {/* Dropdown Modal */}
      <Modal
        visible={dropdownVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setDropdownVisible(false)}
      >
        <Pressable style={{ flex: 1 }} onPress={() => setDropdownVisible(false)}>
          <View style={{ position: 'absolute', top: 56, right: 16, backgroundColor: '#222', borderRadius: 12, paddingVertical: 12, paddingHorizontal: 20, shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 8, elevation: 8 }}>
            <TouchableOpacity onPress={handleProfile} style={{ marginBottom: 12 }}>
              <Text style={{ color: 'white', fontSize: 16 }}>Perfil</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleLogout}>
              <Text style={{ color: '#f87171', fontSize: 16, fontWeight: 'bold' }}>Cerrar sesión</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>

      {/* Profile Modal */}
      <Modal
        visible={profileModalVisible}
        animationType="slide"
        onRequestClose={() => setProfileModalVisible(false)}
      >
        <View className="flex-1 bg-primary">
          <View className="w-full flex-row items-center justify-between px-4 py-3 bg-primary shadow-sm">
            <Text className="text-white text-xl font-bold">Perfil</Text>
            <TouchableOpacity onPress={() => setProfileModalVisible(false)}>
              <Ionicons name="close" size={28} color="white" />
            </TouchableOpacity>
          </View>
          <ProfileScreen onRoutinesUpdated={loadRoutines} />
        </View>
      </Modal>

      {/* Main Content */}
      {loading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#ffffff" />
          <Text className="text-white mt-4">Cargando rutinas...</Text>
        </View>
      ) : error ? (
        <View className="flex-1 justify-center items-center px-4">
          <Text className="text-red-400 text-center mb-4">{error}</Text>
          <TouchableOpacity 
            className="bg-secondary px-4 py-2 rounded-lg" 
            onPress={loadRoutines}
          >
            <Text className="text-white">Reintentar</Text>
          </TouchableOpacity>
        </View>
      ) : routines.length === 0 ? (
        <View className="flex-1 justify-center items-center px-6">
          <Ionicons name="barbell-outline" size={64} color="#FFFFFF80" />
          <Text className="text-white text-center text-xl font-bold mt-4 mb-2">No tienes rutinas todavía</Text>
          <Text className="text-gray-300 text-center mb-6">Puedes crear tu primera rutina desde la sección de perfil</Text>
          <TouchableOpacity 
            className="bg-accent px-6 py-3 rounded-xl"
            onPress={() => setProfileModalVisible(true)}
          >
            <Text className="text-white font-bold">Crear rutina</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <WorkoutRoutinesScreen routines={routines} onRoutineSelect={handleRoutineSelect} />
      )}

      {/* Routine Detail Modal */}
      <Modal
        visible={routineDetailVisible}
        animationType="slide"
        onRequestClose={() => setRoutineDetailVisible(false)}
      >
        {selectedRoutineId && (
          <RoutineDetailScreen
            routineId={selectedRoutineId}
            onClose={() => setRoutineDetailVisible(false)}
            onRoutineUpdated={loadRoutines}
          />
        )}
      </Modal>
    </View>
  );
};

export default HomeScreen;