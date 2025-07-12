import React from "react";
import { View, Text, TouchableOpacity, SafeAreaView, FlatList, Image } from "react-native";
import theme from "../constants/theme";
import { WorkoutRoutine as FirebaseRoutine } from "../services/routineService";

// Usar directamente el tipo de Firebase
type WorkoutRoutine = FirebaseRoutine;

interface WorkoutRoutinesScreenProps {
  routines: WorkoutRoutine[];
  onRoutineSelect: (id: string) => void;
}

const WorkoutRoutinesScreen = ({ routines, onRoutineSelect }: WorkoutRoutinesScreenProps) => {
  return (
    <View className="flex-1 min-h-screen bg-primary w-full h-full items-center justify-center px-4">
      <SafeAreaView className="w-full flex-1 min-h-screen bg-primary items-center justify-center">
        <View className="w-full max-w-sm flex-1 justify-center bg-primary rounded-2xl shadow-lg p-6">
          {/* Logo */}
          <View className="items-center mb-10 mt-2">
            <View style={{ width: 80, height: 80, backgroundColor: theme.colors.primary, borderRadius: 16, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
              <Image 
                source={require('../assets/images/logo.png')} 
                style={{ width: 72, height: 72, tintColor: 'white', backgroundColor: theme.colors.primary }}
                resizeMode="contain"
              />
            </View>
          </View>

          {/* Title */}
          <Text className="text-white text-center font-bold text-2xl mb-6">Tus rutinas</Text>

          {/* Routines List */}
          <FlatList
            data={routines}
            keyExtractor={(item, index) => item.id || `routine-${index}`}
            contentContainerStyle={{ paddingBottom: 24 }}
            renderItem={({ item }) => (
              <TouchableOpacity
                className="bg-white rounded-xl px-5 py-4 mb-4 shadow-sm"
                onPress={() => item.id && onRoutineSelect(item.id)}
              >
                <Text className="text-black font-bold text-lg mb-1">{item.name}</Text>
                <Text className="text-gray-600 text-sm">{item.description}</Text>
              </TouchableOpacity>
            )}
            ListEmptyComponent={
              <Text className="text-secondary text-center mt-8">No tienes rutinas guardadas.</Text>
            }
          />
        </View>
      </SafeAreaView>
    </View>
  );
};

export default WorkoutRoutinesScreen;
