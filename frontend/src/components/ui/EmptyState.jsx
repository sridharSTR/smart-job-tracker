export default function EmptyState({ title, description, action }) {
  return (
    <div className="glass rounded-lg px-6 py-12 text-center">
      <h3 className="text-lg font-black">{title}</h3>
      <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">{description}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
