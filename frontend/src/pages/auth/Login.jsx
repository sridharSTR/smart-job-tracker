import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { LogIn } from "lucide-react";
import AuthFrame from "./AuthFrame";
import { useAuth } from "../../context/AuthContext";
import { roleRedirects } from "../../constants/app";
import { formatApiError } from "../../utils/formatters";

export default function Login() {
  const { register, handleSubmit, reset } = useForm({ defaultValues: { role: "USER" } });
  const { login, verifyLoginOtp } = useAuth();
  const navigate = useNavigate();
  const [pendingEmail, setPendingEmail] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (values) => {
    if (submitting) return;
    try {
      setSubmitting(true);
      setError("");
      if (pendingEmail) {
        const user = await verifyLoginOtp({ email: pendingEmail, otp: values.otp });
        navigate(roleRedirects[user?.role] || "/dashboard", { replace: true });
        return;
      }
      const result = await login(values);
      if (result?.otp_required) {
        setPendingEmail(result.email);
        reset({ role: values.role, otp: "" });
        return;
      }
      navigate(roleRedirects[result?.role] || "/dashboard", { replace: true });
    } catch (err) {
      const fallback = pendingEmail
        ? "Invalid or expired OTP. Please enter the latest 6-digit code."
        : "Login failed. Use your username, choose the correct role, and make sure registration OTP verification is complete.";
      setError(formatApiError(err, fallback));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthFrame title="Welcome back" subtitle="Login with JWT, role routing, and OTP verification.">
      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
        {!pendingEmail ? (
          <>
            <input className="input" placeholder="Username" {...register("username", { required: true })} />
            <p className="-mt-2 text-xs font-semibold text-slate-500">Use your username, not your email address.</p>
            <select className="input" {...register("role", { required: true })}>
              <option value="USER">USER</option>
              <option value="RECRUITER">RECRUITER</option>
              <option value="ADMIN">ADMIN</option>
            </select>
            <input className="input" placeholder="Password" type="password" {...register("password", { required: true })} />
          </>
        ) : (
          <>
            <p className="rounded-lg bg-mint/10 px-3 py-2 text-sm font-bold text-mint">OTP sent to {pendingEmail}. Use the latest email only.</p>
            <input className="input" placeholder="Enter 6-digit OTP" inputMode="numeric" autoComplete="one-time-code" {...register("otp", { required: true, minLength: 6, maxLength: 6 })} />
          </>
        )}
        {error && <p className="text-sm font-bold text-coral">{error}</p>}
        <button className="btn-primary w-full" disabled={submitting}><LogIn size={18} /> {submitting ? "Please wait..." : pendingEmail ? "Verify OTP" : "Login"}</button>
        <div className="flex justify-between text-sm text-slate-500">
          <Link className="font-bold hover:text-mint" to="/register">Create account</Link>
          <Link className="font-bold hover:text-mint" to="/forgot-password">Forgot password?</Link>
        </div>
      </form>
    </AuthFrame>
  );
}
