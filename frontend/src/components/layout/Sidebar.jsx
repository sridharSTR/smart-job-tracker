import { NavLink } from "react-router-dom";
import { X } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import { cx } from "../../utils/formatters";
import { navByRole } from "./navigation";

export default function Sidebar({ open, onClose }) {
  const { user } = useAuth();
  const role = user?.role || "USER";
  const items = navByRole[role] || navByRole.USER;

  return (
    <>
      <div className={cx("fixed inset-0 z-30 bg-slate-950/40 backdrop-blur-sm lg:hidden", open ? "block" : "hidden")} onClick={onClose} />
      <motion.aside
        initial={false}
        animate={{ x: open ? 0 : -320 }}
        className="fixed inset-y-0 left-0 z-40 flex w-72 flex-col overflow-hidden border-r border-white/60 bg-white/95 p-4 shadow-2xl backdrop-blur-2xl dark:border-white/10 dark:bg-slate-950/95 lg:sticky lg:top-0 lg:z-auto lg:h-screen lg:!translate-x-0"
      >
        <div className="shrink-0 flex items-center justify-between">
          <NavLink to="/" className="flex items-center gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-xl bg-slate-950 text-white dark:bg-mint dark:text-slate-950">SJ</div>
            <div>
              <p className="text-sm font-black uppercase tracking-wide text-slate-950 dark:text-white">Smart Job</p>
              <p className="text-xs text-slate-500">Tracker SaaS</p>
            </div>
          </NavLink>
          <button className="icon-btn lg:hidden" onClick={onClose}><X size={18} /></button>
        </div>

        <nav className="mt-8 min-h-0 flex-1 space-y-1 overflow-y-auto pr-1">
          {items.map(({ to, label, icon: Icon }) => (
            <NavLink
              className={({ isActive }) =>
                cx(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-bold transition",
                  isActive ? "bg-slate-950 text-white shadow-glow dark:bg-mint dark:text-slate-950" : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-white/10"
                )
              }
              key={to}
              onClick={onClose}
              to={to}
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="mt-4 shrink-0 rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-white/10 dark:bg-white/5">
          <p className="text-xs font-bold uppercase text-slate-500">Workspace</p>
          <p className="mt-1 text-sm font-black text-slate-950 dark:text-white">{role} Panel</p>
          <p className="mt-2 text-xs text-slate-500">Role-scoped navigation and protected views are active.</p>
        </div>
      </motion.aside>
    </>
  );
}
