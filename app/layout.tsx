import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Opportunity.ai",
    template: "%s | Opportunity.ai",
  },
  description: "AI-assisted job search and application management platform",
  keywords: ["job search", "career", "AI", "job applications", "resume", "CV"],
  authors: [{ name: "Opportunity.ai Team" }],
  creator: "Opportunity.ai",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    title: "Opportunity.ai",
    description: "AI-assisted job search and application management platform",
    siteName: "Opportunity.ai",
  },
  twitter: {
    card: "summary_large_image",
    title: "Opportunity.ai",
    description: "AI-assisted job search and application management platform",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
