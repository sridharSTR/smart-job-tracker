import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useSearchParams } from "react-router-dom";
import { Trash2 } from "lucide-react";
import PageHeader from "../../components/common/PageHeader";
import SearchBar from "../../components/common/SearchBar";
import EmptyState from "../../components/common/EmptyState";
import DataTable from "../../components/tables/DataTable";
import Pagination from "../../components/common/Pagination";
import { recruiterService } from "../../services/recruiterService";
import { formatApiError, pageCount, shortDate, toArray } from "../../utils/formatters";

export default function ManageJobs() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [jobs, setJobs] = useState([]);
  const [query, setQuery] = useState(searchParams.get("search") || "");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const load = useCallback(() => recruiterService.jobs({ page, search: query || undefined }).then((res) => {
    const items = toArray(res.data);
    setJobs(items);
    setTotalPages(pageCount(res.data, items.length));
  }).catch(() => setJobs([])), [page, query]);
  useEffect(() => { load(); }, [load]);
  useEffect(() => { setPage(1); }, [query]);
  const rows = jobs.filter((job) => `${job.title} ${job.company}`.toLowerCase().includes(query.toLowerCase()));

  useEffect(() => {
    setQuery(searchParams.get("search") || "");
  }, [searchParams]);

  const handleQuery = (value) => {
    setQuery(value);
    const next = new URLSearchParams(searchParams);
    if (value.trim()) next.set("search", value);
    else next.delete("search");
    setSearchParams(next, { replace: true });
  };

  const toggle = async (job) => {
    try {
      await recruiterService.updateJob(job.id, { is_active: !job.is_active });
      toast.success(job.is_active ? "Job closed." : "Job opened.");
      load();
    } catch (err) {
      toast.error(formatApiError(err));
    }
  };

  const deleteJob = async (job) => {
    if (!window.confirm(`Delete ${job.title} at ${job.company}?`)) return;
    try {
      await recruiterService.deleteJob(job.id);
      toast.success("Job deleted.");
      load();
    } catch (err) {
      toast.error(formatApiError(err, "Could not delete job."));
    }
  };

  return (
    <>
      <PageHeader eyebrow="Recruiter Panel" title="Manage Jobs" description="Edit, close, delete, search, filter, and bulk-manage posted jobs." />
      <div className="glass mb-5 rounded-xl p-4"><SearchBar value={query} onChange={handleQuery} placeholder="Search jobs" /></div>
      <DataTable rows={rows} empty={<EmptyState title="No jobs posted" />} columns={[
        { key: "title", label: "Role" },
        { key: "company", label: "Company" },
        { key: "location", label: "Location" },
        { key: "created_at", label: "Posted", render: (row) => shortDate(row.created_at) },
        { key: "is_active", label: "Status", render: (row) => row.is_active ? "Open" : "Closed" },
        { key: "actions", label: "Actions", render: (row) => <div className="flex flex-wrap gap-2"><button className="btn-soft" onClick={() => toggle(row)}>{row.is_active ? "Close" : "Open"}</button><button className="btn-danger" onClick={() => deleteJob(row)}><Trash2 size={16} /> Delete</button></div> }
      ]} />
      <div className="mt-5"><Pagination page={page} totalPages={totalPages} onPage={setPage} /></div>
    </>
  );
}
