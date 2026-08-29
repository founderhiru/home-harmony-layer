import { createFileRoute } from "@tanstack/react-router";
import { MobileApp } from "@/components/daylatch/mobile-app";

const title = "Daylatch App — Your household, handled";
const description =
  "Capture bills, forms and appointments, see who owns what, and approve every action before it happens — the Daylatch mobile app.";

export const Route = createFileRoute("/app")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: MobileApp,
});
