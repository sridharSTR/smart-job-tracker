import { motion } from "framer-motion";

export default function DataTable({ columns, rows, empty }) {
  if (!rows.length) return empty;

  return (
    <div className="glass overflow-hidden rounded-xl">
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-slate-950 text-white dark:bg-slate-800">
            <tr>{columns.map((column) => <th className="whitespace-nowrap px-4 py-3 font-bold" key={column.key}>{column.label}</th>)}</tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
            {rows.map((row, index) => (
              <motion.tr initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.025 }} key={row.id || index}>
                {columns.map((column) => <td className="whitespace-nowrap px-4 py-3 text-slate-700 dark:text-slate-200" key={column.key}>{column.render ? column.render(row) : row[column.key]}</td>)}
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

