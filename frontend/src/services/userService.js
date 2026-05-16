import api from "../api/client";

export const userService = {
  applications: (params) => api.get("/applications/", { params }),
  createApplication: (payload) => api.post("/applications/", payload),
  updateApplication: (id, payload) => api.patch(`/applications/${id}/`, payload),
  deleteApplication: (id) => api.delete(`/applications/${id}/`),
  jobs: (params) => api.get("/job-posts/", { params }),
  resumes: () => api.get("/resumes/"),
  uploadResume: (payload) => api.post("/resumes/", payload, { headers: { "Content-Type": "multipart/form-data" } }),
  updateResume: (id, payload) => api.patch(`/resumes/${id}/`, payload, { headers: { "Content-Type": "multipart/form-data" } }),
  deleteResume: (id) => api.delete(`/resumes/${id}/`),
  updateProfile: (payload) => api.patch("/auth/me/", payload),
  resumeMatch: (payload) => api.post("/resume-match/", payload, { headers: { "Content-Type": "multipart/form-data" } })
};
