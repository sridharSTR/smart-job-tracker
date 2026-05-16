import { Inbox } from "lucide-react";

export default function EmptyState({ title = "Nothing here yet", description = "Data will appear here as soon as it is available.", action }) {
  return (
    <div className="glass grid place-items-center rounded-xl px-6 py-16 text-center">
      <div className="grid h-16 w-16 place-items-center rounded-full bg-mint/15 text-mint">
        <Inbox size={28} />
      </div>
      <h3 className="mt-5 text-xl font-black text-slate-950 dark:text-white">{title}</h3>
      <p className="mt-2 max-w-md text-sm text-slate-500 dark:text-slate-400">{description}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

