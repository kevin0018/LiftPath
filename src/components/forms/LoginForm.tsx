import { View, TextInput, Text, TouchableOpacity, Image } from "react-native";
import theme from "@/constants/theme";

// Define the type of props expected by the LoginForm component
interface LoginFormProps {
  onLoginSuccess: () => void;
}

const LoginForm = ({ onLoginSuccess }: LoginFormProps) => {
  const handleLogin = async () => {
    onLoginSuccess();
  };

  return (
    <View className="flex-1 justify-center bg-primary p-5">
      {/* Logo */}
      <View className="items-center mb-6">
        <Image
          source={require("../../assets/images/logo.png")}
          style={{ width: 300, height: 300 }}
        />
      </View>

      {/* Email Input */}
      <TextInput
        className="border border-secondary rounded px-4 py-3 mb-4 bg-secondary text-primary"
        placeholder="Correo electrónico"
        keyboardType="email-address"
        placeholderTextColor={theme.colors.primary}
      />

      {/* Password Input */}
      <TextInput
        className="border border-secondary rounded px-4 py-3 mb-4 bg-secondary text-primary"
        placeholder="Contraseña"
        secureTextEntry
        placeholderTextColor={theme.colors.primary}
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