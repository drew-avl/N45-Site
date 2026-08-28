import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

const googleTagId = "G-KYVW88Y1TY";

const googleTagPlugin = {
  name: "n45-google-tag",
  transformIndexHtml: {
    order: "pre" as const,
    handler(html: string) {
      if (html.includes(`googletagmanager.com/gtag/js?id=${googleTagId}`)) {
        return html;
      }

      return html.replace(
        "<head>",
        `<head>
    <!-- Google tag (gtag.js) -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=${googleTagId}"></script>
    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());

      gtag('config', '${googleTagId}');
    </script>
    <script type="module" src="/src/analytics.ts"></script>`,
      );
    },
  },
};

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: "./index.html",
        book: "./book/index.html",
        refer: "./refer/index.html",
        privacy: "./privacy/index.html",
        blog: "./blog/index.html",
        managedIt: "./managed-it-services-asheville/index.html",
        businessIt: "./business-it-support-western-nc/index.html",
        cybersecurity: "./cybersecurity-services-asheville/index.html",
        listenAndAssess: "./approach/listen-and-assess/index.html",
        stabilizeEssentials: "./approach/stabilize-the-essentials/index.html",
        secureAndDocument: "./approach/secure-and-document/index.html",
        manageAndImprove: "./approach/manage-and-improve/index.html",
      },
    },
  },
  css: {
    transformer: "lightningcss",
  },
  plugins: [googleTagPlugin, tailwindcss(), react()],
  resolve: {
    tsconfigPaths: true,
  },
});
