import { View, Text, Button } from 'react-native';
import 'nativewind';
import { useRouter } from 'expo-router';
import { FC } from 'react';

const HomeScreen: FC = () => {
  const router = useRouter();

  const handleLogout = () => {
    router.push('/login');
  };

  return (
    <View className="flex-1 justify-center items-center bg-primary p-5">
      <Text className="text-2xl font-bold mb-2 text-center text-secondary">Bienvenido a LiftPath</Text>
      <Text className="text-lg mb-5 text-center text-secondary">Esta es tu pantalla principal</Text>
      <Button title="Cerrar sesión" onPress={handleLogout} />
    </View>
  );
};

export default HomeScreen;