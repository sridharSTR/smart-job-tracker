import { useEffect, useState } from "react";
import { Activity, Briefcase, FileCheck, Users } from "lucide-react";
import DashboardCard from "../../components/common/DashboardCard";
import PageHeader from "../../components/common/PageHeader";
import ChartCard from "../../components/charts/ChartCard";
import { MonthlyAreaChart, SimpleBarChart } from "../../components/charts/AnalyticsCharts";
import Section from "../../components/common/Section";
import { adminService } from "../../services/adminService";
import { shortDate } from "../../utils/formatters";

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  useEffect(() => { adminService.platformAnalytics().then((res) => setStats(res.data)).catch(() => setStats(null)); }, []);
  return (
    <>
      <PageHeader eyebrow="Admin Panel" title="Platform Control Center" description="Oversee users, recruiters, jobs, applications, reports, and platform health." />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        <DashboardCard title="Users" value={stats?.total_users ?? 0} icon={Users} caption="Total accounts" />
        <DashboardCard title="Recruiters" value={stats?.total_recruiters ?? "—"} icon={Users} caption="Hiring teams" />
        <DashboardCard title="Job Posts" value={stats?.total_job_posts ?? 0} icon={Briefcase} caption="All jobs" />
        <DashboardCard title="Applications" value={stats?.total_applications ?? 0} icon={FileCheck} caption="All records" />
        <DashboardCard title="Active Jobs" value={stats?.active_job_posts ?? 0} icon={Activity} caption="Currently open" />
      </div>
      <div className="mt-6 grid gap-5 xl:grid-cols-2">
        <ChartCard title="Monthly Activity"><MonthlyAreaChart data={stats?.monthly_applications || []} /></ChartCard>
        <ChartCard title="Platform Statistics"><SimpleBarChart data={[{ name: "Users", value: stats?.total_users ?? 0 }, { name: "Jobs", value: stats?.total_job_posts ?? 0 }, { name: "Apps", value: stats?.total_applications ?? 0 }]} /></ChartCard>
      </div>
      <div className="mt-6">
        <Section title="Recent Activities">
          <div className="space-y-3">
            {(stats?.recent_activity || []).slice(0, 8).map((item, index) => (
              <div className="rounded-lg border border-slate-200 bg-white p-3 text-sm dark:border-white/10 dark:bg-white/5" key={`${item.type}-${item.id}-${index}`}>
                <p className="font-bold text-slate-900 dark:text-white">{item.title}</p>
                <p className="text-slate-500">{item.detail} / {shortDate(item.created_at)}</p>
              </div>
            ))}
            {!stats?.recent_activity?.length && <p className="text-sm text-slate-500">No recent platform activity yet.</p>}
          </div>
        </Section>
      </div>
    </>
  );
}
