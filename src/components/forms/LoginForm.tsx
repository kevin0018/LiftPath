import { useState } from "react";
import { View, TextInput, Text, TouchableOpacity, Image } from "react-native";
import { signIn } from "@/services/authService";
import theme from "@/constants/theme";

interface LoginFormProps {
  onLoginSuccess: () => void;
}

const LoginForm = ({ onLoginSuccess }: LoginFormProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null); // Error state

  const handleLogin = async () => {
    setErrorMessage(null); // Clear previous errors
    try {
      // Use the helper function to sign in
      await signIn(email, password);
      onLoginSuccess();
    } catch (error: any) {
      console.log("Error recibido:", error);
      // Handle errors based on Firebase Auth codes
      if (error.code === "auth/user-not-found") {
        setErrorMessage("Usuario no encontrado. Por favor verifica tu correo.");
      } else if (error.code === "auth/wrong-password") {
        setErrorMessage("La contraseña es incorrecta. Por favor, intenta de nuevo.");
      } else if (error.code === "auth/invalid-email") {
        setErrorMessage("El formato del correo electrónico es inválido.");
      } else if (error.code === "auth/invalid-credential") {
        setErrorMessage("Credenciales inválidas. Por favor verifica tu correo y contraseña.");
      } else {
        setErrorMessage("Ha ocurrido un error inesperado. Por favor, inténtalo más tarde.");
      }
    }
  };

  return (
    <View className="flex-1 justify-center bg-primary p-5">
      {/* Icon */}
      <View className="items-center mb-6">
        <Image 
          source={require("@/assets/images/logo.png")} 
          style={{ width: 300, height: 300 }}
        />
      </View>

      {/* Form */}
      <View className="w-full">
        {/* Email Input */}
        <TextInput
          className="border border-secondary rounded px-4 py-3 mb-4 bg-secondary text-primary"
          placeholder="Correo electrónico"
          keyboardType="email-address"
          placeholderTextColor={theme.colors.primary}
          value={email}
          onChangeText={(text) => setEmail(text)}
        />

        {/* Password Input */}
        <TextInput
          className="border border-secondary rounded px-4 py-3 mb-4 bg-secondary text-primary"
          placeholder="Contraseña"
          secureTextEntry
          placeholderTextColor={theme.colors.primary}
          value={password}
          onChangeText={(text) => setPassword(text)}
        />

        {/* Error Message */}
        {errorMessage && (
          <Text className="text-red-500 text-center mb-4">{errorMessage}</Text>
        )}

        {/* Login Button */}
        <TouchableOpacity
          className="bg-accent rounded py-3 mt-4"
          onPress={handleLogin}
        >
          <Text className="text-white text-center font-bold">Entrar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default LoginForm;