import { Link, useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useState } from "react";
import AuthFrame from "./AuthFrame";
import { useAuth } from "../../context/AuthContext";
import { formatApiError } from "../../utils/formatters";

export default function ResetPassword() {
  const { uid, token } = useParams();
  const navigate = useNavigate();
  const { resetPassword } = useAuth();
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const [error, setError] = useState("");
  const password = watch("new_password", "");
  const strength = Math.min(100, password.length * 10 + (/[A-Z]/.test(password) ? 15 : 0) + (/[0-9]/.test(password) ? 15 : 0));

  const onSubmit = async (values) => {
    try {
      await resetPassword({ ...values, uid: uid || values.uid, token: token || values.token });
      navigate("/login", { replace: true, state: { message: "Password updated." } });
    } catch (err) {
      setError(formatApiError(err));
    }
  };

  return (
    <AuthFrame title="Set new password" subtitle="Use a strong password with letters and numbers.">
      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
        {!uid && <input className="input" placeholder="Reset UID from email link" {...register("uid", { required: true })} />}
        {!token && <input className="input" placeholder="Reset token from email link" {...register("token", { required: true })} />}
        <input className="input" placeholder="New password" type="password" {...register("new_password", { required: true, minLength: 8 })} />
        <div className="h-2 rounded-full bg-slate-200 dark:bg-slate-800"><div className="h-2 rounded-full bg-mint" style={{ width: `${strength}%` }} /></div>
        <input className="input" placeholder="Confirm password" type="password" {...register("confirm_password", { validate: (value) => value === password || "Passwords do not match." })} />
        {errors.confirm_password && <p className="text-sm font-bold text-coral">{errors.confirm_password.message}</p>}
        {error && <p className="text-sm font-bold text-coral">{error}</p>}
        <button className="btn-primary w-full">Update password</button>
        <p className="text-center text-sm text-slate-500"><Link className="font-bold text-mint" to="/login">Back to login</Link></p>
      </form>
    </AuthFrame>
  );
}
