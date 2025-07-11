import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

export default function Home() {
  const router = useRouter();

  const handleLogout = () => {
    console.log("Logout (simulado)");
    router.push('/login');
  };

  return (
    <View className="flex-1 justify-center items-center p-5 bg-white">
      <Text className="text-2xl font-bold mb-2 text-center">
        Bienvenido a LiftPath
      </Text>
      
      <Text className="text-lg mb-8 text-center text-gray-600">
        Login exitoso - Aplicación funcionando
      </Text>
      
      <TouchableOpacity 
        className="bg-red-500 px-6 py-3 rounded-lg"
        onPress={handleLogout}
      >
        <Text className="text-white font-semibold">Cerrar sesión</Text>
      </TouchableOpacity>
    </View>
  );
}