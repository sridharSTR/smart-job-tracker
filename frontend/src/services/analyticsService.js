import api from "../api/client";

export const analyticsService = {
  overview: () => api.get("/analytics/"),
  platform: () => api.get("/analytics/platform/")
};

