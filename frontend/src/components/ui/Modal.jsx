import { X } from "lucide-react";

export default function Modal({ title, children, onClose }) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/50 p-4">
      <div className="glass w-full max-w-lg rounded-lg p-5">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-black">{title}</h2>
          <button className="btn-soft !px-3" onClick={onClose} aria-label="Close modal">
            <X size={16} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
