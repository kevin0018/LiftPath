import { Stack } from "expo-router";
import "@/styles/global.css";

export default function RootLayout() {
  return (
    <Stack initialRouteName="login">
      <Stack.Screen
        name="login"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="home"
        options={{ headerTitle: "Inicio" }}
      />
    </Stack>
  );
}