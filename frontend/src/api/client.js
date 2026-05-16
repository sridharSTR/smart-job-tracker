import axios from "axios";
import toast from "react-hot-toast";

const publicAuthPaths = [
  "/auth/login/",
  "/auth/register/",
  "/auth/verify-registration-otp/",
  "/auth/verify-login-otp/",
  "/auth/refresh/",
  "/auth/forgot-password/",
  "/auth/reset-password/"
];

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api",
  timeout: 20000
});

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const canRetryNetworkRequest = (config = {}) => {
  const method = (config.method || "get").toLowerCase();
  return ["get", "head", "options"].includes(method);
};

api.interceptors.request.use((config) => {
  if (publicAuthPaths.some((path) => config.url?.endsWith(path))) {
    delete config.headers.Authorization;
    return config;
  }

  const token = localStorage.getItem("accessToken");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config || {};
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;
      const refresh = localStorage.getItem("refreshToken");
      if (refresh) {
        try {
          const { data } = await axios.post(`${api.defaults.baseURL}/auth/refresh/`, { refresh });
          localStorage.setItem("accessToken", data.access);
          original.headers = original.headers || {};
          original.headers.Authorization = `Bearer ${data.access}`;
          return api(original);
        } catch {
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          window.dispatchEvent(new Event("auth:logout"));
          toast.error("Session expired. Please login again.");
        }
      }
    }

    if (!error.response && !original._networkRetry && canRetryNetworkRequest(original)) {
      original._networkRetry = true;
      await sleep(650);
      return api(original);
    }

    if (!error.response) toast.error("Network error. Check the server connection.");
    return Promise.reject(error);
  }
);

export default api;
