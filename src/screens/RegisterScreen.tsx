import { View, StatusBar } from 'react-native';
import RegisterForm from '@/components/forms/RegisterForm';
import { useRouter } from 'expo-router';
import { FC } from "react";
import * as Linking from 'expo-linking';

const RegisterScreen: FC = () => {
  const router = useRouter();

  const handleRegisterSuccess = () => {
    const homeUrl = Linking.createURL('/home');
    Linking.openURL(homeUrl);
  };

  const handleLoginRedirect = () => {
    const loginUrl = Linking.createURL('/login');
    Linking.openURL(loginUrl);
  };

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#2a2a2a" />
      <View className="flex-1 bg-primary">
        <RegisterForm 
          onRegisterSuccess={handleRegisterSuccess} 
          onLoginRedirect={handleLoginRedirect}
        />
      </View>
    </>
  );
};

export default RegisterScreen;
