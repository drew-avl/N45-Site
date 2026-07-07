import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  css: {
    transformer: "lightningcss",
  },
  plugins: [tailwindcss(), react()],
  resolve: {
    tsconfigPaths: true,
  },
});
