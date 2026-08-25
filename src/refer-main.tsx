import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import Refer from "./routes/refer";
import "./styles.css";

const root = document.getElementById("root");

if (!root) {
  throw new Error("Root element not found");
}

createRoot(root).render(
  <StrictMode>
    <Refer />
  </StrictMode>,
);
