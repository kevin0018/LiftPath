import React, { useState, useEffect } from "react";
import { 
  View, 
  Text, 
  TouchableOpacity, 
  SafeAreaView, 
  FlatList, 
  Modal, 
  ActivityIndicator,
  Alert,
  StyleSheet
} from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import theme from "../constants/theme";
import { 
  WeeklyPlanConfig, 
  getWeeklyPlanConfig, 
  saveWeeklyPlanConfig,
  initializeWeeklyPlanWithPPL
} from '../services/dailyProgressService';
import { 
  WorkoutRoutine,
  getUserRoutines
} from '../services/routineService';

const DAYS = [
  { id: 'monday', name: 'Lunes' },
  { id: 'tuesday', name: 'Martes' },
  { id: 'wednesday', name: 'Miércoles' },
  { id: 'thursday', name: 'Jueves' },
  { id: 'friday', name: 'Viernes' },
  { id: 'saturday', name: 'Sábado' },
  { id: 'sunday', name: 'Domingo' },
];

interface WeeklyPlanScreenProps {
  onClose?: () => void;
  onPlanUpdated?: () => void;
}

const WeeklyPlanScreen = ({ onClose, onPlanUpdated }: WeeklyPlanScreenProps) => {
  const router = useRouter();
  const [plan, setPlan] = useState<WeeklyPlanConfig | null>(null);
  const [routines, setRoutines] = useState<WorkoutRoutine[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [selectModalVisible, setSelectModalVisible] = useState(false);
  const [currentDay, setCurrentDay] = useState<string | null>(null);

  const handleGoBack = () => {
    if (onClose) {
      onClose();
    } else {
      router.back();
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🔍 Loading weekly plan data...');
      
      const userRoutines = await getUserRoutines();
      console.log('📋 User routines:', userRoutines);
      setRoutines(userRoutines);
      
      let weeklyPlan = await getWeeklyPlanConfig();
      console.log('📅 Weekly plan:', weeklyPlan);
      
      if (!weeklyPlan) {
        console.log('⚙️ No weekly plan found, initializing PPL...');
        weeklyPlan = await initializeWeeklyPlanWithPPL();
        console.log('✅ Initialized weekly plan:', weeklyPlan);
      }
      
      setPlan(weeklyPlan);
    } catch (err) {
      console.error('❌ Error loading data:', err);
      setError('No se pudo cargar la información del plan semanal');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectDay = (dayId: string) => {
    setCurrentDay(dayId);
    setSelectModalVisible(true);
  };

  const handleSelectRoutine = async (routineId: string | null) => {
    if (!currentDay || !plan?.id) return;
    
    try {
      setSubmitting(true);
      
      const updatedPlan = {
        ...plan,
        [currentDay]: routineId || undefined
      };
      
      await saveWeeklyPlanConfig({ [currentDay]: routineId || undefined });
      setPlan(updatedPlan);
      setSelectModalVisible(false);
      
      if (onPlanUpdated) {
        onPlanUpdated();
      }
    } catch (err) {
      console.error('Error updating weekly plan:', err);
      Alert.alert('Error', 'No se pudo actualizar el plan semanal');
    } finally {
      setSubmitting(false);
    }
  };

  const getRoutineName = (routineId: string | undefined) => {
    if (!routineId) return 'Descanso';
    const routine = routines.find(r => r.id === routineId);
    return routine ? routine.name : 'Rutina no encontrada';
  };

  const resetToDefaultPlan = async () => {
    try {
      setSubmitting(true);
      
      const pushRoutine = routines.find(r => r.name.toLowerCase().includes('push'));
      const pullRoutine = routines.find(r => r.name.toLowerCase().includes('pull'));
      const legRoutine = routines.find(r => r.name.toLowerCase().includes('leg'));
      
      const newPlan = await initializeWeeklyPlanWithPPL(
        pushRoutine?.id,
        pullRoutine?.id,
        legRoutine?.id
      );
      
      setPlan(newPlan);
      
      if (onPlanUpdated) {
        onPlanUpdated();
      }
      
      Alert.alert('Éxito', 'Plan semanal restablecido al formato Push-Pull-Legs');
    } catch (err) {
      console.error('Error resetting plan:', err);
      Alert.alert('Error', 'No se pudo restablecer el plan semanal');
    } finally {
      setSubmitting(false);
    }
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
              Plan Semanal
            </Text>
            <View style={{ width: 24 }} />
          </View>

          {/* Content */}
          {loading ? (
            <View className="flex-1 items-center justify-center">
              <ActivityIndicator size="large" color={theme.colors.accent} />
              <Text className="text-white mt-2">Cargando plan semanal...</Text>
            </View>
          ) : error ? (
            <View className="flex-1 items-center justify-center">
              <Ionicons name="alert-circle" size={48} color={theme.colors.error} />
              <Text className="text-white text-center mt-2">{error}</Text>
              <TouchableOpacity
                className="bg-accent mt-4 py-3 px-6 rounded-xl"
                onPress={loadData}
              >
                <Text className="text-white font-bold">Reintentar</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <>
              <Text className="text-white text-center mb-6">
                Configura tus entrenamientos para cada día de la semana
              </Text>
              
              {/* Weekly Plan */}
              <FlatList
                data={DAYS}
                keyExtractor={(item) => item.id}
                contentContainerStyle={{ paddingBottom: 20 }}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    className="bg-white rounded-xl px-5 py-4 mb-4 shadow-sm"
                    onPress={() => handleSelectDay(item.id)}
                    disabled={submitting}
                  >
                    <View className="flex-row items-center justify-between">
                      <Text className="text-black font-bold text-base">{item.name}</Text>
                      
                      <View className="flex-row items-center">
                        <Text className="text-gray-600 mr-2">
                          {plan && getRoutineName(plan[item.id as keyof WeeklyPlanConfig] as string | undefined)}
                        </Text>
                        <Ionicons name="chevron-forward" size={18} color={theme.colors.secondary} />
                      </View>
                    </View>
                  </TouchableOpacity>
                )}
              />
              
              {/* Reset Button */}
              <TouchableOpacity
                className="bg-gray-700 py-3 px-6 rounded-xl mt-2 items-center"
                onPress={resetToDefaultPlan}
                disabled={submitting}
              >
                {submitting ? (
                  <ActivityIndicator size="small" color="white" />
                ) : (
                  <Text className="text-white font-bold">Restablecer Plan Push-Pull-Legs</Text>
                )}
              </TouchableOpacity>
            </>
          )}

          {/* Routine Select Modal */}
          <Modal
            visible={selectModalVisible}
            transparent={true}
            animationType="fade"
            onRequestClose={() => setSelectModalVisible(false)}
          >
            <View className="flex-1 bg-black bg-opacity-50 items-center justify-center p-4">
              <View className="bg-white w-full max-w-sm p-6 rounded-2xl">
                <Text className="text-black font-bold text-lg mb-4">
                  Selecciona una rutina
                </Text>
                
                <FlatList
                  data={[
                    { id: 'rest', name: 'Descanso (ninguna rutina)' } as { id: string; name: string },
                    ...routines
                  ]}
                  keyExtractor={(item) => item.id || 'rest'}
                  contentContainerStyle={{ paddingBottom: 10 }}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      className="py-3 px-4 border-b border-gray-200"
                      onPress={() => handleSelectRoutine(item.id === 'rest' ? null : item.id as string)}
                    >
                      <Text className="text-black font-medium">
                        {item.name}
                      </Text>
                      {item.id !== 'rest' && 'description' in item && item.description && (
                        <Text className="text-gray-600 text-sm">
                          {item.description}
                        </Text>
                      )}
                    </TouchableOpacity>
                  )}
                />
                
                <TouchableOpacity
                  className="mt-4 py-2 px-4 self-end"
                  onPress={() => setSelectModalVisible(false)}
                >
                  <Text className="text-accent font-medium">Cancelar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        </View>
      </SafeAreaView>
    </View>
  );
};

export default WeeklyPlanScreen;
