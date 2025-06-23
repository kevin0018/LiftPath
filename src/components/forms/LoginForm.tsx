import { useState } from "react";
import { View, TextInput, Text, TouchableOpacity, Image } from "react-native";

interface LoginFormProps {
  onLoginSuccess: () => void;
}

const LoginForm = ({ onLoginSuccess }: LoginFormProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleLogin = async () => {
    setErrorMessage(null);
    try {
      if (!email || !password) {
        setErrorMessage("Por favor ingresa email y contraseña");
        return;
      }

      console.log("Login attempt:", email);
      
      // Simulación mejorada con validaciones más realistas
      if (email.includes("@") && email.includes(".") && password.length >= 6) {
        console.log("✅ Login exitoso");
        onLoginSuccess();
      } else if (!email.includes("@")) {
        setErrorMessage("Por favor ingresa un email válido");
      } else if (password.length < 6) {
        setErrorMessage("La contraseña debe tener al menos 6 caracteres");
      } else {
        setErrorMessage("Credenciales inválidas");
      }
    } catch (error: any) {
      console.log("Error:", error);
      setErrorMessage("Ha ocurrido un error inesperado.");
    }
  };

  return (
    <View className="flex-1 justify-center bg-primary p-8">
      {/* Logo */}
      <View className="items-center mb-12">
        <Image 
          source={require('../../assets/images/logo.png')} 
          className="w-72 h-72"
          style={{ tintColor: 'white' }}
          resizeMode="contain"
        />
      </View>

      {/* Form */}
      <View className="w-full space-y-4">
        {/* Email Input */}
        <TextInput
          className="bg-white rounded-lg px-4 py-4 text-base text-black"
          placeholder="Correo electrónico"
          placeholderTextColor="#666"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />

        {/* Password Input */}
        <TextInput
          className="bg-secondary rounded-lg px-4 py-4 text-base text-black mt-4"
          placeholder="Contraseña"
          placeholderTextColor="#666"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        {/* Error Message */}
        {errorMessage && (
          <Text className="text-red-500 text-center mb-4">
            {errorMessage}
          </Text>
        )}

        {/* Login Button */}
        <TouchableOpacity
          className="bg-accent rounded-lg py-4 mt-6"
          onPress={handleLogin}
        >
          <Text className="text-white text-center font-bold text-base">
            Entrar
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default LoginForm;