import { View, StatusBar } from 'react-native';
import LoginForm from '@/components/forms/LoginForm';
import { useRouter } from 'expo-router';
import { FC } from "react";
import * as Linking from 'expo-linking';

const LoginScreen: FC = () => {
  const router = useRouter();

  const handleLoginSuccess = () => {
    const homeUrl = Linking.createURL('/home');
    Linking.openURL(homeUrl);
  };

  const handleRegisterRedirect = () => {};

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#2a2a2a" />
      <View className="flex-1 bg-primary">
        <LoginForm 
          onLoginSuccess={handleLoginSuccess} 
          onRegisterRedirect={handleRegisterRedirect}
        />
      </View>
    </>
  );
};

export default LoginScreen;