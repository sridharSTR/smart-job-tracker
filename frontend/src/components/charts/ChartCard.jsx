export default function ChartCard({ title, children }) {
  return (
    <section className="glass rounded-xl p-5">
      <h3 className="mb-4 text-base font-black text-slate-950 dark:text-white">{title}</h3>
      <div className="h-72">{children}</div>
    </section>
  );
}

