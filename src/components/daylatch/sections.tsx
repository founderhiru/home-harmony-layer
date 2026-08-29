import { CommandCenter } from "./command-center";
import { Avatar, Chip, CtaButton, Section, SectionHeading, StatusDot } from "./primitives";

export function Nav() {
  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-background/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-5 md:px-8">
        <a href="#top" className="flex items-center gap-2">
          <span className="size-4 rounded-[5px] bg-primary" />
          <span className="font-display text-lg font-semibold tracking-tight">Daylatch</span>
        </a>
        <nav className="hidden items-center gap-8 text-sm text-muted-foreground md:flex">
          <a className="transition-colors hover:text-foreground" href="#how">
            How it works
          </a>
          <a className="transition-colors hover:text-foreground" href="#coordination">
            Coordination
          </a>
          <a className="transition-colors hover:text-foreground" href="#trust">
            Trust
          </a>
        </nav>
        <CtaButton href="/app" className="px-5 py-2 text-[13px]">Open the app</CtaButton>
      </div>
    </header>
  );
}

export function Hero() {
  return (
    <section id="top" className="paper-glow relative overflow-hidden">
      <div className="mx-auto w-full max-w-6xl px-5 pt-16 pb-20 md:px-8 md:pt-24 md:pb-28">
        <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:gap-16">
          <div className="animate-rise">
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-surface-raised px-3 py-1.5 text-[11.5px] font-medium text-muted-foreground">
              <StatusDot tone="attention" />
              The operating layer for your household
            </span>
            <h1 className="font-display mt-6 text-[2.75rem] leading-[1.02] font-semibold tracking-tight text-balance sm:text-6xl">
              Life asks. <span className="text-primary">Daylatch handles.</span>
            </h1>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg">
              Bills, forms, appointments, documents, renewals, deadlines and everyday
              responsibilities — Daylatch keeps track of what matters, who owns it, and what needs
              to happen next.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <CtaButton href="/app">Open the app</CtaButton>
              <CtaButton variant="ghost" href="#how">
                See how it works
              </CtaButton>
            </div>
            <p className="mt-6 text-[12.5px] text-muted-foreground">
              Nothing sensitive happens without your approval.
            </p>
          </div>

          <div className="animate-rise [animation-delay:120ms]">
            <CommandCenter />
          </div>
        </div>
      </div>
    </section>
  );
}

const noise = [
  "Renewal notice · Email",
  "School circular · WhatsApp",
  "Electricity bill · PDF",
  "Clinic reminder · SMS",
  "Warranty receipt · Photo",
  "Society notice · WhatsApp",
  "Passport appointment · Email",
  "Rent agreement · Document",
];

export function Problem() {
  return (
    <Section id="problem">
      <SectionHeading
        eyebrow="The problem"
        title="The work of running a household is everywhere."
        body="Messages, bills, forms, documents, appointments and deadlines arrive in eight different places. Nobody is quite sure what is handled, what is pending, and whose turn it is."
      />
      <div className="mt-10 flex flex-wrap gap-2.5">
        {noise.map((n) => (
          <span
            key={n}
            className="rounded-lg border border-border bg-surface-raised px-3.5 py-2 text-[12.5px] text-muted-foreground"
          >
            {n}
          </span>
        ))}
      </div>
      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        {[
          ["Scattered", "Across inboxes, chats, drawers and memory."],
          ["Unowned", "Everyone assumes someone else is on it."],
          ["Quietly late", "The cost shows up after the deadline passes."],
        ].map(([t, d]) => (
          <div key={t} className="rounded-xl border border-border bg-surface-raised p-5">
            <p className="text-sm font-semibold">{t}</p>
            <p className="mt-1.5 text-[13px] leading-relaxed text-muted-foreground">{d}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}

export function Product() {
  const stats = [
    ["Needs attention", "3 items", "attention"],
    ["Waiting", "2 items", "waiting"],
    ["Coming up", "5 items", "neutral"],
    ["Recently handled", "8 items", "handled"],
  ] as const;

  const categories = [
    "Home",
    "Money",
    "Family",
    "School",
    "Health",
    "Travel",
    "Documents",
    "Services",
  ];

  return (
    <Section id="how" className="bg-surface">
      <SectionHeading
        eyebrow="The product"
        title="Your household, understood."
        body="One calm surface over everything the household owes, owns and is waiting on."
      />
      <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map(([label, value, tone]) => (
          <div key={label} className="rounded-xl border border-border bg-surface-raised p-5">
            <p className="flex items-center gap-2 text-[12px] text-muted-foreground">
              <StatusDot tone={tone} />
              {label}
            </p>
            <p className="font-display mt-3 text-2xl font-semibold tracking-tight">{value}</p>
          </div>
        ))}
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {categories.map((c) => (
          <span
            key={c}
            className="rounded-full border border-border bg-surface-raised px-3.5 py-1.5 text-[12.5px] text-muted-foreground"
          >
            {c}
          </span>
        ))}
      </div>
    </Section>
  );
}

export function Intelligence() {
  const rows = [
    ["What", "Car insurance renewal", "A responsibility, not a to-do — policy, quote, deadline and decision in one thread."],
    ["Who", "Dad", "Every responsibility has one clear owner, visible to the whole household."],
    ["When", "Sep 14", "Daylatch knows when it starts mattering, not just when it is due."],
    ["Next step", "Review renewal quote", "Always one concrete move, already prepared."],
  ];

  return (
    <Section id="intelligence">
      <div className="grid gap-12 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-16">
        <div>
          <SectionHeading
            eyebrow="Core intelligence"
            title="It knows what matters."
            body="A task is “buy milk.” A responsibility is “keep the household's car insurance current.” Daylatch is built around responsibilities."
          />
        </div>
        <div className="divide-y divide-border rounded-2xl border border-border bg-surface-raised shadow-card">
          {rows.map(([k, v, d]) => (
            <div key={k} className="grid gap-1 p-5 sm:grid-cols-[110px_minmax(0,1fr)] sm:gap-5">
              <p className="eyebrow pt-1">{k}</p>
              <div>
                <p className="text-sm font-semibold">{v}</p>
                <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">{d}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}

export function Coordination() {
  const people = [
    {
      name: "Mom",
      role: "3 responsibilities",
      items: [
        { title: "School permission form", meta: "Due tomorrow", status: "Signature required", tone: "attention" as const },
        { title: "Pediatric check-up", meta: "Sep 9", status: "Scheduled", tone: "neutral" as const },
      ],
    },
    {
      name: "Dad",
      role: "4 responsibilities",
      items: [
        { title: "Car insurance renewal", meta: "Sep 14", status: "Needs decision", tone: "attention" as const },
        { title: "Society maintenance", meta: "Sep 1", status: "Waiting on invoice", tone: "waiting" as const },
      ],
    },
  ];

  return (
    <Section id="coordination" className="bg-surface">
      <SectionHeading
        eyebrow="Coordination"
        title="Everyone knows what they own."
        body="Received → Understood → Assigned → In progress → Waiting → Follow-up → Done. Real household admin lives in the middle, so Daylatch makes the middle visible."
      />
      <div className="mt-10 grid gap-4 lg:grid-cols-3">
        {people.map((p) => (
          <div key={p.name} className="rounded-2xl border border-border bg-surface-raised p-5 shadow-card">
            <div className="flex items-center gap-2.5">
              <Avatar name={p.name} className="size-8 text-[11px]" />
              <div>
                <p className="text-sm font-semibold">{p.name}</p>
                <p className="text-[11.5px] text-muted-foreground">{p.role}</p>
              </div>
            </div>
            <div className="mt-4 space-y-3">
              {p.items.map((i) => (
                <div key={i.title} className="rounded-xl border border-border/80 p-3.5">
                  <p className="text-[13px] font-medium">{i.title}</p>
                  <p className="mt-0.5 text-[11.5px] text-muted-foreground">Due {i.meta}</p>
                  <Chip tone={i.tone} className="mt-2.5">
                    {i.status}
                  </Chip>
                </div>
              ))}
            </div>
          </div>
        ))}

        <div className="rounded-2xl border border-border bg-surface-raised p-5 shadow-card">
          <p className="flex items-center gap-2 text-[11px] font-semibold tracking-wide uppercase">
            <StatusDot tone="waiting" /> Waiting on others
          </p>
          <div className="mt-4 space-y-3">
            {[
              ["Insurance provider", "Response expected Sep 3"],
              ["School", "Confirmation pending"],
              ["Service centre", "Callback promised Sep 4"],
            ].map(([t, m]) => (
              <div key={t} className="rounded-xl border border-border/80 p-3.5">
                <p className="text-[13px] font-medium">{t}</p>
                <p className="mt-0.5 text-[11.5px] text-muted-foreground">{m}</p>
              </div>
            ))}
          </div>
          <p className="mt-4 text-[12px] leading-relaxed text-muted-foreground">
            Daylatch remembers the follow-up you would otherwise forget.
          </p>
        </div>
      </div>
    </Section>
  );
}

export function ActionFlow() {
  const steps = [
    ["Understand", "Reads the message, bill or document and works out what it really is."],
    ["Prepare", "Gathers the policy, the quote, the form and the deadline into one place."],
    ["Ask", "Brings you a single decision with everything you need to make it."],
    ["Approve", "You confirm. Nothing sensitive moves before that."],
    ["Act", "The next step gets done, and the household keeps the record."],
  ];

  return (
    <Section id="action">
      <SectionHeading
        eyebrow="Action"
        title="From reminder to ready-to-do."
        body="Most apps tell you something is due. Daylatch has the work prepared by the time you look."
      />
      <ol className="mt-10 grid gap-3 md:grid-cols-5">
        {steps.map(([t, d], i) => (
          <li key={t} className="rounded-xl border border-border bg-surface-raised p-5">
            <span className="font-display text-sm font-semibold text-primary">
              {String(i + 1).padStart(2, "0")}
            </span>
            <p className="mt-2 text-sm font-semibold">{t}</p>
            <p className="mt-1.5 text-[12.5px] leading-relaxed text-muted-foreground">{d}</p>
          </li>
        ))}
      </ol>
    </Section>
  );
}

export function Trust() {
  return (
    <Section id="trust" className="bg-surface">
      <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
        <SectionHeading
          eyebrow="Trust"
          title="AI proposes. You decide."
          body="Daylatch can understand, organise and prepare the work. You remain in control of anything sensitive — payments, signatures, submissions and replies."
        />
        <div className="rounded-2xl border border-border bg-surface-raised p-6 shadow-card">
          <p className="eyebrow">Prepared for your approval</p>
          <p className="font-display mt-3 text-xl font-semibold tracking-tight">
            Car insurance renewal
          </p>
          <div className="mt-4 grid grid-cols-2 gap-x-6 gap-y-3 text-[13px]">
            <div>
              <p className="text-muted-foreground">Amount</p>
              <p className="font-medium">₹18,400</p>
            </div>
            <div>
              <p className="text-muted-foreground">Expires</p>
              <p className="font-medium">Sep 14</p>
            </div>
            <div>
              <p className="text-muted-foreground">Owner</p>
              <p className="font-medium">Dad</p>
            </div>
            <div>
              <p className="text-muted-foreground">Prepared</p>
              <p className="font-medium">Quote + policy attached</p>
            </div>
          </div>
          <div className="mt-6 flex flex-wrap items-center gap-3 border-t border-border pt-5">
            <span className="rounded-full bg-primary px-5 py-2.5 text-[13px] font-medium text-primary-foreground">
              Approve
            </span>
            <span className="rounded-full border border-border px-5 py-2.5 text-[13px] font-medium">
              Not yet
            </span>
            <span className="text-[12px] text-muted-foreground">
              Daylatch waits until you say so.
            </span>
          </div>
        </div>
      </div>
    </Section>
  );
}

export function Capture() {
  const sources = ["WhatsApp", "Email", "PDF", "Photo", "Voice", "Text"];
  return (
    <Section id="capture">
      <SectionHeading
        eyebrow="Capture"
        title="Send anything to Daylatch."
        body="Forward it, paste it, photograph it or say it. Daylatch works out the rest."
      />
      <div className="mt-10 grid items-stretch gap-4 lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)]">
        <div className="rounded-2xl border border-border bg-surface-raised p-6 shadow-card">
          <div className="flex flex-wrap gap-2">
            {sources.map((s) => (
              <span
                key={s}
                className="rounded-full border border-border px-3 py-1 text-[12px] text-muted-foreground"
              >
                {s}
              </span>
            ))}
          </div>
          <div className="mt-5 rounded-xl border border-dashed border-input bg-surface p-4">
            <p className="text-[13px] leading-relaxed text-muted-foreground">
              “Your car insurance for MH‑02‑8841 expires on Sept 14. Renewal premium is ₹18,400.
              Renew online to avoid a break in cover.”
            </p>
          </div>
        </div>

        <div className="flex items-center justify-center text-muted-foreground lg:px-2">
          <span className="hidden text-lg lg:inline">→</span>
          <span className="text-lg lg:hidden">↓</span>
        </div>

        <div className="rounded-2xl border border-border bg-surface-raised p-6 shadow-card">
          <p className="eyebrow">Daylatch understood</p>
          <p className="font-display mt-3 text-xl font-semibold tracking-tight">
            Car insurance renewal
          </p>
          <div className="mt-4 space-y-2 text-[13px]">
            {[
              ["Amount", "₹18,400"],
              ["When", "Sep 14"],
              ["Owner", "Dad"],
              ["Next step", "Review renewal"],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between border-b border-border/70 pb-2">
                <span className="text-muted-foreground">{k}</span>
                <span className="font-medium">{v}</span>
              </div>
            ))}
          </div>
          <span className="mt-5 inline-flex rounded-full bg-primary px-5 py-2.5 text-[13px] font-medium text-primary-foreground">
            Review
          </span>
        </div>
      </div>
    </Section>
  );
}

export function Outcomes() {
  const items = [
    ["Less mental load", "You don't have to remember everything."],
    ["Shared responsibility", "Everyone knows what they own."],
    ["Confidence", "Important things don't quietly fall through the cracks."],
  ];
  return (
    <Section className="bg-surface">
      <div className="grid gap-8 md:grid-cols-3">
        {items.map(([t, d]) => (
          <div key={t}>
            <h3 className="font-display text-xl font-semibold tracking-tight">{t}</h3>
            <p className="mt-2 text-[14px] leading-relaxed text-muted-foreground">{d}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}

export function FinalCta() {
  return (
    <Section className="paper-glow">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="font-display text-3xl leading-[1.08] font-semibold tracking-tight text-balance md:text-5xl">
          Put your household on autopilot — without giving up control.
        </h2>
        <p className="mt-5 text-base text-muted-foreground md:text-lg">
          Daylatch keeps track of what matters, who owns it, and what happens next. You stay the one
          who decides.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <CtaButton href="/app">Open the app</CtaButton>
          <CtaButton variant="ghost" href="#how">
            See how it works
          </CtaButton>
        </div>
      </div>
    </Section>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-border py-10">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 px-5 text-[12.5px] text-muted-foreground md:flex-row md:items-center md:justify-between md:px-8">
        <div className="flex items-center gap-2">
          <span className="size-3 rounded-[4px] bg-primary" />
          <span className="font-display text-sm font-semibold text-foreground">Daylatch</span>
        </div>
        <p>The operating layer for household administration.</p>
      </div>
    </footer>
  );
}
