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

    // Get current path
    const currentPath = segments.join('/');
    console.log("Auth protection - isAuthenticated:", isAuthenticated, "path:", currentPath);
    
    // check if the current path is login, register or root
    const isPublicPath = currentPath === "login" || currentPath === "register" || currentPath === "";
    
    // Route protection
    if (!isAuthenticated && !isPublicPath) {
      console.log("Usuario no autenticado, redirigiendo a login...");
      router.replace("/login");
      return;
    }
    
    // Redirect if already authenticated 
    if (isAuthenticated && (currentPath === "login" || currentPath === "register")) {
      console.log("Usuario ya autenticado, redirigiendo a home...");
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
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="login" />
          <Stack.Screen name="register" />
          <Stack.Screen name="home" />
          <Stack.Screen name="profile" />
        </Stack>
      </AuthProtection>
    </AuthProvider>
  );
}