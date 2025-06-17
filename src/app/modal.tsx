import { NavigationContainer } from "@react-navigation/native";
import { TailwindProvider } from "tailwindcss-react-native";
import { AuthProvider } from "@/context/AuthContext";
import AppNavigator from "@/navigation/AppNavigator";

const ModalApp = () => {
  return (
    <AuthProvider>
      <TailwindProvider>
        {/* Solo un NavigationContainer en el nivel raíz */}
        <NavigationContainer>
          <AppNavigator />
        </NavigationContainer>
      </TailwindProvider>
    </AuthProvider>
  );
};

export default ModalApp;