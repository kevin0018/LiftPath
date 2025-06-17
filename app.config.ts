import 'dotenv/config';

export default {
  expo: {
    name: "LiftPath",
    slug: "LiftPath",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/images/icon.png",
    extra: {
      API_KEY: process.env.API_KEY,
      AUTH_DOMAIN: process.env.AUTH_DOMAIN,
      PROJECT_ID: process.env.PROJECT_ID,
      STORAGE_BUCKET: process.env.STORAGE_BUCKET,
      MESSAGING_SENDER_ID: process.env.MESSAGING_SENDER_ID,
      APP_ID: process.env.APP_ID
    }
  }
};