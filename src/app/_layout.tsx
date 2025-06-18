import { Stack } from 'expo-router';
import '@/styles/global.css'; // Importa los estilos globales

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" />
    </Stack>
  );
}