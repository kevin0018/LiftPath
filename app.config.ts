import 'dotenv/config';

export default {
  expo: {
    name: "LiftPath",
    slug: "LiftPath",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./src/assets/images/icon.png",
    scheme: "liftpath",
    userInterfaceStyle: "automatic",
    newArchEnabled: true,
    splash: {
      image: "./src/assets/images/splash-icon.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff",
    },
    ios: {
      supportsTablet: true,
    },
    android: {
      package: "com.kevin.liftpath",
      adaptiveIcon: {
        foregroundImage: "./src/assets/images/adaptive-icon.png",
        backgroundColor: "#ffffff",
      },
      edgeToEdgeEnabled: true,
    },
    web: {
      bundler: "metro",
      output: "static",
      favicon: "./src/assets/images/favicon.png",
    },
    plugins: [
      "expo-router",
      "expo-web-browser",
      "@react-native-google-signin/google-signin",
    ],
    experiments: {
      typedRoutes: true,
    },
    extra: {
      API_KEY: process.env.API_KEY,
      AUTH_DOMAIN: process.env.AUTH_DOMAIN,
      PROJECT_ID: process.env.PROJECT_ID,
      STORAGE_BUCKET: process.env.STORAGE_BUCKET,
      MESSAGING_SENDER_ID: process.env.MESSAGING_SENDER_ID,
      APP_ID: process.env.APP_ID,
      GOOGLE_WEB_CLIENT_ID: process.env.GOOGLE_WEB_CLIENT_ID,
      eas: {
        projectId: "5cab1b45-bb43-4628-90c5-5e70fe5813b5"
      }
    },
  },
};