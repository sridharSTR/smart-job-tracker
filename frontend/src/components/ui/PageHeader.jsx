export default function PageHeader({ title, eyebrow, action }) {
  return (
    <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
      <div>
        {eyebrow && <p className="text-sm font-bold uppercase tracking-wide text-mint">{eyebrow}</p>}
        <h1 className="mt-1 text-3xl font-black tracking-tight">{title}</h1>
      </div>
      {action}
    </div>
  );
}
