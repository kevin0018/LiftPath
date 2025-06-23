import { View } from 'react-native';
import LoginForm from '@/components/forms/LoginForm';
import { useRouter } from 'expo-router';
import { FC } from "react";

const LoginScreen: FC = () => {
  const router = useRouter();

  const handleLoginSuccess = () => {
    router.push('/home');
  };

  return (
    <View className="flex-1 justify-center bg-secondary">
      <LoginForm onLoginSuccess={handleLoginSuccess} />
    </View>
  );
};

export default LoginScreen;