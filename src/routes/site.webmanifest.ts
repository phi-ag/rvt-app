const color = "#111318";

export const GET = (): Response =>
  Response.json({
    name: "rvt.app",
    short_name: "rvt.app",
    description: "Display Revit file information",
    icons: [
      {
        src: "/pwa-64x64.png",
        sizes: "64x64",
        type: "image/png"
      },
      {
        src: "/pwa-192x192.png",
        sizes: "192x192",
        type: "image/png"
      },
      {
        src: "/pwa-512x512.png",
        sizes: "512x512",
        type: "image/png"
      },
      {
        src: "/maskable-icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable"
      }
    ],
    start_url: ".",
    display: "standalone",
    theme_color: color,
    background_color: color
  });
