// Shared site chrome data: navigation, socials, contact.

export const EMAIL = "harshavardhan.khamkar@gmail.com";

export const socials = [
  { name: "X", url: "https://x.com/hrshvrdhxn", icon: "ph ph-x-logo" },
  { name: "Instagram", url: "#", icon: "ph ph-instagram-logo" },
  { name: "GitHub", url: "https://github.com/Harshavardhan-28", icon: "ph ph-github-logo" },
  {
    name: "LinkedIn",
    url: "https://www.linkedin.com/in/harshavardhan-khamkar/",
    icon: "ph ph-linkedin-logo",
  },
];

export const footSocials = [
  { name: "LinkedIn", url: "https://www.linkedin.com/in/harshavardhan-khamkar/" },
  { name: "GitHub", url: "https://github.com/Harshavardhan-28" },
  { name: "Leetcode", url: "https://leetcode.com/u/harshkhamkar/" },
  { name: "Twitter", url: "https://x.com/hrshvrdhxn" },
  { name: "Instagram", url: "#" },
];

/** Home page sections, in scroll order. `href` is where the menu sends you from any page. */
export const sections = [
  { id: "home", label: "Home", icon: "house", href: "/" },
  { id: "about", label: "About", icon: "user", href: "/#about" },
  { id: "stack", label: "Tech stack", icon: "stack", href: "/#stack" },
  { id: "projects", label: "Projects", icon: "squares-four", href: "/projects" },
  { id: "hackathons", label: "Hackathons", icon: "trophy", href: "/achievements" },
  { id: "experience", label: "Experience", icon: "briefcase", href: "/#experience" },
  { id: "images", label: "Socials", icon: "images", href: "/#images" },
] as const;
