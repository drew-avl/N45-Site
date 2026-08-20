import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: "./index.html",
        blog: "./blog/index.html",
        managedIt: "./managed-it-services-asheville/index.html",
        businessIt: "./business-it-support-western-nc/index.html",
        cybersecurity: "./cybersecurity-services-asheville/index.html",
      },
    },
  },
  css: {
    transformer: "lightningcss",
  },
  plugins: [tailwindcss(), react()],
  resolve: {
    tsconfigPaths: true,
  },
});
