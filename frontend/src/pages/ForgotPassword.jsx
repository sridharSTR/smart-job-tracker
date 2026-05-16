import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { motion } from "framer-motion";
import { MailCheck } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";
import { AuthFrame } from "./Login.jsx";

export default function ForgotPassword() {
  const { register, handleSubmit } = useForm();
  const { forgotPassword } = useAuth();
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const onSubmit = async (values) => {
    setError("");
    setMessage("");
    try {
      const data = await forgotPassword(values);
      setMessage(data.detail || "Password reset link sent.");
    } catch {
      setError("Could not send reset link. Please try again.");
    }
  };

  return (
    <AuthFrame title="Reset access" subtitle="Enter your registered email and we will send a secure reset link.">
      <motion.form initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
        <input className="input" placeholder="Registered email" type="email" {...register("email", { required: true })} />
        {message && <p className="rounded-lg bg-mint/10 px-3 py-2 text-sm font-semibold text-mint">{message}</p>}
        {error && <p className="text-sm font-semibold text-coral">{error}</p>}
        <button className="btn-primary w-full"><MailCheck size={18} /> Send reset link</button>
        <p className="text-center text-sm text-slate-500"><Link className="font-bold text-mint" to="/login">Back to login</Link></p>
      </motion.form>
    </AuthFrame>
  );
}
