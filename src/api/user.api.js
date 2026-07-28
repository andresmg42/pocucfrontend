import axios from "axios";
import useAuthStore from "../stores/use-auth-store";

export const BASE_URL =
  import.meta.env.VITE_BASE_URL || "http://localhost:8000/";

const api = axios.create({ baseURL: BASE_URL });

api.interceptors.request.use(
  async (config) => {
    const { token } = useAuthStore.getState();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

export default api;
