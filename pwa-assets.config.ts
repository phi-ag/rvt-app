import { defineConfig, minimal2023Preset } from "@vite-pwa/assets-generator/config";

const background = "#111318";

export default defineConfig({
  preset: {
    ...minimal2023Preset,
    maskable: {
      sizes: [512],
      resizeOptions: { fit: "contain", background }
    },
    apple: {
      sizes: [180],
      resizeOptions: { fit: "contain", background }
    }
  },
  images: ["public/Phi.svg"]
});
