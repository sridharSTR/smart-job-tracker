import { UploadCloud } from "lucide-react";
import { useState } from "react";
import PageHeader from "../components/ui/PageHeader.jsx";
import api from "../services/api.js";

export default function ResumeAnalyzer() {
  const [jobDescription, setJobDescription] = useState("");
  const [resumeText, setResumeText] = useState("");
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);

  const analyze = async (event) => {
    event.preventDefault();
    const form = new FormData();
    form.append("job_description", jobDescription);
    form.append("resume_text", resumeText);
    if (file) form.append("resume", file);
    const { data } = await api.post("/resume-match/", form);
    setResult(data);
  };

  return (
    <>
      <PageHeader title="Resume Analyzer" eyebrow="ATS keyword match" />
      <form className="grid gap-6 lg:grid-cols-[1fr_.8fr]" onSubmit={analyze}>
        <div className="glass space-y-4 rounded-lg p-5">
          <label className="label">Resume upload</label>
          <label className="grid cursor-pointer place-items-center rounded-lg border-2 border-dashed border-slate-300 p-8 text-center dark:border-slate-700">
            <UploadCloud className="text-mint" size={34} />
            <span className="mt-3 text-sm font-bold">{file?.name || "Drop PDF resume or browse"}</span>
            <input type="file" accept="application/pdf" className="hidden" onChange={(e) => setFile(e.target.files[0])} />
          </label>
          <textarea className="input min-h-40" placeholder="Or paste resume text" value={resumeText} onChange={(e) => setResumeText(e.target.value)} />
          <textarea className="input min-h-56" placeholder="Paste job description" value={jobDescription} onChange={(e) => setJobDescription(e.target.value)} required />
          <button className="btn-primary">Analyze match</button>
        </div>
        <div className="glass rounded-lg p-5">
          <h2 className="font-black">ATS-style score</h2>
          {result ? (
            <div className="mt-6">
              <div className="grid aspect-square max-w-56 place-items-center rounded-full border-[18px] border-mint text-5xl font-black">{result.score}%</div>
              <h3 className="mt-6 font-bold">Missing skills</h3>
              <div className="mt-3 flex flex-wrap gap-2">
                {result.missing_skills.map((skill) => <span key={skill} className="rounded-lg bg-coral/10 px-3 py-1 text-sm font-bold text-coral">{skill}</span>)}
              </div>
            </div>
          ) : (
            <p className="mt-4 text-sm leading-6 text-slate-500">Upload a resume and paste a job description to calculate keyword match, matched terms, and missing skills.</p>
          )}
        </div>
      </form>
    </>
  );
}
