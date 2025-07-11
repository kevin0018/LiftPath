import { View, StatusBar } from 'react-native';
import LoginForm from '@/components/forms/LoginForm';
import { useRouter } from 'expo-router';
import { FC } from "react";

const LoginScreen: FC = () => {
  const router = useRouter();

  const handleLoginSuccess = () => {
    router.push('/home');
  };

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#2a2a2a" />
      <View className="flex-1 bg-primary">
        <LoginForm onLoginSuccess={handleLoginSuccess} />
      </View>
    </>
  );
};

export default LoginScreen;