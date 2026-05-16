import { Link, useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { motion } from "framer-motion";
import { KeyRound } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";
import { AuthFrame } from "./Login.jsx";

export default function ResetPassword() {
  const { uid, token } = useParams();
  const navigate = useNavigate();
  const { resetPassword } = useAuth();
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const password = watch("new_password");

  const onSubmit = async (values) => {
    setError("");
    setMessage("");
    try {
      const data = await resetPassword({ uid, token, ...values });
      setMessage(data.detail || "Password updated successfully.");
      setTimeout(() => navigate("/login", { state: { message: "Password updated. Please log in." } }), 900);
    } catch (err) {
      setError(formatApiError(err) || "Could not reset password. The link may be invalid or expired.");
    }
  };

  return (
    <AuthFrame title="Create new password" subtitle="Choose a strong password to restore your account access.">
      <motion.form initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
        <input
          className="input"
          placeholder="New password"
          type="password"
          {...register("new_password", { required: true, minLength: 8 })}
        />
        {errors.new_password && <p className="text-sm font-semibold text-coral">Password must be at least 8 characters.</p>}
        <input
          className="input"
          placeholder="Confirm password"
          type="password"
          {...register("confirm_password", {
            required: true,
            validate: (value) => value === password || "Passwords do not match."
          })}
        />
        {errors.confirm_password && <p className="text-sm font-semibold text-coral">{errors.confirm_password.message}</p>}
        {message && <p className="rounded-lg bg-mint/10 px-3 py-2 text-sm font-semibold text-mint">{message}</p>}
        {error && <p className="text-sm font-semibold text-coral">{error}</p>}
        <button className="btn-primary w-full"><KeyRound size={18} /> Update password</button>
        <p className="text-center text-sm text-slate-500"><Link className="font-bold text-mint" to="/login">Back to login</Link></p>
      </motion.form>
    </AuthFrame>
  );
}

function formatApiError(err) {
  const data = err?.response?.data;
  if (!data) return "";
  if (typeof data === "string") return data;
  if (Array.isArray(data)) return data.join(" ");
  return Object.values(data)
    .map((messages) => (Array.isArray(messages) ? messages.join(" ") : messages))
    .join(" ");
}
