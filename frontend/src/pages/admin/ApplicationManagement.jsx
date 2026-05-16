import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import PageHeader from "../../components/common/PageHeader";
import StatusBadge from "../../components/common/StatusBadge";
import DataTable from "../../components/tables/DataTable";
import EmptyState from "../../components/common/EmptyState";
import SearchBar from "../../components/common/SearchBar";
import { statuses } from "../../constants/app";
import { adminService } from "../../services/adminService";
import { formatApiError, shortDate, toArray } from "../../utils/formatters";

export default function ApplicationManagement() {
  const [apps, setApps] = useState([]);
  const [query, setQuery] = useState("");
  const load = () => adminService.applications().then((res) => setApps(toArray(res.data))).catch(() => setApps([]));
  useEffect(() => { load(); }, []);
  const rows = apps.filter((app) => `${app.applicant?.full_name || ""} ${app.applicant?.email || ""} ${app.role_title} ${app.company_name}`.toLowerCase().includes(query.toLowerCase()));
  const updateStatus = async (app, status) => {
    try {
      await adminService.updateApplication(app.id, { status });
      toast.success("Application status updated.");
      load();
    } catch (err) {
      toast.error(formatApiError(err));
    }
  };
  return (
    <>
      <PageHeader eyebrow="Admin Panel" title="Application Management" description="Track statuses, inspect analytics overview, and filter applications across the platform." />
      <div className="glass mb-5 rounded-xl p-4"><SearchBar value={query} onChange={setQuery} placeholder="Search applications" /></div>
      <DataTable rows={rows} empty={<EmptyState title="No applications found" />} columns={[
        { key: "candidate", label: "Candidate", render: (row) => row.applicant?.full_name || row.applicant?.username || `Candidate #${row.user}` },
        { key: "role_title", label: "Role" },
        { key: "company_name", label: "Company" },
        { key: "source_job", label: "Source", render: (row) => row.source_job ? `Job #${row.source_job.id}` : "Manual" },
        { key: "status", label: "Status", render: (row) => <StatusBadge status={row.status} /> },
        { key: "application_date", label: "Applied", render: (row) => shortDate(row.application_date) },
        { key: "actions", label: "Update", render: (row) => <select className="input min-w-36" value={row.status} onChange={(event) => updateStatus(row, event.target.value)}>{statuses.map((status) => <option key={status} value={status}>{status}</option>)}</select> }
      ]} />
    </>
  );
}
