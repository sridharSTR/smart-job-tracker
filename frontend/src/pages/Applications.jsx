import { Download, Edit, Plus, Search, Trash2 } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import EmptyState from "../components/ui/EmptyState.jsx";
import PageHeader from "../components/ui/PageHeader.jsx";
import api from "../services/api.js";

export default function Applications() {
  const [apps, setApps] = useState([]);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("");

  const load = useCallback(() => {
    api.get("/applications/", { params: { search: query, status } }).then((res) => setApps(res.data.results || res.data)).catch(() => setApps(sampleApplications));
  }, [query, status]);

  useEffect(() => {
    load();
  }, [load]);

  const remove = async (id) => {
    await api.delete(`/applications/${id}/`);
    setApps((items) => items.filter((item) => item.id !== id));
  };

  const exportCsv = async () => {
    const { data } = await api.get("/applications/export_csv/", { responseType: "blob" });
    const url = URL.createObjectURL(data);
    const link = document.createElement("a");
    link.href = url;
    link.download = "applications.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <PageHeader
        title="Applications"
        eyebrow="Pipeline"
        action={<Link className="btn-primary" to="/applications/new"><Plus size={17} /> Add application</Link>}
      />
      <div className="glass mb-5 grid gap-3 rounded-lg p-4 md:grid-cols-[1fr_220px_auto]">
        <div className="flex items-center gap-2">
          <Search size={17} className="text-slate-400" />
          <input className="input" placeholder="Search company, role, notes" value={query} onChange={(e) => setQuery(e.target.value)} />
        </div>
        <select className="input" value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="">All statuses</option>
          {statuses.map((item) => <option key={item}>{item}</option>)}
        </select>
        <button className="btn-soft" onClick={load}>Filter</button>
      </div>

      {apps.length === 0 ? (
        <EmptyState title="No applications yet" description="Add your first job application and begin tracking follow-ups, interviews, offers, and outcomes." action={<Link className="btn-primary" to="/applications/new">Add application</Link>} />
      ) : (
        <div className="glass overflow-hidden rounded-lg">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[820px] text-left text-sm">
              <thead className="bg-slate-100 text-xs uppercase text-slate-500 dark:bg-slate-900">
                <tr>
                  <th className="px-4 py-3">Company</th>
                  <th className="px-4 py-3">Role</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Location</th>
                  <th className="px-4 py-3">Applied</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {apps.map((app) => (
                  <tr key={app.id}>
                    <td className="px-4 py-4 font-bold">{app.company_name}</td>
                    <td className="px-4 py-4">{app.role_title}</td>
                    <td className="px-4 py-4"><span className="rounded-lg bg-mint/15 px-3 py-1 font-bold text-emerald-700">{app.status}</span></td>
                    <td className="px-4 py-4">{app.location || "Remote"}</td>
                    <td className="px-4 py-4">{app.application_date}</td>
                    <td className="px-4 py-4">
                      <div className="flex gap-2">
                        <Link className="btn-soft !px-3" to={`/applications/${app.id}/edit`}><Edit size={15} /></Link>
                        <button className="btn-soft !px-3" onClick={() => remove(app.id)}><Trash2 size={15} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex justify-between border-t border-slate-200 px-4 py-3 dark:border-slate-800">
            <button className="btn-soft" onClick={exportCsv}>
              <Download size={16} /> Export CSV
            </button>
            <div className="text-sm text-slate-500">Pagination ready via DRF page results</div>
          </div>
        </div>
      )}
    </>
  );
}

const statuses = ["Applied", "OA", "Shortlisted", "Interview", "HR Round", "Rejected", "Offer"];
const sampleApplications = [
  { id: 1, company_name: "Google", role_title: "Software Engineer", status: "OA", location: "Bengaluru", application_date: "2026-05-01" },
  { id: 2, company_name: "Zoho", role_title: "Frontend Developer", status: "Interview", location: "Chennai", application_date: "2026-05-06" }
];
