import { useEffect, useState } from "react";
import { Award, Bell, Briefcase, CalendarCheck, ThumbsDown } from "lucide-react";
import { motion } from "framer-motion";
import DashboardCard from "../../components/common/DashboardCard";
import PageHeader from "../../components/common/PageHeader";
import Section from "../../components/common/Section";
import StatusBadge from "../../components/common/StatusBadge";
import ChartCard from "../../components/charts/ChartCard";
import { MonthlyAreaChart, SimpleBarChart, StatusPieChart } from "../../components/charts/AnalyticsCharts";
import { analyticsService } from "../../services/analyticsService";
import { sampleJobs, statusSamples } from "../../constants/sampleData";

export default function UserDashboard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    analyticsService.overview().then((res) => setData(res.data)).catch(() => setData(null));
  }, []);

  const totals = data?.totals || {};
  const monthly = data?.monthly?.length ? data.monthly : [
    { month: "Jan", applications: 3 }, { month: "Feb", applications: 5 }, { month: "Mar", applications: 8 }, { month: "Apr", applications: 6 }, { month: "May", applications: 10 }
  ];
  const status = data?.status_counts?.length ? data.status_counts : statusSamples;

  return (
    <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}>
      <PageHeader eyebrow="User Panel" title="Career Command Center" description="Track applications, interviews, offers, resumes, and job recommendations from one polished workspace." />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        <DashboardCard title="Applications" value={totals.applications ?? 0} icon={Briefcase} caption="Total tracked" trend="+12%" />
        <DashboardCard title="Interviews" value={totals.interviews ?? 0} icon={CalendarCheck} caption="Scheduled" />
        <DashboardCard title="Offers" value={totals.offers ?? 0} icon={Award} caption="Received" />
        <DashboardCard title="Rejections" value={totals.rejections ?? 0} icon={ThumbsDown} caption="Closed loops" />
        <DashboardCard title="Unread" value={totals.unread_notifications ?? 0} icon={Bell} caption="Notifications" />
      </div>

      <div className="mt-6 grid gap-5 xl:grid-cols-3">
        <div className="xl:col-span-2"><ChartCard title="Monthly Application Analytics"><MonthlyAreaChart data={monthly} /></ChartCard></div>
        <ChartCard title="Status Overview"><StatusPieChart data={status} /></ChartCard>
      </div>

      <div className="mt-6 grid gap-5 xl:grid-cols-2">
        <Section title="Recommended Jobs">
          <div className="space-y-3">{sampleJobs.map((job) => (
            <div className="rounded-lg border border-slate-200 p-4 dark:border-white/10" key={job.id}>
              <div className="flex items-start justify-between gap-3">
                <div><p className="font-black">{job.title}</p><p className="text-sm text-slate-500">{job.company} · {job.location}</p></div>
                <StatusBadge status="Applied" />
              </div>
            </div>
          ))}</div>
        </Section>
        <ChartCard title="Application Status Bar"><SimpleBarChart data={status} /></ChartCard>
      </div>
    </motion.div>
  );
}

