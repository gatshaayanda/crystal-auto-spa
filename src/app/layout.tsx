import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import PwaRegister from "@/app/pwa-register";
import "./globals.css";
import "./pwa.css";
import "./big-brothers.css";
import "./crystal-auto-spa.css";

const siteUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: "Crystal Auto Spa", template: "%s | Crystal Auto Spa" },
  description: "Book a wash, explore car-care services and manage your visits with Crystal Auto Spa.",
  applicationName: "Crystal Auto Spa",
  keywords: ["Crystal Auto Spa", "car wash", "Mogoditshane", "Botswana"],
  alternates: { canonical: "/" },
  openGraph: { type: "website", url: siteUrl, siteName: "Crystal Auto Spa", title: "Crystal Auto Spa", description: "Car-care services, wash bookings and customer visit records." },
  twitter: { card: "summary", title: "Crystal Auto Spa", description: "Car wash bookings, mobile-service requests and live staff operations." },
  icons: {
    icon: [
      { url: "/crystal-auto-spa-icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/crystal-auto-spa-icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: { url: "/crystal-auto-spa-icon-180.png", sizes: "180x180", type: "image/png" }
  },
  manifest: "/manifest.webmanifest",
  appleWebApp: { capable: true, title: "Crystal Auto Spa", statusBarStyle: "default" }
};

export const viewport: Viewport = { themeColor: "#0b63ce", colorScheme: "light" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>
    <PwaRegister />{children}<Analytics /><SpeedInsights />
  </body></html>;
}
