import { Link } from "react-router-dom";
import AuthFrame from "./AuthFrame";

export default function VerifyEmail() {
  return (
    <AuthFrame title="Check your email" subtitle="Open the secure link or enter the OTP shown after registration/login.">
      <div className="rounded-lg bg-mint/10 p-4 text-sm font-bold text-mint">Verification emails are handled by your existing Django auth APIs.</div>
      <Link className="btn-primary mt-5 w-full" to="/login">Back to login</Link>
    </AuthFrame>
  );
}
