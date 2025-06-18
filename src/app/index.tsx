import { Text, View } from 'react-native';

export default function Index() {
  return (
    <View className="flex-1 items-center justify-center bg-black p-4">
      <Text className="text-2xl font-bold text-white">Welcome to the App!</Text>
      <Text className="mt-4 text-lg text-white">This is the main index page.</Text>
    </View>
  );
}