import { Award, BellRing, Briefcase, CalendarDays, XCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import PageHeader from "../components/ui/PageHeader.jsx";
import StatCard from "../components/ui/StatCard.jsx";
import Skeleton from "../components/ui/Skeleton.jsx";
import api from "../services/api.js";

const colors = ["#35c2a2", "#ff6b6b", "#f7b801", "#4f46e5", "#14b8a6", "#64748b"];

export default function Dashboard() {
  const [data, setData] = useState(null);
  useEffect(() => {
    api.get("/analytics/").then((res) => setData(res.data)).catch(() => setData(fallbackAnalytics));
  }, []);

  if (!data) return <Skeleton className="h-96" />;

  return (
    <>
      <PageHeader title="Dashboard" eyebrow="Career overview" />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        <StatCard label="Applications" value={data.totals.applications} icon={Briefcase} />
        <StatCard label="Interviews" value={data.totals.interviews} icon={CalendarDays} tone="bg-indigo-100 text-indigo-700" />
        <StatCard label="Offers" value={data.totals.offers} icon={Award} tone="bg-amber-100 text-amber-700" />
        <StatCard label="Rejections" value={data.totals.rejections} icon={XCircle} tone="bg-rose-100 text-rose-700" />
        <StatCard label="Unread" value={data.totals.unread_notifications} icon={BellRing} tone="bg-sky-100 text-sky-700" />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.4fr_.8fr]">
        <div className="glass rounded-lg p-5">
          <h2 className="font-black">Monthly applications</h2>
          <div className="mt-4 h-72">
            <ResponsiveContainer>
              <BarChart data={data.monthly}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="applications" radius={[8, 8, 0, 0]} fill="#35c2a2" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="glass rounded-lg p-5">
          <h2 className="font-black">Status mix</h2>
          <div className="mt-4 h-72">
            <ResponsiveContainer>
              <PieChart>
                <Pie data={data.status_counts} dataKey="value" nameKey="name" innerRadius={62} outerRadius={96}>
                  {data.status_counts.map((entry, index) => <Cell key={entry.name} fill={colors[index % colors.length]} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="glass mt-6 rounded-lg p-5">
        <h2 className="font-black">Recent activity</h2>
        <div className="mt-4 divide-y divide-slate-200 dark:divide-slate-800">
          {data.recent_activity.map((item) => (
            <div key={item.id} className="flex items-center justify-between py-3 text-sm">
              <span><b>{item.company_name}</b> · {item.role_title}</span>
              <span className="rounded-lg bg-slate-100 px-3 py-1 font-bold dark:bg-slate-800">{item.status}</span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

const fallbackAnalytics = {
  totals: { applications: 24, interviews: 7, offers: 2, rejections: 5, unread_notifications: 3 },
  monthly: [{ month: "Jan", applications: 4 }, { month: "Feb", applications: 7 }, { month: "Mar", applications: 5 }, { month: "Apr", applications: 8 }],
  status_counts: [{ name: "Applied", value: 8 }, { name: "Interview", value: 7 }, { name: "Offer", value: 2 }, { name: "Rejected", value: 5 }],
  recent_activity: [{ id: 1, company_name: "Stripe", role_title: "Frontend Engineer", status: "Interview" }, { id: 2, company_name: "Atlassian", role_title: "SDE Intern", status: "Applied" }]
};
