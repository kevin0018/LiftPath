import React, { useState, useEffect } from "react";
import { View, TouchableOpacity, Text, Modal, Pressable, ActivityIndicator, SafeAreaView, Image } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAuth } from "../context/AuthContext";
import * as Linking from 'expo-linking';
import WorkoutRoutinesScreen from "./WorkoutRoutinesScreen";
import ProfileScreen from "./ProfileScreen";
import RoutineDetailScreen from "./RoutineDetailScreen";
import { getUserRoutines, type WorkoutRoutine } from "../services/routineService";
import theme from "../constants/theme";
import { debugRoutines, debugWeeklyPlan } from "../utils/debugUtils";

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
      console.log('🔍 Loading routines...');
      const userRoutines = await getUserRoutines();
      console.log('📋 Loaded routines:', userRoutines);
      setRoutines(userRoutines);
    } catch (err) {
      console.error('❌ Error loading routines:', err);
      setError('No se pudieron cargar las rutinas');
    } finally {
      setLoading(false);
    }
  };

  const handleDebugRoutines = async () => {
    try {
      console.log('🔧 Debug: Starting routine debug...');
      await debugRoutines();
      await debugWeeklyPlan();
      // Reload routines after debug
      await loadRoutines();
    } catch (error) {
      console.error('❌ Debug error:', error);
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
      const loginUrl = Linking.createURL('/login');
      Linking.openURL(loginUrl);
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  return (
    <View className="flex-1 min-h-screen bg-primary w-full h-full">
      <SafeAreaView className="w-full flex-1 min-h-screen bg-primary">
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

        {/* Centered Content Container */}
        <View className="flex-1 items-center justify-center px-4">
          <View className="w-full max-w-sm">
            
            {/* Logo */}
            <View className="items-center mb-8">
              <View style={{ width: 120, height: 120, backgroundColor: theme.colors.primary, borderRadius: 24, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                <Image 
                  source={require('../assets/images/logo.png')} 
                  style={{ width: 120, height: 120, tintColor: 'white', backgroundColor: theme.colors.primary }}
                  resizeMode="contain"
                />
              </View>
            </View>

            {/* Quick Actions */}
            <View className="w-full space-y-4 mb-8">
              <TouchableOpacity 
                className="bg-accent rounded-xl py-4 px-4 shadow-md"
                onPress={() => router.push({pathname: 'daily-progress'} as any)}
              >
                <View className="flex-row items-center justify-center">
                  <Ionicons name="checkbox" size={24} color="white" style={{ marginRight: 8 }} />
                  <Text className="text-white font-bold text-base">Progreso Diario</Text>
                </View>
              </TouchableOpacity>
              
              <TouchableOpacity 
                className="bg-accent rounded-xl py-4 px-4 shadow-md"
                onPress={() => router.push({pathname: 'weekly-plan'} as any)}
              >
                <View className="flex-row items-center justify-center">
                  <Ionicons name="calendar" size={24} color="white" style={{ marginRight: 8 }} />
                  <Text className="text-white font-bold text-base">Plan Semanal</Text>
                </View>
              </TouchableOpacity>
              
              {/* Debug Button - Remove after testing */}
              <TouchableOpacity 
                className="bg-secondary rounded-xl py-4 px-4 shadow-md"
                onPress={handleDebugRoutines}
              >
                <View className="flex-row items-center justify-center">
                  <Ionicons name="bug" size={24} color="white" style={{ marginRight: 8 }} />
                  <Text className="text-white font-bold text-base">Debug Rutinas</Text>
                </View>
              </TouchableOpacity>
            </View>

            {/* Main Content */}
            {loading ? (
              <View className="items-center py-8">
                <ActivityIndicator size="large" color="#ffffff" />
                <Text className="text-white mt-4">Cargando rutinas...</Text>
              </View>
            ) : error ? (
              <View className="items-center py-8">
                <Text className="text-red-400 text-center mb-4">{error}</Text>
                <TouchableOpacity 
                  className="bg-secondary px-4 py-2 rounded-lg" 
                  onPress={loadRoutines}
                >
                  <Text className="text-white">Reintentar</Text>
                </TouchableOpacity>
              </View>
            ) : routines.length === 0 ? (
              <View className="items-center py-8">
                <Ionicons name="barbell-outline" size={48} color="#FFFFFF80" />
                <Text className="text-white text-center text-lg font-bold mt-4 mb-2">No tienes rutinas todavía</Text>
                <Text className="text-gray-300 text-center mb-6 text-sm">Puedes crear tu primera rutina desde la sección de perfil</Text>
                <TouchableOpacity 
                  className="bg-accent px-6 py-3 rounded-xl"
                  onPress={() => setProfileModalVisible(true)}
                >
                  <Text className="text-white font-bold">Crear rutina</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View className="w-full">
                <View className="mb-4">
                  <Text className="text-white text-xl font-bold mb-2 text-center">Tus rutinas</Text>
                  <Text className="text-gray-300 text-center text-sm">Selecciona una rutina para ver detalles</Text>
                </View>
                {/* Display routine cards in a similar style */}
                <View className="space-y-3">
                  {routines.map((routine) => (
                    <TouchableOpacity
                      key={routine.id}
                      className="bg-white rounded-xl p-4 shadow-sm"
                      onPress={() => routine.id && handleRoutineSelect(routine.id)}
                    >
                      <View className="flex-row items-center justify-between">
                        <View className="flex-1">
                          <Text className="text-black font-bold text-base">{routine.name}</Text>
                          <Text className="text-gray-600 text-sm mt-1">
                            {routine.description} • {routine.exercises?.length || 0} ejercicios
                          </Text>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color="#666" />
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}

          </View>
        </View>

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
      </SafeAreaView>
    </View>
  );
};

export default HomeScreen;