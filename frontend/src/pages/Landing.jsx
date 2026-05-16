import { Link } from "react-router-dom";
import { ArrowRight, BarChart3, BriefcaseBusiness, ShieldCheck } from "lucide-react";
import ThemeSwitcher from "../components/common/ThemeSwitcher";

export default function Landing() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-950 dark:bg-slate-950 dark:text-white">
      <header className="sticky top-0 z-10 border-b border-white/70 bg-white/75 px-5 py-4 backdrop-blur-2xl dark:border-white/10 dark:bg-slate-950/75">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <Link to="/" className="flex items-center gap-2 font-black"><BriefcaseBusiness className="text-mint" /> Smart Job Tracker</Link>
          <div className="flex items-center gap-2"><ThemeSwitcher /><Link className="btn-soft" to="/login">Login</Link><Link className="btn-primary" to="/register">Start free</Link></div>
        </div>
      </header>
      <main className="mx-auto grid min-h-[calc(100vh-73px)] max-w-7xl content-center gap-10 px-5 py-10 lg:grid-cols-[1fr_0.9fr]">
        <section>
          <p className="eyebrow">React + Django SaaS</p>
          <h1 className="mt-4 max-w-3xl text-5xl font-black leading-tight md:text-7xl">Smart Job Tracker</h1>
          <p className="mt-5 max-w-2xl text-lg text-slate-600 dark:text-slate-300">A premium multi-role platform for applicants, recruiters, and admins with JWT auth, analytics, resumes, jobs, applications, and notifications.</p>
          <div className="mt-8 flex flex-wrap gap-3"><Link className="btn-primary" to="/register">Create account <ArrowRight size={18} /></Link><Link className="btn-soft" to="/login">View dashboard</Link></div>
        </section>
        <section className="glass grid gap-4 rounded-xl p-5">
          {[["User Panel", "Track jobs, resumes, applications, interviews, offers."], ["Recruiter Panel", "Post jobs, manage applicants, schedule interviews."], ["Admin Panel", "Moderate platform users, jobs, reports, analytics."]].map(([title, desc], index) => {
            const Icon = [BarChart3, BriefcaseBusiness, ShieldCheck][index];
            return <div className="rounded-lg border border-slate-200 p-4 dark:border-white/10" key={title}><Icon className="text-mint" /><h2 className="mt-3 font-black">{title}</h2><p className="mt-1 text-sm text-slate-500">{desc}</p></div>;
          })}
        </section>
      </main>
    </div>
  );
}

