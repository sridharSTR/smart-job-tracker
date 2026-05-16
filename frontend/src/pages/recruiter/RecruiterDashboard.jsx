import { useEffect, useState } from "react";
import { Briefcase, CalendarCheck, Users, UserCheck } from "lucide-react";
import DashboardCard from "../../components/common/DashboardCard";
import PageHeader from "../../components/common/PageHeader";
import Section from "../../components/common/Section";
import ChartCard from "../../components/charts/ChartCard";
import { SimpleBarChart } from "../../components/charts/AnalyticsCharts";
import StatusBadge from "../../components/common/StatusBadge";
import { recruiterService } from "../../services/recruiterService";
import { sampleApplicants, statusSamples } from "../../constants/sampleData";
import { toArray } from "../../utils/formatters";

export default function RecruiterDashboard() {
  const [jobs, setJobs] = useState([]);
  const [apps, setApps] = useState([]);
  useEffect(() => {
    recruiterService.jobs().then((res) => setJobs(toArray(res.data))).catch(() => setJobs([]));
    recruiterService.applications().then((res) => setApps(toArray(res.data))).catch(() => setApps([]));
  }, []);

  return (
    <>
      <PageHeader eyebrow="Recruiter Panel" title="Hiring Operations" description="Monitor jobs, applicant activity, interviews, and conversion health." />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        <DashboardCard title="Job Posts" value={jobs.length} icon={Briefcase} caption="Total published" />
        <DashboardCard title="Applicants" value={apps.length} icon={Users} caption="Pipeline volume" />
        <DashboardCard title="Active Jobs" value={jobs.filter((job) => job.is_active).length} icon={UserCheck} caption="Open roles" />
        <DashboardCard title="Closed Jobs" value={jobs.filter((job) => !job.is_active).length} icon={Briefcase} caption="Inactive roles" />
        <DashboardCard title="Interviews" value={apps.filter((app) => ["Interview", "HR Round"].includes(app.status)).length} icon={CalendarCheck} caption="Scheduled" />
      </div>
      <div className="mt-6 grid gap-5 xl:grid-cols-2">
        <ChartCard title="Applicant Conversion Funnel"><SimpleBarChart data={statusSamples} /></ChartCard>
        <Section title="Recent Applicant Activity">
          <div className="space-y-3">{sampleApplicants.map((item) => <div className="flex items-center justify-between rounded-lg border border-slate-200 p-3 dark:border-white/10" key={item.id}><div><p className="font-black">{item.name}</p><p className="text-sm text-slate-500">{item.role} · {item.match}% match</p></div><StatusBadge status={item.status} /></div>)}</div>
        </Section>
      </div>
    </>
  );
}

