export function cx(...classes) {
  return classes.filter(Boolean).join(" ");
}

export function toArray(data) {
  return data?.results || data || [];
}

export function pageCount(data, fallbackLength = 0, pageSize = 10) {
  if (typeof data?.count === "number") return Math.max(1, Math.ceil(data.count / pageSize));
  return Math.max(1, Math.ceil(fallbackLength / pageSize));
}

export function formatApiError(error, fallback = "Something went wrong. Please try again.") {
  const data = error?.response?.data;
  const status = error?.response?.status;
  if (!data) {
    if (status >= 500) return "Server error. If this happened during login/register, check OTP email delivery settings.";
    return fallback;
  }
  if (typeof data === "string") return data.includes("<html") || data.includes("<!doctype") ? fallback : data;
  if (Array.isArray(data)) return data.join(" ");
  if (data.detail) return data.detail;
  if (data.non_field_errors) return data.non_field_errors.join(" ");
  return Object.entries(data)
    .map(([field, messages]) => `${field}: ${Array.isArray(messages) ? messages.join(" ") : messages}`)
    .join(" ");
}

export function money(value) {
  if (!value) return "Not disclosed";
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(Number(value));
}

export function shortDate(value) {
  if (!value) return "Not set";
  return new Date(value).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
}

export function initials(name = "SJ") {
  return name
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}
