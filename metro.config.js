const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

const config = getDefaultConfig(__dirname);

// Configurar alias para resolver rutas
config.resolver.alias = {
  "@": "./src",
};

// Configurar NativeWind para estilos globales
module.exports = withNativeWind(config, { input: "./src/styles/globals.css" });