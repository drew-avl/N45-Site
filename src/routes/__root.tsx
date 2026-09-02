import {
  HeadContent,
  Outlet,
  Scripts,
  createRootRoute,
} from "@tanstack/react-router";
import type { ReactNode } from "react";

import "../styles.css";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: "utf-8",
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      {
        title: "N45 Technology Solutions | Managed IT for Western NC",
      },
      {
        name: "description",
        content:
          "Reliable IT support, safer Microsoft 365 accounts, cybersecurity, and clear technology management for independent businesses across Asheville and Western North Carolina.",
      },
      {
        name: "theme-color",
        content: "#0a2423",
      },
      {
        property: "og:title",
        content: "N45 Technology Solutions | Managed IT for Western NC",
      },
      {
        property: "og:description",
        content:
          "Reliable support, safer systems, and clear ownership for Western North Carolina businesses.",
      },
      {
        property: "og:type",
        content: "website",
      },
      {
        property: "og:image",
        content: "https://n45tech.com/assets/hero-mountains.jpg",
      },
      {
        name: "twitter:card",
        content: "summary_large_image",
      },
    ],
    links: [
      {
        rel: "canonical",
        href: "https://n45tech.com/",
      },
      {
        rel: "icon",
        type: "image/svg+xml",
        href: "/assets/favicon.svg",
      },
    ],
  }),
  component: RootComponent,
});

function RootComponent() {
  return (
    <RootDocument>
      <Outlet />
    </RootDocument>
  );
}

function RootDocument({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}
