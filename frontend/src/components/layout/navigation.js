import {
  BarChart3,
  Bell,
  Briefcase,
  Building2,
  CalendarDays,
  FileBarChart,
  FileText,
  Gauge,
  LayoutDashboard,
  ListChecks,
  Settings,
  ShieldCheck,
  Upload,
  UserCog,
  Users
} from "lucide-react";

export const navByRole = {
  USER: [
    { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { to: "/jobs", label: "Jobs", icon: Briefcase },
    { to: "/applied-jobs", label: "Applied Jobs", icon: ListChecks },
    { to: "/resume", label: "Resume", icon: Upload },
    { to: "/notifications", label: "Notifications", icon: Bell },
    { to: "/profile", label: "Profile", icon: UserCog }
  ],
  RECRUITER: [
    { to: "/recruiter/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { to: "/recruiter/post-job", label: "Post Job", icon: Briefcase },
    { to: "/recruiter/manage-jobs", label: "Manage Jobs", icon: Building2 },
    { to: "/recruiter/applicants", label: "Applicants", icon: Users },
    { to: "/recruiter/interviews", label: "Interviews", icon: CalendarDays },
    { to: "/recruiter/analytics", label: "Analytics", icon: BarChart3 },
    { to: "/recruiter/notifications", label: "Notifications", icon: Bell },
    { to: "/recruiter/profile", label: "Profile", icon: UserCog }
  ],
  ADMIN: [
    { to: "/admin/dashboard", label: "Dashboard", icon: ShieldCheck },
    { to: "/admin/users", label: "Users", icon: Users },
    { to: "/admin/recruiters", label: "Recruiters", icon: Building2 },
    { to: "/admin/jobs", label: "Jobs", icon: Briefcase },
    { to: "/admin/applications", label: "Applications", icon: ListChecks },
    { to: "/admin/analytics", label: "Analytics", icon: Gauge },
    { to: "/admin/reports", label: "Reports", icon: FileBarChart },
    { to: "/admin/notifications", label: "Notifications", icon: Bell },
    { to: "/admin/settings", label: "Settings", icon: Settings }
  ]
};

export const quickActions = [
  { label: "Export CSV", icon: FileText },
  { label: "Sync", icon: Gauge }
];
