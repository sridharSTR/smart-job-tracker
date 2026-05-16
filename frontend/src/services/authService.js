import api from "../api/client";

export const authService = {
  login: (payload) => api.post("/auth/login/", payload),
  register: (payload) => api.post("/auth/register/", payload),
  verifyRegistrationOtp: (payload) => api.post("/auth/verify-registration-otp/", payload),
  verifyLoginOtp: (payload) => api.post("/auth/verify-login-otp/", payload),
  forgotPassword: (payload) => api.post("/auth/forgot-password/", payload),
  resetPassword: (payload) => api.post("/auth/reset-password/", payload),
  me: () => api.get("/auth/me/")
};

