import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { motion } from "framer-motion";
import { UserPlus } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";
import { AuthFrame } from "./Login.jsx";

export default function Register() {
  const { register, handleSubmit, reset } = useForm();
  const { register: createAccount, verifyRegistrationOtp } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [pendingEmail, setPendingEmail] = useState("");
  const [message, setMessage] = useState("");

  const onSubmit = async (values) => {
    try {
      setError("");
      setMessage("");
      if (pendingEmail) {
        await verifyRegistrationOtp({ email: pendingEmail, otp: values.otp });
        navigate("/login", { state: { message: "Email verified. Please log in." } });
        return;
      }

      const data = await createAccount(values);
      setPendingEmail(values.email);
      setMessage(data.detail || "Check your email for the verification OTP.");
      reset({ otp: "" });
    } catch (err) {
      setError(formatApiError(err) || "Could not create account. Check your details and try again.");
    }
  };

  return (
    <AuthFrame title="Create your account" subtitle="Start tracking applications with a clean SaaS workflow.">
      <motion.form
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.12 }}
        className="space-y-4"
        onSubmit={handleSubmit(onSubmit)}
      >
        {!pendingEmail ? (
          <>
            <div className="grid gap-3 sm:grid-cols-2">
              <input className="input" placeholder="First name" {...register("first_name")} />
              <input className="input" placeholder="Last name" {...register("last_name")} />
            </div>
            <input className="input" placeholder="Username" {...register("username", { required: true })} />
            <input className="input" placeholder="Email" type="email" {...register("email", { required: true })} />
            <select className="input" defaultValue="USER" {...register("role", { required: true })}>
              <option value="USER">USER</option>
              <option value="RECRUITER">RECRUITER</option>
              <option value="ADMIN">ADMIN</option>
            </select>
            <input className="input" placeholder="Password" type="password" {...register("password", { required: true, minLength: 8 })} />
          </>
        ) : (
          <>
            <p className="rounded-lg bg-mint/10 px-3 py-2 text-sm font-semibold text-mint">{message}</p>
            <input className="input" placeholder="Enter 6-digit OTP" inputMode="numeric" autoComplete="one-time-code" {...register("otp", { required: true, minLength: 6, maxLength: 6 })} />
          </>
        )}
        {error && <p className="text-sm font-semibold text-coral">{error}</p>}
        <button className="btn-primary w-full"><UserPlus size={18} /> {pendingEmail ? "Verify email" : "Create account"}</button>
        <p className="text-center text-sm text-slate-500">Already registered? <Link className="font-bold text-mint" to="/login">Login</Link></p>
      </motion.form>
    </AuthFrame>
  );
}

function formatApiError(err) {
  const data = err?.response?.data;
  if (!data) return "";
  if (typeof data === "string") return data.includes("<html") || data.includes("<!doctype") ? "Server error. Please try again." : data;
  if (Array.isArray(data)) return data.join(" ");
  return Object.entries(data)
    .map(([field, messages]) => `${field}: ${Array.isArray(messages) ? messages.join(" ") : messages}`)
    .join(" ");
}
