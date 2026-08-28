import { createFileRoute } from "@tanstack/react-router";
import {
  ActionFlow,
  Capture,
  Coordination,
  FinalCta,
  Footer,
  Hero,
  Intelligence,
  Nav,
  Outcomes,
  Problem,
  Product,
  Trust,
} from "@/components/daylatch/sections";

const title = "Daylatch — The operating layer for your household";
const description =
  "Bills, forms, appointments, documents and deadlines — Daylatch tracks what matters, who owns it, and what happens next. Nothing sensitive without your approval.";

export const Route = createFileRoute("/")({
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
  component: Index,
});

function Index() {
  return (
    <div className="min-h-screen bg-background">
      <Nav />
      <main>
        <Hero />
        <Problem />
        <Product />
        <Intelligence />
        <Coordination />
        <ActionFlow />
        <Trust />
        <Capture />
        <Outcomes />
        <FinalCta />
      </main>
      <Footer />
    </div>
  );
}
