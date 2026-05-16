import { useEffect, useState } from "react";
import { Bell, LogOut, Menu, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ThemeSwitcher from "../common/ThemeSwitcher";
import { useAuth } from "../../context/AuthContext";
import { useNotifications } from "../../context/NotificationContext";
import { initials } from "../../utils/formatters";

export default function Topbar({ onMenu }) {
  const { user, logout } = useAuth();
  const { unreadCount, loadNotifications } = useNotifications();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (user) loadNotifications().catch(() => {});
  }, [loadNotifications, user]);

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  const handleSearch = (event) => {
    event.preventDefault();
    const query = search.trim();
    if (!query) return;

    const target = user?.role === "RECRUITER"
      ? "/recruiter/manage-jobs"
      : user?.role === "ADMIN"
        ? "/admin/jobs"
        : "/jobs";

    navigate(`${target}?search=${encodeURIComponent(query)}`);
  };

  return (
    <header className="sticky top-0 z-20 border-b border-white/60 bg-white/75 px-4 py-3 backdrop-blur-2xl dark:border-white/10 dark:bg-slate-950/70 lg:px-8">
      <div className="flex items-center gap-3">
        <button className="icon-btn lg:hidden" onClick={onMenu}><Menu size={19} /></button>
        <form className="relative hidden flex-1 md:block" onSubmit={handleSearch}>
          <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input className="input max-w-xl pl-10" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search jobs, candidates, applications" />
        </form>
        <div className="ml-auto flex items-center gap-2">
          <button className="icon-btn relative" onClick={() => navigate(user?.role === "ADMIN" ? "/admin/notifications" : user?.role === "RECRUITER" ? "/recruiter/notifications" : "/notifications")}>
            <Bell size={18} />
            {unreadCount > 0 && <span className="absolute right-1 top-1 h-2.5 w-2.5 rounded-full bg-coral" />}
          </button>
          <ThemeSwitcher />
          <div className="hidden items-center gap-3 rounded-full border border-slate-200 bg-white px-2 py-1 dark:border-white/10 dark:bg-white/5 sm:flex">
            <div className="grid h-8 w-8 place-items-center rounded-full bg-mint/20 text-xs font-black text-mint">{initials(user?.full_name || user?.username)}</div>
            <div className="pr-2">
              <p className="text-xs font-black text-slate-950 dark:text-white">{user?.username}</p>
              <p className="text-[11px] text-slate-500">{user?.role}</p>
            </div>
          </div>
          <button className="icon-btn" onClick={handleLogout} title="Logout"><LogOut size={18} /></button>
        </div>
      </div>
    </header>
  );
}
