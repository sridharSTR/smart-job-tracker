import PageHeader from "../../components/common/PageHeader";
import ThemeSwitcher from "../../components/common/ThemeSwitcher";

export default function Settings() {
  return (
    <>
      <PageHeader eyebrow="Admin Panel" title="Settings" description="Platform settings, email settings, security settings, theme settings, and admin preferences." />
      <form className="glass grid gap-4 rounded-xl p-5 md:grid-cols-2">
        <input className="input" placeholder="Platform name" defaultValue="Smart Job Tracker" /><input className="input" placeholder="Support email" /><input className="input" placeholder="SMTP sender" /><input className="input" placeholder="Security policy" /><div className="flex items-center gap-3"><ThemeSwitcher /><span className="text-sm font-bold">Theme preference</span></div><button className="btn-primary md:col-span-2">Save settings</button>
      </form>
    </>
  );
}
