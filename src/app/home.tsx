import { useRouter } from 'expo-router';
import HomeScreen from '../screens/HomeScreen';
import { StatusBar } from 'react-native';

export default function Home() {
  const router = useRouter();
  
  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#2a2a2a" />
      <HomeScreen />
    </>
  );
}