export default function Pagination({ page, totalPages, onPage }) {
  return (
    <div className="flex items-center justify-end gap-2">
      <button className="btn-soft" disabled={page <= 1} onClick={() => onPage(page - 1)}>Previous</button>
      <span className="text-sm font-semibold text-slate-500">Page {page} of {totalPages}</span>
      <button className="btn-soft" disabled={page >= totalPages} onClick={() => onPage(page + 1)}>Next</button>
    </div>
  );
}

