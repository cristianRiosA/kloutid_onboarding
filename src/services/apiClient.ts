import axios from "axios";
import { getAuthToken } from "@/services/firebase/auth";

export const API_URL = process.env.NEXT_PUBLIC_API_URL?.replace(/\/+$/, "");
console.log("🔹 API_URL Configurada:", API_URL);
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use(
  async (config) => {
    const token = await getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error("🔴 Error en interceptor:", error);
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error);
    return Promise.reject(error);
  }
);

export default apiClient;
