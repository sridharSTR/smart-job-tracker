import { Check } from "lucide-react";
import { statuses } from "../../constants/app";
import { cx } from "../../utils/formatters";

export default function StatusTimeline({ current = "Applied" }) {
  const currentIndex = Math.max(statuses.indexOf(current), 0);
  return (
    <div className="flex min-w-[720px] items-center">
      {statuses.map((status, index) => (
        <div className="flex flex-1 items-center" key={status}>
          <div className={cx("grid h-8 w-8 place-items-center rounded-full text-xs font-black", index <= currentIndex ? "bg-mint text-slate-950" : "bg-slate-200 text-slate-500 dark:bg-slate-800")}>
            {index <= currentIndex ? <Check size={14} /> : index + 1}
          </div>
          <span className="ml-2 whitespace-nowrap text-xs font-bold text-slate-500">{status}</span>
          {index < statuses.length - 1 && <div className={cx("mx-3 h-0.5 flex-1", index < currentIndex ? "bg-mint" : "bg-slate-200 dark:bg-slate-800")} />}
        </div>
      ))}
    </div>
  );
}
