import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Full-Stack Developer Portfolio & Admin CMS",
  description: "Modern Developer Portfolio powered by Next.js, AWS RDS PostgreSQL, and Vercel with an interactive Admin CMS.",
  keywords: ["Portfolio", "Full-Stack Developer", "Next.js", "PostgreSQL", "AWS RDS", "Vercel", "CMS"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body className="antialiased selection:bg-sky-500 selection:text-white min-h-screen flex flex-col">
        {children}
      </body>
    </html>
  );
}
