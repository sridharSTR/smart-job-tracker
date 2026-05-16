import { Link } from "react-router-dom";
import { BriefcaseBusiness } from "lucide-react";
import { motion } from "framer-motion";
import ThemeSwitcher from "../../components/common/ThemeSwitcher";

export default function AuthFrame({ title, subtitle, children }) {
  return (
    <div className="relative grid min-h-screen place-items-center overflow-hidden bg-slate-50 p-4 dark:bg-slate-950">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(53,194,162,0.22),transparent_30%),radial-gradient(circle_at_90%_80%,rgba(59,130,246,0.16),transparent_28%)]" />
      <div className="absolute right-5 top-5"><ThemeSwitcher /></div>
      <motion.div className="glass relative w-full max-w-md rounded-xl p-8" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
        <Link to="/" className="inline-flex items-center gap-2 text-sm font-black text-mint">
          <BriefcaseBusiness size={18} /> Smart Job Tracker
        </Link>
        <h1 className="mt-5 text-3xl font-black text-slate-950 dark:text-white">{title}</h1>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{subtitle}</p>
        <div className="mt-6">{children}</div>
      </motion.div>
    </div>
  );
}

