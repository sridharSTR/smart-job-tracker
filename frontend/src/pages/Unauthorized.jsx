import { Link } from "react-router-dom";

export default function Unauthorized() {
  return (
    <div className="grid min-h-screen place-items-center bg-slate-50 p-5 dark:bg-slate-950">
      <div className="glass max-w-md rounded-xl p-8 text-center">
        <p className="eyebrow">403</p>
        <h1 className="mt-2 text-3xl font-black dark:text-white">Unauthorized</h1>
        <p className="mt-3 text-sm text-slate-500">Your current role cannot access this workspace.</p>
        <Link className="btn-primary mt-6" to="/dashboard">Back to dashboard</Link>
      </div>
    </div>
  );
}

