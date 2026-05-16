import api from "../api/client";

export const notificationService = {
  list: () => api.get("/notifications/"),
  create: (payload) => api.post("/notifications/", payload),
  markRead: (id) => api.post(`/notifications/${id}/mark_read/`)
};

