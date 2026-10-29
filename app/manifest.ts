import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "สานไทย — SanThai",
    short_name: "สานไทย",
    description: "Thai handwoven-fabric marketplace",
    start_url: "/",
    display: "standalone",
    background_color: "#2B1B41", // brand-900
    theme_color: "#2B1B41",
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
