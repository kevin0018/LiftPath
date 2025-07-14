import { Redirect } from "expo-router";
import { View, ActivityIndicator, Text } from 'react-native';
import { useAuth } from "../context/AuthContext";

export default function Index() {
  const { isAuthenticated, loading } = useAuth();
  
  // Si todavía estamos cargando el estado de autenticación
  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#2a2a2a' }}>
        <ActivityIndicator size="large" color="#ffffff" />
        <Text style={{ color: '#ffffff', marginTop: 20 }}>Iniciando LiftPath...</Text>
      </View>
    );
  }
  
  // Si el usuario ya está autenticado, ir a home, de lo contrario ir a login
  return <Redirect href={isAuthenticated ? "/home" : "/login"} />;
}