import Modal from "./Modal";

export default function ConfirmDialog({ open, title, description, onCancel, onConfirm }) {
  return (
    <Modal open={open} title={title} onClose={onCancel}>
      <p className="text-sm text-slate-500 dark:text-slate-400">{description}</p>
      <div className="mt-6 flex justify-end gap-2">
        <button className="btn-soft" onClick={onCancel}>Cancel</button>
        <button className="btn-danger" onClick={onConfirm}>Confirm</button>
      </div>
    </Modal>
  );
}

