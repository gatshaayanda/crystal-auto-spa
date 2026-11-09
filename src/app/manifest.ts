import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "/",
    name: "Crystal Auto Spa",
    short_name: "Crystal Spa",
    description: "Book a wash, explore car-care services and manage your visits with Crystal Auto Spa.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#0b63ce",
    orientation: "portrait-primary",
    lang: "en",
    categories: ["business", "lifestyle"],
    prefer_related_applications: false,
    icons: [
      { src: "/crystal-auto-spa-icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/crystal-auto-spa-icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/crystal-auto-spa-icon-180.png", sizes: "180x180", type: "image/png", purpose: "any" }
    ],
    screenshots: [
      { src: "/pwa-screenshot-wide.svg", sizes: "1280x720", type: "image/svg+xml", form_factor: "wide", label: "Crystal Auto Spa desktop booking screen" },
      { src: "/pwa-screenshot-mobile.svg", sizes: "720x1280", type: "image/svg+xml", form_factor: "narrow", label: "Crystal Auto Spa mobile booking screen" }
    ]
  };
}
