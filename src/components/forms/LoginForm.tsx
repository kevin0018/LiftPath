import { View, TextInput, Button } from 'react-native';

// Define the type of props expected by the LoginForm component
interface LoginFormProps {
  onLoginSuccess: () => void; // Callback to indicate successful login
}

const LoginForm = ({ onLoginSuccess }: LoginFormProps) => {
  const handleLogin = async () => {
    onLoginSuccess();
  };

  return (
    <View className="flex-1 justify-center bg-gray-100 p-5">
      {/* Email Input */}
      <TextInput
        className="border border-gray-300 rounded px-4 py-3 mb-4 bg-white"
        placeholder="Correo electrónico"
        keyboardType="email-address"
        placeholderTextColor="#888"
      />

      {/* Password Input */}
      <TextInput
        className="border border-gray-300 rounded px-4 py-3 mb-4 bg-white"
        placeholder="Contraseña"
        secureTextEntry
        placeholderTextColor="#888"
      />

      {/* Login Button */}
      <Button title="Entrar" onPress={handleLogin} />
    </View>
  );
};

export default LoginForm;