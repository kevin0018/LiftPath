import { View, Text, Button } from 'react-native';
import 'nativewind';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '@/types/RootStackParamList';
import { FC } from 'react';

const HomeScreen: FC = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const handleLogout = () => {
    navigation.navigate('login');
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