import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { roleRedirects } from "../constants/app";
import { authService } from "../services/authService";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const logout = useCallback(() => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    setUser(null);
  }, []);

  useEffect(() => {
    const boot = async () => {
      if (!localStorage.getItem("accessToken")) {
        setLoading(false);
        return;
      }
      try {
        const { data } = await authService.me();
        setUser(data);
      } catch {
        logout();
      } finally {
        setLoading(false);
      }
    };

    boot();
    window.addEventListener("auth:logout", logout);
    return () => window.removeEventListener("auth:logout", logout);
  }, [logout]);

  const persistSession = useCallback(async (data) => {
    localStorage.setItem("accessToken", data.access);
    localStorage.setItem("refreshToken", data.refresh);
    const authenticatedUser = data.user || (await authService.me()).data;
    setUser(authenticatedUser);
    return authenticatedUser;
  }, []);

  const value = useMemo(
    () => ({
      user,
      loading,
      roleRedirects,
      isAdmin: user?.role === "ADMIN",
      isRecruiter: user?.role === "RECRUITER" || user?.role === "ADMIN",
      isStaffUser: user?.role === "ADMIN" || user?.role === "RECRUITER",
      async login(credentials) {
        const { data } = await authService.login(credentials);
        if (data.otp_required) return data;
        const authenticatedUser = await persistSession(data);
        toast.success("Welcome back.");
        return authenticatedUser;
      },
      async verifyLoginOtp(payload) {
        const { data } = await authService.verifyLoginOtp(payload);
        const authenticatedUser = await persistSession(data);
        toast.success("Login verified.");
        return authenticatedUser;
      },
      async verifyRegistrationOtp(payload) {
        const { data } = await authService.verifyRegistrationOtp(payload);
        toast.success("Email verified. Please login.");
        return data;
      },
      async register(payload) {
        const { data } = await authService.register(payload);
        toast.success("OTP sent to your email.");
        return data;
      },
      async forgotPassword(payload) {
        const { data } = await authService.forgotPassword(payload);
        toast.success("Reset email sent.");
        return data;
      },
      async resetPassword(payload) {
        const { data } = await authService.resetPassword(payload);
        toast.success("Password updated.");
        return data;
      },
      logout,
      setUser
    }),
    [loading, logout, persistSession, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
