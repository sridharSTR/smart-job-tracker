import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useSearchParams } from "react-router-dom";
import { Download, Eye } from "lucide-react";
import PageHeader from "../../components/common/PageHeader";
import SearchBar from "../../components/common/SearchBar";
import StatusBadge from "../../components/common/StatusBadge";
import Pagination from "../../components/common/Pagination";
import EmptyState from "../../components/common/EmptyState";
import Modal from "../../components/modals/Modal";
import DataTable from "../../components/tables/DataTable";
import { statuses } from "../../constants/app";
import { recruiterService } from "../../services/recruiterService";
import { formatApiError, pageCount, shortDate, toArray } from "../../utils/formatters";

export default function Applicants() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("search") || "");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selected, setSelected] = useState(null);
  const [rows, setRows] = useState([]);
  const [preview, setPreview] = useState(null);

  const load = useCallback(() => recruiterService.applications({ page, search: query || undefined }).then((res) => {
    const items = toArray(res.data);
    setRows(items);
    setTotalPages(pageCount(res.data, items.length));
  }).catch(() => {
    setRows([]);
    setTotalPages(1);
  }), [page, query]);

  useEffect(() => { load(); }, [load]);
  useEffect(() => { setPage(1); }, [query]);
  useEffect(() => {
    setQuery(searchParams.get("search") || "");
  }, [searchParams]);

  useEffect(() => {
    setPreview(null);
  }, [selected?.id]);

  const handleQuery = (value) => {
    setQuery(value);
    const next = new URLSearchParams(searchParams);
    if (value.trim()) next.set("search", value);
    else next.delete("search");
    setSearchParams(next, { replace: true });
  };

  const updateStatus = async (application, status) => {
    try {
      await recruiterService.updateApplication(application.id, { status });
      toast.success("Candidate status updated.");
      load();
    } catch (err) {
      toast.error(formatApiError(err, "Could not update status."));
    }
  };

  useEffect(() => () => {
    if (preview?.url) window.URL.revokeObjectURL(preview.url);
  }, [preview]);

  const openResume = async (resume, mode = "preview") => {
    try {
      const { data } = await recruiterService.downloadResume(resume.id);
      const blob = new Blob([data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);

      if (mode === "download") {
        const link = document.createElement("a");
        link.href = url;
        link.download = resume.title || "resume.pdf";
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.setTimeout(() => window.URL.revokeObjectURL(url), 1000);
        return;
      }

      if (preview?.url) window.URL.revokeObjectURL(preview.url);
      setPreview({ url, title: resume.title || "Resume preview" });
    } catch (err) {
      toast.error(formatApiError(err, "Could not open resume PDF."));
    }
  };

  return (
    <>
      <PageHeader eyebrow="Recruiter Panel" title="Applicants" description="Search candidates, inspect resumes, track status, and view match percentage." />
      <div className="glass mb-5 rounded-xl p-4"><SearchBar value={query} onChange={handleQuery} placeholder="Search applicants" /></div>
      <DataTable rows={rows} columns={[
        { key: "user", label: "Candidate", render: (row) => row.applicant?.full_name || row.applicant?.username || `Candidate #${row.user}` },
        { key: "role_title", label: "Role" },
        { key: "company_name", label: "Company" },
        { key: "location", label: "Location" },
        { key: "application_date", label: "Applied", render: (row) => shortDate(row.application_date) },
        { key: "status", label: "Status", render: (row) => <StatusBadge status={row.status} /> },
        { key: "actions", label: "Actions", render: (row) => <button className="btn-primary" onClick={() => setSelected(row)}>View profile</button> }
      ]} empty={<EmptyState title="No applicants yet" description="When users apply for jobs, their applications will appear here." />} />
      <div className="mt-5"><Pagination page={page} totalPages={totalPages} onPage={setPage} /></div>
      <Modal open={Boolean(selected)} title="Candidate Profile" onClose={() => { setPreview(null); setSelected(null); }}>
        {selected && (
          <div className="space-y-4 text-sm">
            <div className="grid gap-3 sm:grid-cols-2">
              <p><b>Candidate:</b> {selected.applicant?.full_name || selected.applicant?.username || `#${selected.user}`}</p>
              <p><b>Email:</b> {selected.applicant?.email || "Not shared"}</p>
              <p><b>Status:</b> {selected.status}</p>
              <p><b>Role:</b> {selected.role_title}</p>
              <p><b>Company:</b> {selected.company_name}</p>
              <p><b>Location:</b> {selected.location || "Not set"}</p>
              <p><b>Applied:</b> {shortDate(selected.application_date)}</p>
            </div>
            <div className="grid gap-3 rounded-lg bg-slate-100 p-3 text-slate-600 dark:bg-white/10 dark:text-slate-300 sm:grid-cols-2">
              <p><b>Experience:</b> {selected.applicant?.experience || "Not added"}</p>
              <p><b>Education:</b> {selected.applicant?.education || "Not added"}</p>
              <p className="sm:col-span-2"><b>Bio:</b> {selected.applicant?.bio || "No profile bio added."}</p>
            </div>
            <div>
              <p className="label mb-2">Resumes</p>
              {selected.applicant_resumes?.length ? (
                <div className="space-y-2">
                  {selected.applicant_resumes.map((resume) => (
                    <div className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-slate-200 bg-white p-3 dark:border-white/10 dark:bg-white/5" key={resume.id}>
                      <div>
                        <p className="font-bold text-slate-900 dark:text-white">{resume.title}</p>
                        <p className="text-xs text-slate-500">{resume.is_primary ? "Primary resume" : "Uploaded resume"}</p>
                      </div>
                      <div className="flex gap-2">
                        <button className="btn-soft" type="button" onClick={() => openResume(resume, "preview")}><Eye size={16} /> Preview</button>
                        <button className="btn-primary" type="button" onClick={() => openResume(resume, "download")}><Download size={16} /> Download PDF</button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="rounded-lg border border-dashed border-slate-300 p-3 text-slate-500 dark:border-white/10">No resume uploaded by this applicant yet.</p>
              )}
            </div>
            {preview?.url && (
              <div className="space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="font-bold text-slate-900 dark:text-white">{preview.title}</p>
                  <a className="btn-soft" href={preview.url} target="_blank" rel="noreferrer">Open in new tab</a>
                </div>
                <iframe className="h-[70vh] w-full rounded-lg border border-slate-200 bg-white dark:border-white/10" src={preview.url} title={preview.title} />
              </div>
            )}
            {selected.notes && <p className="rounded-lg bg-slate-100 p-3 text-slate-600 dark:bg-white/10 dark:text-slate-300"><b>Notes:</b> {selected.notes}</p>}
            <label className="block">
              <span className="label mb-2 block">Update candidate status</span>
              <select className="input" value={selected.status} onChange={(event) => updateStatus(selected, event.target.value)}>
                {statuses.map((status) => <option value={status} key={status}>{status}</option>)}
              </select>
            </label>
          </div>
        )}
      </Modal>
    </>
  );
}
