import { useState } from "react";
import { View, TextInput, Text, TouchableOpacity, Alert } from "react-native";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/services/firebaseConfig";
import theme from "@/constants/theme";

interface LoginFormProps {
  onLoginSuccess: () => void;
}

const LoginForm = ({ onLoginSuccess }: LoginFormProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      onLoginSuccess();
    } catch (error: any) {
      Alert.alert(
        "Error de inicio de sesión",
        error.message.includes("user-not-found")
          ? "Usuario no encontrado. Por favor verifica tu correo."
          : "Credenciales incorrectas o problemas de red."
      );
    }
  };

  return (
    <View className="flex-1 justify-center bg-primary p-5">
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

      {/* Login Button */}
      <TouchableOpacity
        className="bg-accent rounded py-3 mt-4"
        onPress={handleLogin}
      >
        <Text className="text-white text-center font-bold">Entrar</Text>
      </TouchableOpacity>
    </View>
  );
};

export default LoginForm;