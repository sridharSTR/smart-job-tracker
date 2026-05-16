import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="grid min-h-screen place-items-center bg-slate-50 p-5 dark:bg-slate-950">
      <div className="glass max-w-md rounded-xl p-8 text-center">
        <p className="eyebrow">404</p>
        <h1 className="mt-2 text-3xl font-black dark:text-white">Page not found</h1>
        <p className="mt-3 text-sm text-slate-500">This route is not part of the platform.</p>
        <Link className="btn-primary mt-6" to="/">Go home</Link>
      </div>
    </div>
  );
}

