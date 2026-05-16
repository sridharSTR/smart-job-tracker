import { useEffect, useState } from "react";
import PageHeader from "../../components/common/PageHeader";
import ChartCard from "../../components/charts/ChartCard";
import { MonthlyAreaChart, SimpleBarChart } from "../../components/charts/AnalyticsCharts";
import { adminService } from "../../services/adminService";

export default function PlatformAnalytics() {
  const [stats, setStats] = useState(null);
  useEffect(() => { adminService.platformAnalytics().then((res) => setStats(res.data)).catch(() => setStats(null)); }, []);
  return (
    <>
      <PageHeader eyebrow="Admin Panel" title="Platform Analytics" description="User growth, recruiter growth, job trends, application analytics, and hiring success rates." />
      <div className="grid gap-5 xl:grid-cols-2">
        <ChartCard title="Application Analytics"><MonthlyAreaChart data={stats?.monthly_applications || []} /></ChartCard>
        <ChartCard title="Growth Trends"><SimpleBarChart data={(stats?.user_growth || []).map((item) => ({ name: item.month, value: item.users }))} /></ChartCard>
        <ChartCard title="Application Status"><SimpleBarChart data={stats?.application_status || []} /></ChartCard>
        <ChartCard title="Platform Totals"><SimpleBarChart data={[{ name: "Users", value: stats?.total_users || 0 }, { name: "Recruiters", value: stats?.total_recruiters || 0 }, { name: "Jobs", value: stats?.total_job_posts || 0 }, { name: "Applications", value: stats?.total_applications || 0 }]} /></ChartCard>
      </div>
    </>
  );
}
