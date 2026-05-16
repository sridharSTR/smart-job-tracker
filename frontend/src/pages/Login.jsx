import { Link, useLocation, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { motion } from "framer-motion";
import { LockKeyhole, LogIn } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";

const roleRedirects = {
  USER: "/dashboard",
  RECRUITER: "/recruiter/dashboard",
  ADMIN: "/admin/dashboard"
};

export default function Login() {
  const { register, handleSubmit, reset } = useForm({ defaultValues: { role: "USER" } });
  const { login, verifyLoginOtp } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [pendingEmail, setPendingEmail] = useState("");

  const onSubmit = async (values) => {
    try {
      setError("");
      if (pendingEmail) {
        const user = await verifyLoginOtp({ email: pendingEmail, otp: values.otp });
        navigate(roleRedirects[user?.role] || "/dashboard");
        return;
      }

      const result = await login(values);
      if (result?.otp_required) {
        setPendingEmail(result.email);
        reset({ role: values.role, otp: "" });
        return;
      }

      const user = result;
      navigate(roleRedirects[user?.role] || "/dashboard");
    } catch (err) {
      setError(formatAuthError(err) || "Invalid username, password, role, or OTP.");
    }
  };

  return (
    <AuthFrame title="Welcome back" subtitle="Login to continue your career pipeline.">
      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
        {!pendingEmail ? (
          <>
            <input className="input" placeholder="Username" {...register("username", { required: true })} />
            <select className="input" {...register("role", { required: true })}>
              <option value="USER">USER</option>
              <option value="RECRUITER">RECRUITER</option>
              <option value="ADMIN">ADMIN</option>
            </select>
            <input className="input" placeholder="Password" type="password" {...register("password", { required: true })} />
          </>
        ) : (
          <>
            <p className="rounded-lg bg-mint/10 px-3 py-2 text-sm font-semibold text-mint">OTP sent to {pendingEmail}</p>
            <input className="input" placeholder="Enter 6-digit OTP" inputMode="numeric" autoComplete="one-time-code" {...register("otp", { required: true, minLength: 6, maxLength: 6 })} />
          </>
        )}
        {location.state?.message && <p className="rounded-lg bg-mint/10 px-3 py-2 text-sm font-semibold text-mint">{location.state.message}</p>}
        {error && <p className="text-sm font-semibold text-coral">{error}</p>}
        <button className="btn-primary w-full"><LogIn size={18} /> {pendingEmail ? "Verify OTP" : "Login"}</button>
        <div className="flex justify-between text-sm text-slate-500">
          <Link className="font-semibold hover:text-mint" to="/register">Create account</Link>
          <Link className="font-semibold hover:text-mint" to="/forgot-password">Forgot password?</Link>
        </div>
      </form>
    </AuthFrame>
  );
}

function AuthFrame({ title, subtitle, children }) {
  return (
    <div className="relative grid min-h-screen place-items-center overflow-hidden bg-[#edf7f4] p-4 dark:bg-slate-950">
      <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(53,194,162,0.18),transparent_42%,rgba(20,33,61,0.08)),linear-gradient(rgba(20,33,61,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(20,33,61,0.05)_1px,transparent_1px)] bg-[size:auto,32px_32px,32px_32px]" />
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
        className="glass relative w-full max-w-md rounded-xl p-8"
      >
        <Link to="/" className="inline-flex items-center gap-2 text-sm font-black text-mint">
          <LockKeyhole size={18} /> Smart Job Tracker
        </Link>
        <h1 className="mt-4 text-3xl font-black dark:text-white">{title}</h1>
        <p className="mt-2 text-sm text-slate-500">{subtitle}</p>
        <div className="mt-6">{children}</div>
      </motion.div>
    </div>
  );
}

export { AuthFrame };

function formatAuthError(err) {
  const data = err?.response?.data;
  if (!data) return "";
  if (typeof data === "string") return data.includes("<html") || data.includes("<!doctype") ? "Server error. Please try again." : data;
  if (Array.isArray(data)) return data.join(" ");
  if (data.non_field_errors) return data.non_field_errors.join(" ");
  if (data.detail) return data.detail;
  return Object.values(data)
    .map((messages) => (Array.isArray(messages) ? messages.join(" ") : messages))
    .join(" ");
}
