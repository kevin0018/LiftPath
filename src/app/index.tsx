import { Redirect } from "expo-router";

const Index = () => {
  // Directly redirect to the login page
  return <Redirect href="/login" />;
};

export default Index;