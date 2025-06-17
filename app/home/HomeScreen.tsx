import { View, Text, Button } from 'react-native';
import 'nativewind';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '@/types/RootStackParamList';
import { FC } from 'react';

const HomeScreen: FC = () => {
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();

    const handleLogout = () => {
        navigation.navigate('Login');
    };

    return (
        <View className="flex-1 justify-center items-center bg-gray-100 p-5">
            <Text className="text-2xl font-bold mb-2 text-center">Bienvenido a LiftPath</Text>
            <Text className="text-lg text-gray-600 mb-5 text-center">Esta es tu pantalla principal</Text>
            <Button title="Cerrar sesión" onPress={handleLogout} />
        </View>
    );
};

export default HomeScreen;