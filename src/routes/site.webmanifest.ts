import MaskableIcon from "~/images/maskable-icon-512x512.png";
import Icon64 from "~/images/pwa-64x64.png";
import Icon192 from "~/images/pwa-192x192.png";
import Icon512 from "~/images/pwa-512x512.png";

const color = "#111318";

export const GET = () =>
  Response.json({
    name: "rvt.app",
    short_name: "rvt.app",
    description: "Display Revit file information",
    icons: [
      {
        src: Icon64,
        sizes: "64x64",
        type: "image/png"
      },
      {
        src: Icon192,
        sizes: "192x192",
        type: "image/png"
      },
      {
        src: Icon512,
        sizes: "512x512",
        type: "image/png"
      },
      {
        src: MaskableIcon,
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
