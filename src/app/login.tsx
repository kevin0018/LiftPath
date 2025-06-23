import { View } from 'react-native';
import LoginForm from '../components/forms/LoginForm';
import { useRouter } from 'expo-router';

export default function Login() {
  const router = useRouter();

  const handleLoginSuccess = () => {
    router.push('/home');
  };

  return (
    <View className="flex-1 justify-center bg-primary">
      <LoginForm onLoginSuccess={handleLoginSuccess} />
    </View>
  );
}