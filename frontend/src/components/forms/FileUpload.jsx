import { UploadCloud } from "lucide-react";

export default function FileUpload({ onChange, label = "Upload PDF resume" }) {
  return (
    <label className="glass flex cursor-pointer flex-col items-center justify-center rounded-xl border-dashed p-8 text-center transition hover:-translate-y-0.5">
      <UploadCloud className="text-mint" size={34} />
      <span className="mt-3 text-sm font-bold text-slate-800 dark:text-slate-100">{label}</span>
      <span className="mt-1 text-xs text-slate-500">Drag-and-drop style area. PDF files work best.</span>
      <input className="sr-only" type="file" accept=".pdf,.doc,.docx" onChange={(event) => onChange(event.target.files?.[0])} />
    </label>
  );
}

