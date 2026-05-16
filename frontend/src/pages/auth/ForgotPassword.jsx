import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useState } from "react";
import AuthFrame from "./AuthFrame";
import { useAuth } from "../../context/AuthContext";
import { formatApiError } from "../../utils/formatters";

export default function ForgotPassword() {
  const { register, handleSubmit } = useForm();
  const { forgotPassword } = useAuth();
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const onSubmit = async (values) => {
    try {
      const { detail } = await forgotPassword(values);
      setMessage(detail);
      setError("");
    } catch (err) {
      setError(formatApiError(err));
    }
  };

  return (
    <AuthFrame title="Reset access" subtitle="Enter your registered email and follow the secure reset link.">
      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
        <input className="input" placeholder="Registered email" type="email" {...register("email", { required: true })} />
        {message && <p className="rounded-lg bg-mint/10 px-3 py-2 text-sm font-bold text-mint">{message}</p>}
        {error && <p className="text-sm font-bold text-coral">{error}</p>}
        <button className="btn-primary w-full">Send reset link</button>
        <p className="text-center text-sm text-slate-500"><Link className="font-bold text-mint" to="/login">Back to login</Link></p>
      </form>
    </AuthFrame>
  );
}

