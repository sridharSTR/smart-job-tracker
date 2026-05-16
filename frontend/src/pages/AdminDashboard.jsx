import { Ban, Briefcase, Shield, Users } from "lucide-react";
import { useEffect, useState } from "react";
import PageHeader from "../components/ui/PageHeader.jsx";
import StatCard from "../components/ui/StatCard.jsx";
import api from "../services/api.js";

export default function AdminDashboard({ mode = "admin" }) {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    api.get("/analytics/platform/").then((res) => setStats(res.data)).catch(() => setStats({ total_users: 42, total_applications: 318, total_job_posts: 16, active_job_posts: 11 }));
    api.get("/auth/users/").then((res) => setUsers(res.data.results || res.data)).catch(() => setUsers(sampleUsers));
  }, []);

  return (
    <>
      <PageHeader title={mode === "recruiter" ? "Recruiter Dashboard" : "Admin Dashboard"} eyebrow="Recruiter operations" />
      <div className="grid gap-4 md:grid-cols-4">
        <StatCard label="Users" value={stats?.total_users} icon={Users} />
        <StatCard label="Applications" value={stats?.total_applications} icon={Briefcase} tone="bg-indigo-100 text-indigo-700" />
        <StatCard label="Job posts" value={stats?.total_job_posts} icon={Shield} tone="bg-amber-100 text-amber-700" />
        <StatCard label="Active posts" value={stats?.active_job_posts} icon={Shield} tone="bg-emerald-100 text-emerald-700" />
      </div>
      <div className="glass mt-6 overflow-hidden rounded-lg">
        <div className="border-b border-slate-200 p-5 dark:border-slate-800">
          <h2 className="font-black">User management</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[680px] text-left text-sm">
            <thead className="bg-slate-100 text-xs uppercase text-slate-500 dark:bg-slate-900">
              <tr><th className="px-4 py-3">User</th><th className="px-4 py-3">Email</th><th className="px-4 py-3">Role</th><th className="px-4 py-3">Status</th><th className="px-4 py-3">Action</th></tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {users.map((user) => (
                <tr key={user.id}>
                  <td className="px-4 py-4 font-bold">{user.username}</td>
                  <td className="px-4 py-4">{user.email}</td>
                  <td className="px-4 py-4">{user.role}</td>
                  <td className="px-4 py-4">{user.is_suspended ? "Suspended" : "Active"}</td>
                  <td className="px-4 py-4"><button className="btn-soft !px-3"><Ban size={16} /></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

const sampleUsers = [{ id: 1, username: "recruiter", email: "recruiter@example.com", role: "ADMIN", is_suspended: false }];
