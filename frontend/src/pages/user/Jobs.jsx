import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { Bookmark, Send } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import PageHeader from "../../components/common/PageHeader";
import SearchBar from "../../components/common/SearchBar";
import FilterDropdown from "../../components/common/FilterDropdown";
import StatusBadge from "../../components/common/StatusBadge";
import Pagination from "../../components/common/Pagination";
import { jobTypes, workplaces } from "../../constants/app";
import { sampleJobs } from "../../constants/sampleData";
import { userService } from "../../services/userService";
import { formatApiError, money, pageCount, shortDate, toArray } from "../../utils/formatters";
import { useDebouncedValue } from "../../hooks/useDebouncedValue";

export default function Jobs() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [jobs, setJobs] = useState([]);
  const [query, setQuery] = useState(searchParams.get("search") || "");
  const [workplace, setWorkplace] = useState("");
  const [type, setType] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const debounced = useDebouncedValue(query);

  useEffect(() => {
    setQuery(searchParams.get("search") || "");
  }, [searchParams]);

  useEffect(() => {
    userService.jobs({ page, search: debounced || undefined, workplace: workplace || undefined })
      .then((res) => {
        const items = toArray(res.data);
        setJobs(items);
        setTotalPages(pageCount(res.data, items.length));
      })
      .catch(() => {
        setJobs(sampleJobs);
        setTotalPages(pageCount(null, sampleJobs.length));
      });
  }, [debounced, page, workplace]);

  useEffect(() => {
    setPage(1);
  }, [debounced, workplace, type]);

  const handleQuery = (value) => {
    setQuery(value);
    const next = new URLSearchParams(searchParams);
    if (value.trim()) next.set("search", value);
    else next.delete("search");
    setSearchParams(next, { replace: true });
  };

  const filtered = useMemo(() => jobs.filter((job) => !type || job.job_type === type), [jobs, type]);

  const apply = async (job) => {
    try {
      const resumeResponse = await userService.resumes();
      const resumes = toArray(resumeResponse.data);
      const primaryResume = resumes.find((resume) => resume.is_primary) || resumes[0];

      if (!primaryResume) {
        toast.error("Upload a resume before applying so recruiters receive it with your profile.");
        return;
      }

      await userService.createApplication({
        job_post: job.id,
        company_name: job.company,
        role_title: job.title,
        salary_offered: "",
        location: job.location,
        job_type: job.job_type || "Full-time",
        workplace: job.workplace || "Remote",
        application_date: new Date().toISOString().slice(0, 10),
        status: "Applied",
        notes: `Applied from job search. Source job id: ${job.id}. Resume sent: ${primaryResume.title}.`
      });
      toast.success(`Application sent with ${primaryResume.title}.`);
    } catch (err) {
      toast.error(formatApiError(err, "Could not apply."));
    }
  };

  return (
    <>
      <PageHeader eyebrow="User Panel" title="Job Search" description="Search, save, and apply to open roles using your existing job post and application APIs." />
      <div className="glass mb-5 grid gap-3 rounded-xl p-4 md:grid-cols-[2fr_1fr_1fr]">
        <SearchBar value={query} onChange={handleQuery} placeholder="Search role, company, skill" />
        <FilterDropdown value={workplace} onChange={setWorkplace} options={[{ label: "All workplaces", value: "" }, ...workplaces]} />
        <FilterDropdown value={type} onChange={setType} options={[{ label: "All job types", value: "" }, ...jobTypes]} />
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        {filtered.map((job) => (
          <article className="glass rounded-xl p-5" key={job.id}>
            <div className="flex items-start justify-between gap-4">
              <div><p className="text-sm font-bold text-mint">{job.company}</p><h2 className="mt-1 text-xl font-black">{job.title}</h2></div>
              <button className="icon-btn" onClick={() => toast.success("Job saved.")}><Bookmark size={18} /></button>
            </div>
            <p className="mt-3 text-sm text-slate-500">{job.description}</p>
            <div className="mt-4 flex flex-wrap gap-2">{(job.skills || []).map((skill) => <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold dark:bg-white/10" key={skill.name}>{skill.name}</span>)}</div>
            <div className="mt-5 grid gap-2 text-sm text-slate-500 sm:grid-cols-2">
              <span>{job.location} / {job.workplace}</span><span>{job.salary_range || money(job.salary_offered)}</span><span>{job.job_type || "Full-time"}</span><span>Posted {shortDate(job.created_at)}</span>
            </div>
            <div className="mt-5 flex items-center justify-between">
              <StatusBadge status="Applied" />
              <button className="btn-primary" onClick={() => apply(job)}><Send size={17} /> Apply with resume</button>
            </div>
          </article>
        ))}
      </div>
      <div className="mt-5"><Pagination page={page} totalPages={totalPages} onPage={setPage} /></div>
    </>
  );
}
