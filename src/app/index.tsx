import { useRouter } from "expo-router";
import { useEffect, useState } from "react";

const Index = () => {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted) {
      router.replace("/login");
    }
  }, [isMounted, router]);

  return null;
};

export default Index;