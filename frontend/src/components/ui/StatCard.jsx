import { motion } from "framer-motion";

export default function StatCard({ label, value, icon: Icon, tone = "bg-mint/15 text-emerald-700" }) {
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-lg p-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{label}</p>
          <p className="mt-2 text-3xl font-black">{value ?? 0}</p>
        </div>
        {Icon && (
          <div className={`grid h-12 w-12 place-items-center rounded-lg ${tone}`}>
            <Icon size={22} />
          </div>
        )}
      </div>
    </motion.div>
  );
}
