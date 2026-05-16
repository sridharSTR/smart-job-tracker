import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import PageHeader from "../../components/common/PageHeader";
import SearchBar from "../../components/common/SearchBar";
import DataTable from "../../components/tables/DataTable";
import EmptyState from "../../components/common/EmptyState";
import { adminService } from "../../services/adminService";
import { formatApiError, toArray } from "../../utils/formatters";

export default function JobManagement() {
  const [jobs, setJobs] = useState([]);
  const [query, setQuery] = useState("");
  const load = () => adminService.jobs().then((res) => setJobs(toArray(res.data))).catch(() => setJobs([]));
  useEffect(() => { load(); }, []);
  const rows = jobs.filter((job) => `${job.title} ${job.company}`.toLowerCase().includes(query.toLowerCase()));
  const setActive = async (job, isActive) => {
    try {
      await adminService.updateJob(job.id, { is_active: isActive });
      toast.success(isActive ? "Job approved and opened." : "Job rejected and closed.");
      load();
    } catch (err) {
      toast.error(formatApiError(err));
    }
  };
  return (
    <>
      <PageHeader eyebrow="Admin Panel" title="Job Management" description="View all jobs, approve, reject, delete, search, and moderate job posts." />
      <div className="glass mb-5 rounded-xl p-4"><SearchBar value={query} onChange={setQuery} placeholder="Search jobs" /></div>
      <DataTable rows={rows} empty={<EmptyState title="No jobs found" />} columns={[
        { key: "title", label: "Role" }, { key: "company", label: "Company" }, { key: "recruiter_name", label: "Recruiter" }, { key: "location", label: "Location" }, { key: "is_active", label: "Status", render: (row) => row.is_active ? "Active" : "Closed" }, { key: "actions", label: "Moderation", render: (row) => <div className="flex gap-2"><button className="btn-soft" onClick={() => setActive(row, true)}>Approve</button><button className="btn-danger" onClick={() => setActive(row, false)}>Reject</button></div> }
      ]} />
    </>
  );
}
