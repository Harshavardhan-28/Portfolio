// Single source of truth for the Experience section.
// To add a new role: push a new object here.

export type Experience = {
  role: string;
  org: string;
  date: string;
};

export const experience: Experience[] = [
  {
    role: "Software Engineering Intern",
    org: "Wabi Sabi Tech Solutions",
    date: "June 2026 – Present",
  },
  {
    role: "Cybersecurity Intern",
    org: "JSW Steel",
    date: "June – July 2025",
  },
];
