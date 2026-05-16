import PageHeader from "../../components/common/PageHeader";
import ChartCard from "../../components/charts/ChartCard";
import { MonthlyAreaChart, SimpleBarChart } from "../../components/charts/AnalyticsCharts";
import { platformMetrics, statusSamples } from "../../constants/sampleData";

export default function RecruiterAnalytics() {
  return (
    <>
      <PageHeader eyebrow="Recruiter Panel" title="Hiring Analytics" description="Job performance, conversion funnel, trends, and monthly applicant analytics." />
      <div className="grid gap-5 xl:grid-cols-2">
        <ChartCard title="Hiring Trends"><MonthlyAreaChart data={platformMetrics.map((item) => ({ month: item.month, applications: item.applications }))} /></ChartCard>
        <ChartCard title="Applicant Funnel"><SimpleBarChart data={statusSamples} /></ChartCard>
      </div>
    </>
  );
}

