import { Stack } from "expo-router";
import "@/styles/global.css";
import "@/utils/setupWarnings";
import { AuthProvider } from "@/context/AuthContext";

export const unstable_settings = {
  initialRouteName: 'login',
};

export default function RootLayout() {
  return (
    <AuthProvider>
      <Stack initialRouteName="login">
        <Stack.Screen
          name="login"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="home"
          options={{ headerTitle: "Inicio" }}
        />
        <Stack.Screen
          name="index"
          options={{ headerShown: false }}
        />
      </Stack>
    </AuthProvider>
  );
}