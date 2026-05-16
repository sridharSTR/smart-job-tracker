import { cx } from "../../utils/formatters";

const tone = {
  Applied: "bg-sky-100 text-sky-700 dark:bg-sky-500/15 dark:text-sky-200",
  OA: "bg-violet-100 text-violet-700 dark:bg-violet-500/15 dark:text-violet-200",
  Shortlisted: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-200",
  Interview: "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-200",
  "HR Round": "bg-orange-100 text-orange-700 dark:bg-orange-500/15 dark:text-orange-200",
  Rejected: "bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-200",
  Offer: "bg-mint/15 text-emerald-700 dark:text-emerald-200"
};

export default function StatusBadge({ status = "Applied" }) {
  return <span className={cx("rounded-full px-3 py-1 text-xs font-bold", tone[status] || tone.Applied)}>{status}</span>;
}

