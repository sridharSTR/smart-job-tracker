import api from "../api/client";

export const adminService = {
  users: (params) => api.get("/auth/users/", { params }),
  updateUser: (id, payload) => api.patch(`/auth/users/${id}/`, payload),
  deleteUser: (id) => api.delete(`/auth/users/${id}/`),
  suspendUser: (id) => api.post(`/auth/users/${id}/suspend/`),
  jobs: (params) => api.get("/job-posts/", { params }),
  updateJob: (id, payload) => api.patch(`/job-posts/${id}/`, payload),
  deleteJob: (id) => api.delete(`/job-posts/${id}/`),
  applications: (params) => api.get("/applications/", { params }),
  updateApplication: (id, payload) => api.patch(`/applications/${id}/`, payload),
  exportApplications: () => api.get("/applications/export_csv/", { responseType: "blob" }),
  platformAnalytics: () => api.get("/analytics/platform/")
};
