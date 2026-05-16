import PageHeader from "../../components/common/PageHeader";
import Section from "../../components/common/Section";

export default function AdminNotifications() {
  return (
    <>
      <PageHeader eyebrow="Admin Panel" title="Admin Notifications" description="System alerts, recruiter approvals, user activity, and security notifications." />
      <Section title="System Alerts"><div className="space-y-3">{["Email service healthy", "2 recruiters awaiting review", "Weekly report ready"].map((item) => <div className="rounded-lg border border-slate-200 p-3 text-sm dark:border-white/10" key={item}>{item}</div>)}</div></Section>
    </>
  );
}

