import { motion } from "framer-motion";

export default function DashboardCard({ title, value, icon: Icon, caption, trend }) {
  return (
    <motion.div whileHover={{ y: -4 }} className="glass rounded-xl p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">{title}</p>
          <h3 className="mt-2 text-3xl font-black text-slate-950 dark:text-white">{value}</h3>
        </div>
        {Icon && (
          <div className="grid h-11 w-11 place-items-center rounded-lg bg-mint/15 text-mint">
            <Icon size={22} />
          </div>
        )}
      </div>
      <div className="mt-4 flex items-center justify-between text-sm">
        <span className="text-slate-500 dark:text-slate-400">{caption}</span>
        {trend && <span className="font-bold text-emerald-600 dark:text-emerald-300">{trend}</span>}
      </div>
    </motion.div>
  );
}

