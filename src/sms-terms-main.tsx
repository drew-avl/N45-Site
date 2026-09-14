import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import SmsTerms from "./routes/sms-terms";
import "./styles.css";

const root = document.getElementById("root");

if (!root) {
  throw new Error("Root element not found");
}

createRoot(root).render(
  <StrictMode>
    <SmsTerms />
  </StrictMode>,
);
