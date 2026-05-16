import { lazy, Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import AppShell from "./components/layout/AppShell";
import ProtectedRoute from "./components/routing/ProtectedRoute";
import RoleBasedRoute from "./components/routing/RoleBasedRoute";
import { CardSkeleton } from "./components/loaders/Skeleton";

const Landing = lazy(() => import("./pages/Landing"));
const Login = lazy(() => import("./pages/auth/Login"));
const Register = lazy(() => import("./pages/auth/Register"));
const ForgotPassword = lazy(() => import("./pages/auth/ForgotPassword"));
const ResetPassword = lazy(() => import("./pages/auth/ResetPassword"));
const VerifyEmail = lazy(() => import("./pages/auth/VerifyEmail"));
const UserDashboard = lazy(() => import("./pages/user/UserDashboard"));
const Jobs = lazy(() => import("./pages/user/Jobs"));
const AppliedJobs = lazy(() => import("./pages/user/AppliedJobs"));
const Resume = lazy(() => import("./pages/user/Resume"));
const Profile = lazy(() => import("./pages/user/Profile"));
const Notifications = lazy(() => import("./pages/user/Notifications"));
const RecruiterDashboard = lazy(() => import("./pages/recruiter/RecruiterDashboard"));
const PostJob = lazy(() => import("./pages/recruiter/PostJob"));
const ManageJobs = lazy(() => import("./pages/recruiter/ManageJobs"));
const Applicants = lazy(() => import("./pages/recruiter/Applicants"));
const Interviews = lazy(() => import("./pages/recruiter/Interviews"));
const RecruiterAnalytics = lazy(() => import("./pages/recruiter/RecruiterAnalytics"));
const RecruiterProfile = lazy(() => import("./pages/recruiter/RecruiterProfile"));
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));
const UserManagement = lazy(() => import("./pages/admin/UserManagement"));
const JobManagement = lazy(() => import("./pages/admin/JobManagement"));
const ApplicationManagement = lazy(() => import("./pages/admin/ApplicationManagement"));
const PlatformAnalytics = lazy(() => import("./pages/admin/PlatformAnalytics"));
const Reports = lazy(() => import("./pages/admin/Reports"));
const AdminNotifications = lazy(() => import("./pages/admin/AdminNotifications"));
const Settings = lazy(() => import("./pages/admin/Settings"));
const Unauthorized = lazy(() => import("./pages/Unauthorized"));
const NotFound = lazy(() => import("./pages/NotFound"));

export default function App() {
  return (
    <>
      <Toaster position="top-right" toastOptions={{ className: "text-sm font-semibold" }} />
      <Suspense fallback={<div className="p-8"><CardSkeleton /></div>}>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/reset-password/:uid/:token" element={<ResetPassword />} />
          <Route path="/unauthorized" element={<Unauthorized />} />

          <Route element={<ProtectedRoute />}>
            <Route element={<AppShell />}>
              <Route element={<RoleBasedRoute allowedRoles={["USER", "ADMIN"]} />}>
                <Route path="/dashboard" element={<UserDashboard />} />
                <Route path="/jobs" element={<Jobs />} />
                <Route path="/applied-jobs" element={<AppliedJobs />} />
                <Route path="/resume" element={<Resume />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/notifications" element={<Notifications />} />
              </Route>

              <Route element={<RoleBasedRoute allowedRoles={["RECRUITER", "ADMIN"]} />}>
                <Route path="/recruiter/dashboard" element={<RecruiterDashboard />} />
                <Route path="/recruiter/post-job" element={<PostJob />} />
                <Route path="/recruiter/manage-jobs" element={<ManageJobs />} />
                <Route path="/recruiter/applicants" element={<Applicants />} />
                <Route path="/recruiter/interviews" element={<Interviews />} />
                <Route path="/recruiter/analytics" element={<RecruiterAnalytics />} />
                <Route path="/recruiter/profile" element={<RecruiterProfile />} />
                <Route path="/recruiter/notifications" element={<Notifications />} />
              </Route>

              <Route element={<RoleBasedRoute allowedRoles={["ADMIN"]} />}>
                <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
                <Route path="/admin/users" element={<UserManagement />} />
                <Route path="/admin/recruiters" element={<UserManagement roleFilter="RECRUITER" title="Recruiter Management" />} />
                <Route path="/admin/jobs" element={<JobManagement />} />
                <Route path="/admin/applications" element={<ApplicationManagement />} />
                <Route path="/admin/analytics" element={<PlatformAnalytics />} />
                <Route path="/admin/reports" element={<Reports />} />
                <Route path="/admin/notifications" element={<AdminNotifications />} />
                <Route path="/admin/settings" element={<Settings />} />
              </Route>
            </Route>
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </>
  );
}
