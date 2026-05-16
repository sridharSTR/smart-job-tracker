import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { UserPlus } from "lucide-react";
import AuthFrame from "./AuthFrame";
import { useAuth } from "../../context/AuthContext";
import { formatApiError } from "../../utils/formatters";

export default function Register() {
  const { register, handleSubmit, reset } = useForm({ defaultValues: { role: "USER" } });
  const { register: createAccount, verifyRegistrationOtp } = useAuth();
  const navigate = useNavigate();
  const [pendingEmail, setPendingEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (values) => {
    if (submitting) return;
    try {
      setSubmitting(true);
      setError("");
      if (pendingEmail) {
        await verifyRegistrationOtp({ email: pendingEmail, otp: values.otp });
        navigate("/login", { state: { message: "Email verified. Please login." } });
        return;
      }
      const data = await createAccount(values);
      setPendingEmail(data.email || values.email);
      setMessage(data.detail || `OTP sent to ${values.email}.`);
      reset({ otp: "" });
    } catch (err) {
      setError(formatApiError(err, "Could not create account."));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthFrame title="Create your account" subtitle="Register as a job seeker, recruiter, or admin demo account.">
      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
        {!pendingEmail ? (
          <>
            <div className="grid gap-3 sm:grid-cols-2">
              <input className="input" placeholder="First name" {...register("first_name")} />
              <input className="input" placeholder="Last name" {...register("last_name")} />
            </div>
            <input className="input" placeholder="Username" {...register("username", { required: true })} />
            <input className="input" placeholder="Email" type="email" {...register("email", { required: true })} />
            <select className="input" {...register("role", { required: true })}>
              <option value="USER">USER</option>
              <option value="RECRUITER">RECRUITER</option>
              <option value="ADMIN">ADMIN</option>
            </select>
            <input className="input" placeholder="Password" type="password" {...register("password", { required: true, minLength: 8 })} />
          </>
        ) : (
          <>
            <p className="rounded-lg bg-mint/10 px-3 py-2 text-sm font-bold text-mint">{message} Use the latest email only and verify this OTP before opening the login page.</p>
            <input className="input" placeholder="Enter 6-digit OTP" inputMode="numeric" autoComplete="one-time-code" {...register("otp", { required: true, minLength: 6, maxLength: 6 })} />
          </>
        )}
        {error && <p className="text-sm font-bold text-coral">{error}</p>}
        <button className="btn-primary w-full" disabled={submitting}><UserPlus size={18} /> {submitting ? "Please wait..." : pendingEmail ? "Verify email" : "Create account"}</button>
        <p className="text-center text-sm text-slate-500">Already registered? <Link className="font-bold text-mint" to="/login">Login</Link></p>
      </form>
    </AuthFrame>
  );
}
