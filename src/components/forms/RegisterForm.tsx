import { useState } from "react";
import { View, TextInput, Text, TouchableOpacity, Image, ActivityIndicator, SafeAreaView } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { registerUser, signInWithGoogle } from "../../services/authService";
import theme from "../../constants/theme";
import Constants from 'expo-constants';

interface RegisterFormProps {
  onRegisterSuccess: () => void;
  onLoginRedirect: () => void;
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
      // Validaciones
      if (!email || !password || !confirmPassword) {
        setErrorMessage("Por favor completa todos los campos");
        return;
      }

      if (!email.includes("@") || !email.includes(".")) {
        setErrorMessage("Por favor ingresa un email válido");
        return;
      }

      if (password.length < 6) {
        setErrorMessage("La contraseña debe tener al menos 6 caracteres");
        return;
      }

      if (password !== confirmPassword) {
        setErrorMessage("Las contraseñas no coinciden");
        return;
      }

      console.log("Intentando registrar usuario con email:", email);
      const result = await registerUser(email, password);
      console.log("✅ Registro exitoso:", result.user.email);
      onRegisterSuccess();
      
    } catch (error: any) {
      console.error("Error en registro:", error);
      
      // Manejo de errores específicos de Firebase
      if (error.code === 'auth/email-already-in-use') {
        setErrorMessage("Ya existe una cuenta con este email");
      } else if (error.code === 'auth/invalid-email') {
        setErrorMessage("Email inválido");
      } else if (error.code === 'auth/weak-password') {
        setErrorMessage("La contraseña es demasiado débil");
      } else {
        setErrorMessage("Error al crear la cuenta. Inténtalo de nuevo.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleRegister = async () => {
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
    <SafeAreaView className="flex-1 px-6 pt-16">
      <View className="items-center mb-8">
        <Image 
          source={require("../../assets/images/logo.png")}
          className="w-32 h-32"
          resizeMode="contain"
        />
        <Text className="text-3xl font-bold text-white mt-2">Crea tu cuenta</Text>
        <Text className="text-gray-300 text-center mt-1">
          Registrate para comenzar a seguir tus entrenamientos
        </Text>
      </View>

      {errorMessage && (
        <View className="bg-red-500/20 p-3 rounded-lg mb-4">
          <Text className="text-red-500 text-center">{errorMessage}</Text>
        </View>
      )}

      <View className="space-y-4">
        <View className="bg-neutral-800 rounded-lg flex-row items-center px-4 py-3">
          <Ionicons name="mail-outline" size={22} color={theme.colors.secondary} />
          <TextInput
            className="flex-1 text-white ml-3"
            placeholder="Email"
            placeholderTextColor={theme.colors.secondary}
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />
        </View>

        <View className="bg-neutral-800 rounded-lg flex-row items-center px-4 py-3">
          <Ionicons name="lock-closed-outline" size={22} color={theme.colors.secondary} />
          <TextInput
            className="flex-1 text-white ml-3"
            placeholder="Contraseña"
            placeholderTextColor={theme.colors.secondary}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </View>

        <View className="bg-neutral-800 rounded-lg flex-row items-center px-4 py-3">
          <Ionicons name="lock-closed-outline" size={22} color={theme.colors.secondary} />
          <TextInput
            className="flex-1 text-white ml-3"
            placeholder="Confirmar contraseña"
            placeholderTextColor={theme.colors.secondary}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
          />
        </View>

        <TouchableOpacity
          className={`py-4 rounded-lg items-center ${isLoading ? 'bg-emerald-800' : 'bg-emerald-600'}`}
          onPress={handleRegister}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text className="text-white font-bold text-lg">Registrarse</Text>
          )}
        </TouchableOpacity>

        <View className="flex-row items-center my-2">
          <View className="flex-1 h-0.5 bg-neutral-700" />
          <Text className="mx-4 text-neutral-400">O</Text>
          <View className="flex-1 h-0.5 bg-neutral-700" />
        </View>

        <TouchableOpacity
          className={`py-4 rounded-lg flex-row items-center justify-center bg-neutral-800 ${isGoogleLoading ? 'opacity-70' : ''}`}
          onPress={handleGoogleRegister}
          disabled={isGoogleLoading}
        >
          {isGoogleLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <Ionicons name="logo-google" size={20} color="#fff" style={{ marginRight: 8 }} />
              <Text className="text-white font-medium">Continuar con Google</Text>
            </>
          )}
        </TouchableOpacity>
      </View>

      <View className="mt-8 flex-row justify-center">
        <Text className="text-neutral-400">¿Ya tienes una cuenta? </Text>
        <TouchableOpacity onPress={onLoginRedirect}>
          <Text className="text-emerald-500 font-medium">Inicia sesión</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default RegisterForm;
