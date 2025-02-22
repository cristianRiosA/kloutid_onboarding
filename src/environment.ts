export const isProduction = process.env.NODE_ENV === "production";

export const firebase = {
  key: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  domain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  // database: process.env.NEXT_PUBLIC_FIREBASE_DATABASE,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  senderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};
export const ShopifyAuthUrl = process.env.NEXT_PUBLIC_SHOPIFY_AUTH_URL;

export const api = {
  core: process.env.NEXT_PUBLIC_CORE_API_URL,
};
