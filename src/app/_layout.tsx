import { Stack, useRouter, useSegments } from "expo-router";
import "../styles/global.css";
import { useEffect } from "react";
import { AuthProvider, useAuth } from "../context/AuthContext";
import { Text, View, ActivityIndicator } from "react-native";

// Auth protection component
function AuthProtection({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    // Skip protection if we're still loading the auth state
    if (loading) return;

    const isOnAuthScreen = segments[0] === "login" || segments[0] === "index";
    
    console.log("Auth protection - isAuthenticated:", isAuthenticated, "isOnAuthScreen:", isOnAuthScreen);
    
    // If not authenticated and not on an auth screen, redirect to login
    if (!isAuthenticated && !isOnAuthScreen) {
      console.log("Redirecting to login...");
      router.replace("/login");
    }
    
    // If authenticated and on an auth screen, redirect to home
    if (isAuthenticated && isOnAuthScreen && segments[0] !== "index") {
      console.log("Redirecting to home...");
      router.replace("/home");
    }
  }, [isAuthenticated, loading, segments]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#2a2a2a' }}>
        <ActivityIndicator size="large" color="#ffffff" />
        <Text style={{ color: '#ffffff', marginTop: 20 }}>Cargando...</Text>
      </View>
    );
  }

  return <>{children}</>;
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <AuthProtection>
        <Stack>
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="login" options={{ headerShown: false }} />
          <Stack.Screen name="home" options={{ headerShown: false }} />
        </Stack>
      </AuthProtection>
    </AuthProvider>
  );
}