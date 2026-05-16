export const sampleJobs = [
  {
    id: "sample-1",
    company: "Northstar Labs",
    title: "Frontend Engineer",
    salary_range: "$90k - $130k",
    location: "Remote",
    workplace: "Remote",
    job_type: "Full-time",
    experience: "2-4 years",
    skills: [{ name: "React" }, { name: "TypeScript" }, { name: "Design Systems" }],
    created_at: new Date().toISOString(),
    description: "Build production-grade SaaS interfaces and data-rich workflows."
  },
  {
    id: "sample-2",
    company: "HireFlow AI",
    title: "Full Stack Developer",
    salary_range: "$80k - $115k",
    location: "Bengaluru",
    workplace: "Hybrid",
    job_type: "Full-time",
    experience: "1-3 years",
    skills: [{ name: "Django" }, { name: "React" }, { name: "PostgreSQL" }],
    created_at: new Date().toISOString(),
    description: "Work across Django APIs, React dashboards, and recruiter automation."
  },
  {
    id: "sample-3",
    company: "CloudBridge",
    title: "Software Engineer Intern",
    salary_range: "$2k - $3k / mo",
    location: "Chennai",
    workplace: "Onsite",
    job_type: "Internship",
    experience: "0-1 years",
    skills: [{ name: "JavaScript" }, { name: "REST APIs" }, { name: "Git" }],
    created_at: new Date().toISOString(),
    description: "Join a small product team shipping internal hiring tools."
  }
];

export const sampleApplicants = [
  { id: 1, name: "Aarav Menon", role: "Frontend Engineer", status: "Shortlisted", match: 92, skills: "React, Tailwind, UX" },
  { id: 2, name: "Diya Shah", role: "Full Stack Developer", status: "Interview", match: 86, skills: "Django, React, SQL" },
  { id: 3, name: "Rohan Iyer", role: "Intern", status: "OA", match: 74, skills: "JS, Git, REST" }
];

export const platformMetrics = [
  { month: "Jan", users: 24, applications: 52, jobs: 12 },
  { month: "Feb", users: 42, applications: 78, jobs: 18 },
  { month: "Mar", users: 68, applications: 120, jobs: 29 },
  { month: "Apr", users: 91, applications: 160, jobs: 34 },
  { month: "May", users: 124, applications: 210, jobs: 45 }
];

export const statusSamples = [
  { name: "Applied", value: 12 },
  { name: "OA", value: 6 },
  { name: "Interview", value: 4 },
  { name: "Offer", value: 2 },
  { name: "Rejected", value: 3 }
];

