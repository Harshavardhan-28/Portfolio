import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "@phosphor-icons/web/regular/style.css";
import "@phosphor-icons/web/fill/style.css";
import "./globals.css";
import SiteHeader from "@/components/SiteHeader";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Harshavardhan Khamkar",
  description:
    "Portfolio of Harshavardhan Khamkar: ML systems, data pipelines and agentic AI products.",
};

export const viewport: Viewport = {
  colorScheme: "dark light",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f5f6f4" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],
};

// Runs before first paint. A theme the visitor chose with the toggle wins; otherwise
// follow the device (phone/PC) setting, and keep following it if it changes.
const themeScript = `(function(){try{var d=document.documentElement,m=window.matchMedia('(prefers-color-scheme: light)');function s(){var t=localStorage.getItem('hk-theme');var light=t?t==='light':m.matches;if(light)d.dataset.theme='light';else delete d.dataset.theme}s();m.addEventListener('change',function(){if(!localStorage.getItem('hk-theme'))s()})}catch(e){}})()`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <SiteHeader />
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
