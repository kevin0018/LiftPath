import { useState } from "react";
import { View, TextInput, Text, TouchableOpacity, Image, Alert, ActivityIndicator, SafeAreaView } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { registerUser, signInWithGoogle } from "../../services/authService";
import theme from "../../constants/theme";
import Constants from 'expo-constants';
import { Link } from 'expo-router';

interface RegisterFormProps {
  onRegisterSuccess: () => void;
  onLoginRedirect?: () => void;
}

const RegisterForm = ({ onRegisterSuccess, onLoginRedirect }: RegisterFormProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  // Check if running in Expo Go
  const isExpoGo = Constants.appOwnership === 'expo';

  const handleRegister = async () => {
    if (isLoading) return;
    
    setErrorMessage(null);
    setIsLoading(true);
    
    try {
      if (!email || !password || !confirmPassword) {
        setErrorMessage("Por favor completa todos los campos");
        setIsLoading(false);
        return;
      }

      if (!email.includes("@") || !email.includes(".")) {
        setErrorMessage("Por favor ingresa un email válido");
        setIsLoading(false);
        return;
      }

      if (password.length < 6) {
        setErrorMessage("La contraseña debe tener al menos 6 caracteres");
        setIsLoading(false);
        return;
      }

      if (password !== confirmPassword) {
        setErrorMessage("Las contraseñas no coinciden");
        setIsLoading(false);
        return;
      }

      console.log("Intentando registro con email:", email);
      const result = await registerUser(email, password);
      console.log("✅ Registro exitoso:", result.user.email);
      onRegisterSuccess();
      
    } catch (error: any) {
      console.error("Error en registro:", error);
      
      // Manejo de errores específicos de Firebase
      if (error.code === 'auth/email-already-in-use') {
        setErrorMessage("Este email ya está registrado");
      } else if (error.code === 'auth/invalid-email') {
        setErrorMessage("Email inválido");
      } else if (error.code === 'auth/weak-password') {
        setErrorMessage("La contraseña es muy débil");
      } else {
        setErrorMessage("Error al registrar. Por favor intenta de nuevo");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    if (isGoogleLoading) return;
    
    setErrorMessage(null);
    setIsGoogleLoading(true);
    
    try {
      console.log("Intentando registro con Google...");
      const result = await signInWithGoogle();
      console.log("✅ Google registro exitoso:", result.user.email);
      onRegisterSuccess();
      
    } catch (error: any) {
      console.error("Error en Google registro:", error);
      
      if (error.code === 'auth/account-exists-with-different-credential') {
        setErrorMessage("Ya existe una cuenta con este email usando otro método");
      } else if (error.code === 'auth/credential-already-in-use') {
        setErrorMessage("Esta cuenta de Google ya está en uso");
      } else if (error.code === 'auth/popup-closed-by-user') {
        setErrorMessage("Registro cancelado por el usuario");
      } else if (error.message?.includes('Expo Go')) {
        setErrorMessage("Google Sign-In requiere un custom development build");
      } else {
        setErrorMessage("Error al registrarse con Google");
      }
    } finally {
      setIsGoogleLoading(false);
    }
  };

  return (
    <View className="flex-1 min-h-screen bg-primary w-full h-full items-center justify-center px-4">
      <SafeAreaView className="w-full flex-1 min-h-screen bg-primary items-center justify-center">
        <View className="w-full max-w-sm flex-1 justify-center bg-primary rounded-2xl shadow-lg p-6">
          {/* Logo */}
          <View className="items-center mb-8 mt-2">
            <View style={{ width: 180, height: 180, backgroundColor: theme.colors.primary, borderRadius: 32, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
              <Image 
                source={require('../../assets/images/logo.png')} 
                style={{ width: 180, height: 180, tintColor: 'white', backgroundColor: theme.colors.primary }}
                resizeMode="contain"
              />
            </View>
          </View>

          <Text className="text-white text-center text-2xl font-bold mb-6">Crear cuenta</Text>

          {/* Form */}
          <View className="w-full space-y-5">
            {/* Email Input */}
            <View className="relative">
              <TextInput
                className="bg-white rounded-xl px-5 py-4 text-base text-black pr-12 shadow-sm"
                placeholder="Correo electrónico"
                placeholderTextColor="#666"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                value={email}
                onChangeText={setEmail}
                editable={!isLoading && !isGoogleLoading}
              />
              <Ionicons 
                name="mail-outline" 
                size={20} 
                color="#666" 
                style={{ position: 'absolute', right: 16, top: 18 }}
              />
            </View>

            {/* Password Input */}
            <View className="relative">
              <TextInput
                className="bg-white rounded-xl px-5 py-4 text-base text-black pr-12 shadow-sm"
                placeholder="Contraseña"
                placeholderTextColor="#666"
                secureTextEntry
                autoCapitalize="none"
                autoCorrect={false}
                value={password}
                onChangeText={setPassword}
                editable={!isLoading && !isGoogleLoading}
              />
              <Ionicons 
                name="lock-closed-outline" 
                size={20} 
                color="#666" 
                style={{ position: 'absolute', right: 16, top: 18 }}
              />
            </View>

            {/* Confirm Password Input */}
            <View className="relative">
              <TextInput
                className="bg-white rounded-xl px-5 py-4 text-base text-black pr-12 shadow-sm"
                placeholder="Confirmar contraseña"
                placeholderTextColor="#666"
                secureTextEntry
                autoCapitalize="none"
                autoCorrect={false}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                editable={!isLoading && !isGoogleLoading}
              />
              <Ionicons 
                name="lock-closed-outline" 
                size={20} 
                color="#666" 
                style={{ position: 'absolute', right: 16, top: 18 }}
              />
            </View>

            {/* Error Message */}
            {errorMessage && (
              <View className="bg-red-100 border border-red-400 rounded-xl p-3 mt-2">
                <Text className="text-red-700 text-center text-sm">
                  {errorMessage}
                </Text>
              </View>
            )}

            {/* Register Button */}
            <TouchableOpacity
              className={`rounded-xl py-4 mt-2 ${isLoading || isGoogleLoading ? 'bg-gray-400' : 'bg-accent'} shadow-md`}
              onPress={handleRegister}
              disabled={isLoading || isGoogleLoading}
            >
              <View className="flex-row items-center justify-center">
                {isLoading && (
                  <ActivityIndicator 
                    size="small" 
                    color="white" 
                    style={{ marginRight: 8 }} 
                  />
                )}
                <Text className="text-white text-center font-bold text-base">
                  {isLoading ? 'Registrando...' : 'Crear cuenta'}
                </Text>
              </View>
            </TouchableOpacity>

            {/* Divider - Only show if Google Sign-In is available */}
            {!isExpoGo && (
              <View className="flex-row items-center mt-6 mb-4">
                <View className="flex-1 h-px bg-secondary" />
                <Text className="mx-4 text-secondary text-sm">O</Text>
                <View className="flex-1 h-px bg-secondary" />
              </View>
            )}

            {/* Google Login Button - Only show if not in Expo Go */}
            {!isExpoGo && (
              <TouchableOpacity
                className={`border-2 border-white rounded-xl py-4 ${isLoading || isGoogleLoading ? 'opacity-50' : ''} shadow-md`}
                onPress={handleGoogleLogin}
                disabled={isLoading || isGoogleLoading}
              >
                <View className="flex-row items-center justify-center">
                  {isGoogleLoading && (
                    <ActivityIndicator 
                      size="small" 
                      color="white" 
                      style={{ marginRight: 8 }} 
                    />
                  )}
                  {!isGoogleLoading && (
                    <Ionicons 
                      name="logo-google" 
                      size={20} 
                      color="white" 
                      style={{ marginRight: 8 }}
                    />
                  )}
                  <Text className="text-white text-center font-bold text-base">
                    {isGoogleLoading ? 'Conectando...' : 'Continuar con Google'}
                  </Text>
                </View>
              </TouchableOpacity>
            )}

            {/* Expo Go Notice */}
            {isExpoGo && (
              <View className="border-2 border-gray-500 rounded-xl py-4 opacity-50">
                <View className="flex-row items-center justify-center">
                  <Ionicons 
                    name="information-circle-outline" 
                    size={20} 
                    color="#a4a5ad" 
                    style={{ marginRight: 8 }}
                  />
                  <Text className="text-secondary text-center text-sm">
                    Google Sign-In no disponible en Expo Go
                  </Text>
                </View>
              </View>
            )}

            {/* Login Link */}
            <View className="mt-8">
              <View className="flex-row justify-center">
                <Text className="text-secondary">¿Ya tienes cuenta? </Text>
                <Link href="/login" asChild>
                  <TouchableOpacity activeOpacity={0.7}>
                    <Text 
                      className="text-accent font-bold"
                      style={{ textDecorationLine: 'underline' }}
                    >
                      Inicia sesión aquí
                    </Text>
                  </TouchableOpacity>
                </Link>
              </View>
            </View>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
};

export default RegisterForm;
