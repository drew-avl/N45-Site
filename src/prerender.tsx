import { StrictMode } from "react";
import { renderToStaticMarkup, renderToString } from "react-dom/server";

import FieldNotePage, { type FieldNote } from "./components/FieldNotePage";
import Index from "./routes/index";

// Used only at build time so page content is present in the HTML.
export function renderHome() {
  return renderToString(
    <StrictMode>
      <Index />
    </StrictMode>,
  );
}

// Field Note pages are static; they are not hydrated.
export function renderFieldNote(
  post: FieldNote,
  newer: FieldNote | undefined,
  older: FieldNote | undefined,
) {
  return renderToStaticMarkup(
    <FieldNotePage post={post} newer={newer} older={older} />,
  );
}
