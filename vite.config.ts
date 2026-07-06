// @lovable.dev/vite-tanstack-config already includes the TanStack,
// React, Tailwind, path alias, dedupe, and development plugins.
// Do not add those plugins again manually.

import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  tanstackStart: {
    server: {
      entry: "server",
    },
  },

  // Force a standalone Node.js server build for edge01.
  nitro: {
    preset: "node_server",
  },
});