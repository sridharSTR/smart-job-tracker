import { Download } from "lucide-react";
import toast from "react-hot-toast";
import PageHeader from "../../components/common/PageHeader";
import Section from "../../components/common/Section";
import { adminService } from "../../services/adminService";
import { formatApiError } from "../../utils/formatters";

export default function Reports() {
  const downloadApplications = async () => {
    try {
      const { data } = await adminService.exportApplications();
      const url = window.URL.createObjectURL(new Blob([data], { type: "text/csv" }));
      const link = document.createElement("a");
      link.href = url;
      link.download = "applications.csv";
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.setTimeout(() => window.URL.revokeObjectURL(url), 1000);
    } catch (err) {
      toast.error(formatApiError(err, "Could not download report."));
    }
  };

  return (
    <>
      <PageHeader eyebrow="Admin Panel" title="Reports" description="Export platform reports, download Excel/PDF, and review monthly statistics." />
      <div className="grid gap-5 md:grid-cols-3">
        <Section title="Applications CSV"><p className="text-sm text-slate-500">Live export of all user applications, statuses, and interview dates.</p><button className="btn-primary mt-4" onClick={downloadApplications}><Download size={16} /> Download</button></Section>
        <Section title="Job performance"><p className="text-sm text-slate-500">Use Jobs and Applications to review active posts and hiring response.</p><button className="btn-soft mt-4" disabled><Download size={16} /> Coming soon</button></Section>
        <Section title="Hiring success"><p className="text-sm text-slate-500">Offer, rejection, and interview conversion reports will use the same live records.</p><button className="btn-soft mt-4" disabled><Download size={16} /> Coming soon</button></Section>
      </div>
    </>
  );
}
