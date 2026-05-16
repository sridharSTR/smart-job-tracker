import api from "../api/client";

export const recruiterService = {
  jobs: (params) => api.get("/job-posts/", { params }),
  createJob: (payload) => api.post("/job-posts/", payload),
  updateJob: (id, payload) => api.patch(`/job-posts/${id}/`, payload),
  deleteJob: (id) => api.delete(`/job-posts/${id}/`),
  applications: (params) => api.get("/applications/", { params }),
  updateApplication: (id, payload) => api.patch(`/applications/${id}/`, payload),
  downloadResume: (id) => api.get(`/resumes/${id}/download/`, { responseType: "blob" })
};
