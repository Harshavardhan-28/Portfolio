// Single source of truth for the Tech Stack section.
// Badges are rendered via shields.io from these fields — no image assets to
// manage. `logo` is a simple-icons slug (https://simpleicons.org); `color` is
// the badge background as a hex string (no #); `logoColor` defaults to white,
// set it to a dark value for logos that need contrast against a light badge.

export type TechItem = {
  label: string;
  logo: string;
  color: string;
  logoColor?: string;
};

export type TechCategory = {
  name: string;
  items: TechItem[];
};

export const techStack: TechCategory[] = [
  {
    name: "Languages",
    items: [
      { label: "Python", logo: "python", color: "3776AB" },
      { label: "Java", logo: "openjdk", color: "437291" },
      { label: "TypeScript", logo: "typescript", color: "3178C6" },
      { label: "JavaScript", logo: "javascript", color: "F7DF1E", logoColor: "black" },
      { label: "C++", logo: "cplusplus", color: "00599C" },
    ],
  },
  {
    name: "Frameworks",
    items: [
      { label: "React", logo: "react", color: "20232A" },
      { label: "Next.js", logo: "nextdotjs", color: "000000" },
      { label: "Spring Boot", logo: "springboot", color: "6DB33F" },
      { label: "FastAPI", logo: "fastapi", color: "009688" },
      { label: "PyTorch", logo: "pytorch", color: "EE4C2C" },
      { label: "Tailwind CSS", logo: "tailwindcss", color: "06B6D4" },
    ],
  },
  {
    name: "Data & Infra",
    items: [
      { label: "Apache Kafka", logo: "apachekafka", color: "231F20" },
      { label: "Apache Spark", logo: "apachespark", color: "E25A1C" },
      { label: "Docker", logo: "docker", color: "2496ED" },
      { label: "MySQL", logo: "mysql", color: "4479A1" },
      { label: "MongoDB", logo: "mongodb", color: "47A248" },
      { label: "Redis", logo: "redis", color: "DC382D" },
      { label: "Neo4j", logo: "neo4j", color: "4581C3" },
    ],
  },
  {
    name: "Cloud & Tools",
    items: [
      { label: "Google Cloud", logo: "googlecloud", color: "4285F4" },
      { label: "Firebase", logo: "firebase", color: "FFCA28", logoColor: "black" },
      { label: "Vertex AI", logo: "googlecloud", color: "34A853" },
      { label: "Git", logo: "git", color: "F05032" },
      { label: "GitHub", logo: "github", color: "181717" },
      { label: "Linux", logo: "linux", color: "FCC624", logoColor: "black" },
    ],
  },
];
