import { useCallback, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { CalendarClock, ExternalLink, Search } from "lucide-react";
import PageHeader from "../../components/common/PageHeader";
import Section from "../../components/common/Section";
import SearchBar from "../../components/common/SearchBar";
import StatusBadge from "../../components/common/StatusBadge";
import EmptyState from "../../components/common/EmptyState";
import DataTable from "../../components/tables/DataTable";
import { recruiterService } from "../../services/recruiterService";
import { formatApiError, shortDate, toArray } from "../../utils/formatters";

function asLocalInputValue(value) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const offset = date.getTimezoneOffset();
  return new Date(date.getTime() - offset * 60_000).toISOString().slice(0, 16);
}

function readableDateTime(value) {
  if (!value) return "Not scheduled";
  return new Date(value).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit"
  });
}

function extractMeetingLink(notes = "") {
  const match = notes.match(/Meeting link:\s*(.+)/i);
  return match?.[1]?.split("\n")[0]?.trim() || "";
}

export default function Interviews() {
  const [applications, setApplications] = useState([]);
  const [selectedId, setSelectedId] = useState("");
  const [query, setQuery] = useState("");
  const [form, setForm] = useState({ interview_date: "", meeting_link: "", notes: "" });
  const [loading, setLoading] = useState(false);

  const load = useCallback(() => {
    setLoading(true);
    return recruiterService.applications({ ordering: "interview_date" })
      .then((res) => setApplications(toArray(res.data)))
      .catch(() => setApplications([]))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);

  const selected = useMemo(
    () => applications.find((item) => String(item.id) === String(selectedId)),
    [applications, selectedId]
  );

  useEffect(() => {
    if (!selected) return;
    setForm({
      interview_date: asLocalInputValue(selected.interview_date),
      meeting_link: extractMeetingLink(selected.notes),
      notes: selected.notes || ""
    });
  }, [selected]);

  const upcoming = useMemo(
    () => applications
      .filter((item) => item.interview_date)
      .sort((a, b) => new Date(a.interview_date) - new Date(b.interview_date)),
    [applications]
  );

  const filteredApplicants = useMemo(() => {
    const needle = query.toLowerCase();
    return applications.filter((item) =>
      `${item.applicant?.full_name || ""} ${item.applicant?.email || ""} ${item.role_title} ${item.company_name}`
        .toLowerCase()
        .includes(needle)
    );
  }, [applications, query]);

  const schedule = async (event) => {
    event.preventDefault();
    if (!selected) {
      toast.error("Select an applicant first.");
      return;
    }
    if (!form.interview_date) {
      toast.error("Choose interview date and time.");
      return;
    }

    const notes = [
      form.notes?.trim(),
      form.meeting_link?.trim() ? `Meeting link: ${form.meeting_link.trim()}` : ""
    ].filter(Boolean).join("\n");

    try {
      setLoading(true);
      await recruiterService.updateApplication(selected.id, {
        status: "Interview",
        interview_date: form.interview_date,
        notes
      });
      toast.success("Interview scheduled.");
      await load();
    } catch (err) {
      toast.error(formatApiError(err, "Could not schedule interview."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <PageHeader eyebrow="Recruiter Panel" title="Interview Management" description="Schedule interviews, meeting links, notes, upcoming interviews, and status reminders." />
      <div className="grid gap-5 xl:grid-cols-[0.95fr_1.35fr]">
        <Section title="Schedule Interview">
          <form className="space-y-4" onSubmit={schedule}>
            <label className="block">
              <span className="label mb-2 block">Applicant</span>
              <select className="input" value={selectedId} onChange={(event) => setSelectedId(event.target.value)}>
                <option value="">Select applicant</option>
                {applications.map((item) => (
                  <option value={item.id} key={item.id}>
                    {(item.applicant?.full_name || item.applicant?.username || `Candidate #${item.user}`)} - {item.role_title}
                  </option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="label mb-2 block">Interview date and time</span>
              <input className="input" type="datetime-local" value={form.interview_date} onChange={(event) => setForm((prev) => ({ ...prev, interview_date: event.target.value }))} />
            </label>
            <label className="block">
              <span className="label mb-2 block">Meeting link</span>
              <input className="input" placeholder="https://meet.google.com/..." value={form.meeting_link} onChange={(event) => setForm((prev) => ({ ...prev, meeting_link: event.target.value }))} />
            </label>
            <label className="block">
              <span className="label mb-2 block">Interview notes</span>
              <textarea className="input min-h-28" placeholder="Panel, round type, preparation notes" value={form.notes} onChange={(event) => setForm((prev) => ({ ...prev, notes: event.target.value }))} />
            </label>
            {selected && (
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm text-slate-600 dark:border-white/10 dark:bg-white/5 dark:text-slate-300">
                <p className="font-bold text-slate-900 dark:text-white">{selected.applicant?.full_name || selected.applicant?.username || `Candidate #${selected.user}`}</p>
                <p>{selected.applicant?.email || "No email"} / {selected.company_name} / {selected.role_title}</p>
              </div>
            )}
            <button className="btn-primary w-full" disabled={loading}><CalendarClock size={17} /> {loading ? "Saving..." : "Schedule interview"}</button>
          </form>
        </Section>

        <Section title="Upcoming Interviews">
          {upcoming.length ? (
            <div className="grid gap-3 md:grid-cols-2">
              {upcoming.map((item) => {
                const link = extractMeetingLink(item.notes);
                return (
                  <article className="rounded-lg border border-slate-200 bg-white p-4 dark:border-white/10 dark:bg-white/5" key={item.id}>
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-black text-slate-950 dark:text-white">{readableDateTime(item.interview_date)}</p>
                        <p className="mt-1 text-sm font-semibold text-slate-600 dark:text-slate-300">{item.applicant?.full_name || item.applicant?.username || `Candidate #${item.user}`}</p>
                      </div>
                      <StatusBadge status={item.status} />
                    </div>
                    <p className="mt-3 text-sm text-slate-500">{item.role_title} / {item.company_name}</p>
                    {link && <a className="btn-soft mt-4 w-full" href={link.startsWith("http") ? link : `https://${link}`} target="_blank" rel="noreferrer"><ExternalLink size={16} /> Join meeting</a>}
                  </article>
                );
              })}
            </div>
          ) : (
            <EmptyState title="No interviews scheduled" description="Select an applicant and schedule your first interview." />
          )}
        </Section>
      </div>

      <div className="mt-5">
        <Section title="Applicant Pipeline">
          <div className="mb-4"><SearchBar value={query} onChange={setQuery} placeholder="Search applicants for interviews" /></div>
          <DataTable
            rows={filteredApplicants}
            empty={<EmptyState title="No applicants found" />}
            columns={[
              { key: "candidate", label: "Candidate", render: (row) => row.applicant?.full_name || row.applicant?.username || `Candidate #${row.user}` },
              { key: "role_title", label: "Role" },
              { key: "company_name", label: "Company" },
              { key: "status", label: "Status", render: (row) => <StatusBadge status={row.status} /> },
              { key: "interview_date", label: "Interview", render: (row) => readableDateTime(row.interview_date) },
              { key: "application_date", label: "Applied", render: (row) => shortDate(row.application_date) },
              { key: "actions", label: "Actions", render: (row) => <button className="btn-soft" onClick={() => setSelectedId(String(row.id))}><Search size={16} /> Schedule</button> }
            ]}
          />
        </Section>
      </div>
    </>
  );
}
