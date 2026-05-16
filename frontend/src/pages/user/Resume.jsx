import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Download, Star, Trash2 } from "lucide-react";
import PageHeader from "../../components/common/PageHeader";
import FileUpload from "../../components/forms/FileUpload";
import EmptyState from "../../components/common/EmptyState";
import { userService } from "../../services/userService";
import { formatApiError, shortDate, toArray } from "../../utils/formatters";

export default function Resume() {
  const [resumes, setResumes] = useState([]);
  const [progress, setProgress] = useState(0);
  const load = () => userService.resumes().then((res) => setResumes(toArray(res.data))).catch(() => setResumes([]));
  useEffect(() => { load(); }, []);

  const upload = async (file) => {
    if (!file) return;
    try {
      setProgress(45);
      const form = new FormData();
      form.append("title", file.name);
      form.append("file", file);
      form.append("is_primary", resumes.length === 0);
      await userService.uploadResume(form);
      setProgress(100);
      toast.success("Resume uploaded.");
      load();
    } catch (err) {
      toast.error(formatApiError(err));
    } finally {
      window.setTimeout(() => setProgress(0), 800);
    }
  };

  const deleteResume = async (resume) => {
    if (!window.confirm(`Delete ${resume.title}?`)) return;
    try {
      await userService.deleteResume(resume.id);
      toast.success("Resume deleted.");
      load();
    } catch (err) {
      toast.error(formatApiError(err, "Could not delete resume."));
    }
  };

  return (
    <>
      <PageHeader eyebrow="User Panel" title="Resume Management" description="Upload, preview, download, and select resumes for applications." />
      <FileUpload onChange={upload} />
      {progress > 0 && <div className="mt-4 h-2 rounded-full bg-slate-200 dark:bg-slate-800"><div className="h-2 rounded-full bg-mint transition-all" style={{ width: `${progress}%` }} /></div>}
      <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {resumes.map((resume) => (
          <div className="glass min-w-0 rounded-xl p-5" key={resume.id}>
            <div className="flex min-w-0 items-start justify-between gap-3">
              <div className="min-w-0">
                <h3 className="break-words text-base font-black leading-snug text-slate-950 dark:text-white">{resume.title}</h3>
                <p className="mt-1 text-sm text-slate-500">Uploaded {shortDate(resume.created_at)}</p>
              </div>
              {resume.is_primary && <Star className="shrink-0 text-amber" size={18} />}
            </div>
            <div className="mt-5 flex flex-wrap gap-2">
              <a className="btn-soft" href={resume.file} target="_blank" rel="noreferrer"><Download size={16} /> Download</a>
              <a className="btn-primary" href={resume.file} target="_blank" rel="noreferrer">Preview</a>
              <button className="btn-danger" type="button" onClick={() => deleteResume(resume)}><Trash2 size={16} /> Delete</button>
            </div>
          </div>
        ))}
      </div>
      {!resumes.length && <div className="mt-6"><EmptyState title="No resumes yet" description="Upload your first PDF to start applying faster." /></div>}
    </>
  );
}
