import { StrictMode } from "react";
import { createRoot, hydrateRoot } from "react-dom/client";

import App from "./routes";
import "./styles.css";

const root = document.getElementById("root");

if (!root) {
  throw new Error("Root element not found");
}

const app = (
  <StrictMode>
    <App />
  </StrictMode>
);

// Production HTML is prerendered by scripts/prerender.mjs; the dev server is not.
if (root.hasChildNodes()) {
  hydrateRoot(root, app);
} else {
  createRoot(root).render(app);
}
