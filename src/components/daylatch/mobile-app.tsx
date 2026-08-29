import { useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Avatar, Chip, StatusDot } from "./primitives";
import { CATEGORY_LABEL, OWNERS, useItems, type Item, type Status } from "@/lib/daylatch-store";
import { cn } from "@/lib/utils";

type Tab = "today" | "waiting" | "approvals" | "household";

const TABS: { id: Tab; label: string; glyph: string }[] = [
  { id: "today", label: "Today", glyph: "◎" },
  { id: "waiting", label: "Waiting", glyph: "◔" },
  { id: "approvals", label: "Approvals", glyph: "✓" },
  { id: "household", label: "House", glyph: "⌂" },
];

function statusLabel(s: Status) {
  return s === "attention" ? "Needs attention" : s === "waiting" ? "Waiting" : "Handled";
}

function ItemCard({ item, onOpen }: { item: Item; onOpen: () => void }) {
  return (
    <button
      onClick={onOpen}
      className="w-full rounded-2xl border border-border bg-surface-raised px-4 py-3.5 text-left shadow-card transition-transform active:scale-[0.985]"
    >
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
        <div className="min-w-0">
          <p className="flex items-center gap-2 text-[11px] font-semibold tracking-wide text-muted-foreground uppercase">
            <StatusDot tone={item.status} />
            {CATEGORY_LABEL[item.category]}
          </p>
          <p
            className={cn(
              "mt-1.5 truncate text-[15px] font-medium",
              item.status === "handled" && "text-muted-foreground line-through decoration-border",
            )}
          >
            {item.title}
          </p>
          <p className="mt-0.5 truncate text-[12.5px] text-muted-foreground">{item.meta}</p>
        </div>
        <span className="flex shrink-0 flex-col items-end gap-1.5">
          <Avatar name={item.owner} />
          {item.due ? <span className="text-[11px] text-muted-foreground">{item.due}</span> : null}
        </span>
      </div>
      {item.proposal && !item.approved && item.status === "attention" ? (
        <p className="mt-3 rounded-xl bg-secondary/70 px-3 py-2 text-[12px] text-secondary-foreground">
          Daylatch suggests: {item.proposal}
        </p>
      ) : null}
    </button>
  );
}

function Sheet({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      <div className="absolute inset-0 bg-foreground/35 backdrop-blur-[2px]" onClick={onClose} />
      <div className="animate-rise relative max-h-[86vh] w-full max-w-md overflow-y-auto rounded-t-3xl border border-border bg-surface-raised p-5 pb-8 shadow-float">
        <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-border" />
        <div className="flex items-center justify-between">
          <h2 className="font-display text-lg font-semibold tracking-tight">{title}</h2>
          <button
            onClick={onClose}
            className="rounded-full border border-border px-3 py-1 text-[12px] text-muted-foreground"
          >
            Close
          </button>
        </div>
        <div className="mt-4">{children}</div>
      </div>
    </div>
  );
}

export function MobileApp() {
  const { items, add, update, remove, reset } = useItems();
  const [tab, setTab] = useState<Tab>("today");
  const [captureOpen, setCaptureOpen] = useState(false);
  const [draft, setDraft] = useState("");
  const [openId, setOpenId] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const active = items.find((i) => i.id === openId) ?? null;

  const counts = useMemo(
    () => ({
      attention: items.filter((i) => i.status === "attention").length,
      waiting: items.filter((i) => i.status === "waiting").length,
      approvals: items.filter((i) => i.status === "attention" && i.proposal && !i.approved).length,
    }),
    [items],
  );

  function flash(msg: string) {
    setToast(msg);
    window.setTimeout(() => setToast(null), 2200);
  }

  function submitCapture() {
    const text = draft.trim();
    if (!text) return;
    const item = add(text);
    setDraft("");
    setCaptureOpen(false);
    flash(`Captured as ${CATEGORY_LABEL[item.category].toLowerCase()} — nothing sent yet.`);
  }

  const attention = items.filter((i) => i.status === "attention");
  const waiting = items.filter((i) => i.status === "waiting");
  const handled = items.filter((i) => i.status === "handled");
  const approvals = items.filter((i) => i.status === "attention" && i.proposal && !i.approved);

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-md flex-col bg-background">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-border/80 bg-background/90 px-5 pt-[calc(env(safe-area-inset-top)+14px)] pb-3 backdrop-blur">
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
          <div className="min-w-0">
            <p className="text-[11px] font-semibold tracking-[0.16em] text-muted-foreground uppercase">
              Daylatch
            </p>
            <h1 className="font-display truncate text-[22px] leading-tight font-semibold tracking-tight">
              {tab === "today"
                ? counts.attention
                  ? `${counts.attention} things need you`
                  : "You're all clear"
                : tab === "waiting"
                  ? "Waiting on others"
                  : tab === "approvals"
                    ? "Approve before it happens"
                    : "Your household"}
            </h1>
          </div>
          <span className="flex shrink-0 -space-x-1.5">
            <Avatar name="Mom" />
            <Avatar name="Dad" />
            <Avatar name="Ira" />
          </span>
        </div>
      </header>

      <main className="flex-1 space-y-6 px-5 pt-5 pb-40">
        {tab === "today" && (
          <>
            <Group title="Needs attention" tone="attention" count={attention.length}>
              {attention.map((i) => (
                <ItemCard key={i.id} item={i} onOpen={() => setOpenId(i.id)} />
              ))}
            </Group>
            <Group title="Recently handled" tone="handled" count={handled.length}>
              {handled.slice(0, 4).map((i) => (
                <ItemCard key={i.id} item={i} onOpen={() => setOpenId(i.id)} />
              ))}
            </Group>
          </>
        )}

        {tab === "waiting" && (
          <Group title="Waiting" tone="waiting" count={waiting.length}>
            {waiting.map((i) => (
              <ItemCard key={i.id} item={i} onOpen={() => setOpenId(i.id)} />
            ))}
          </Group>
        )}

        {tab === "approvals" && (
          <Group title="Needs your approval" tone="attention" count={approvals.length}>
            {approvals.map((i) => (
              <div
                key={i.id}
                className="rounded-2xl border border-border bg-surface-raised p-4 shadow-card"
              >
                <p className="text-[15px] font-medium">{i.title}</p>
                <p className="mt-1 text-[12.5px] text-muted-foreground">{i.proposal}</p>
                <div className="mt-3 flex gap-2">
                  <button
                    onClick={() => {
                      update(i.id, { approved: true, status: "waiting", meta: "Sent · awaiting confirmation" });
                      flash("Approved. Daylatch is handling it.");
                    }}
                    className="flex-1 rounded-full bg-primary px-4 py-2.5 text-[13px] font-medium text-primary-foreground"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => {
                      update(i.id, { proposal: undefined as unknown as string });
                      flash("Dismissed. Nothing was sent.");
                    }}
                    className="flex-1 rounded-full border border-border px-4 py-2.5 text-[13px] font-medium"
                  >
                    Not now
                  </button>
                </div>
              </div>
            ))}
          </Group>
        )}

        {tab === "household" && (
          <div className="space-y-4">
            {OWNERS.map((owner) => {
              const owned = items.filter((i) => i.owner === owner && i.status !== "handled");
              return (
                <div
                  key={owner}
                  className="rounded-2xl border border-border bg-surface-raised p-4 shadow-card"
                >
                  <div className="flex items-center gap-2">
                    <Avatar name={owner} />
                    <p className="text-[14px] font-medium">{owner}</p>
                    <Chip tone={owned.length ? "attention" : "handled"} className="ml-auto">
                      {owned.length} open
                    </Chip>
                  </div>
                  <div className="mt-2 space-y-1">
                    {owned.length ? (
                      owned.map((i) => (
                        <p key={i.id} className="truncate text-[12.5px] text-muted-foreground">
                          · {i.title}
                        </p>
                      ))
                    ) : (
                      <p className="text-[12.5px] text-muted-foreground">Nothing pending.</p>
                    )}
                  </div>
                </div>
              );
            })}
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => {
                  reset();
                  flash("Demo household restored.");
                }}
                className="flex-1 rounded-full border border-border px-4 py-2.5 text-[13px]"
              >
                Reset demo data
              </button>
              <Link
                to="/"
                className="flex-1 rounded-full border border-border px-4 py-2.5 text-center text-[13px]"
              >
                About Daylatch
              </Link>
            </div>
          </div>
        )}
      </main>

      {/* Capture bar + tab bar */}
      <div className="fixed inset-x-0 bottom-0 z-40 mx-auto w-full max-w-md px-4 pb-[calc(env(safe-area-inset-bottom)+10px)]">
        <button
          onClick={() => setCaptureOpen(true)}
          className="mb-2 flex w-full items-center gap-3 rounded-full border border-dashed border-input bg-surface-raised px-5 py-3 shadow-card"
        >
          <span className="text-base leading-none text-primary">＋</span>
          <span className="text-[13px] text-muted-foreground">Send something to Daylatch</span>
        </button>
        <nav className="grid grid-cols-4 rounded-2xl border border-border bg-surface-raised p-1 shadow-float">
          {TABS.map((t) => {
            const badge =
              t.id === "today" ? counts.attention : t.id === "waiting" ? counts.waiting : t.id === "approvals" ? counts.approvals : 0;
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={cn(
                  "relative rounded-xl py-2 text-[11px] font-medium transition-colors",
                  tab === t.id ? "bg-secondary text-foreground" : "text-muted-foreground",
                )}
              >
                <span className="block text-[15px] leading-none">{t.glyph}</span>
                <span className="mt-1 block">{t.label}</span>
                {badge ? (
                  <span className="absolute top-1 right-3 size-1.5 rounded-full bg-attention" />
                ) : null}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Capture sheet */}
      <Sheet open={captureOpen} onClose={() => setCaptureOpen(false)} title="Capture">
        <textarea
          autoFocus
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          rows={5}
          placeholder="Paste a bill, forward a message, or type what happened…"
          className="w-full resize-none rounded-2xl border border-input bg-surface px-4 py-3 text-[14px] outline-none focus:border-ring"
        />
        <p className="mt-2 text-[12px] text-muted-foreground">
          Daylatch reads it, files it, and proposes what to do. Nothing is sent without your
          approval.
        </p>
        <button
          onClick={submitCapture}
          className="mt-4 w-full rounded-full bg-primary px-5 py-3 text-[14px] font-medium text-primary-foreground"
        >
          Add to household
        </button>
      </Sheet>

      {/* Item detail sheet */}
      <Sheet open={!!active} onClose={() => setOpenId(null)} title={active?.title ?? ""}>
        {active ? (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <Chip tone={active.status}>{statusLabel(active.status)}</Chip>
              <Chip>{CATEGORY_LABEL[active.category]}</Chip>
              {active.due ? <Chip tone="waiting">Due {active.due}</Chip> : null}
            </div>
            <p className="text-[13px] text-muted-foreground">{active.meta}</p>

            <div>
              <p className="eyebrow">Owner</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {OWNERS.map((o) => (
                  <button
                    key={o}
                    onClick={() => update(active.id, { owner: o })}
                    className={cn(
                      "rounded-full border px-3 py-1.5 text-[12.5px]",
                      active.owner === o
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border text-muted-foreground",
                    )}
                  >
                    {o}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="eyebrow">Status</p>
              <div className="mt-2 flex gap-2">
                {(["attention", "waiting", "handled"] as Status[]).map((s) => (
                  <button
                    key={s}
                    onClick={() => update(active.id, { status: s })}
                    className={cn(
                      "flex-1 rounded-full border px-3 py-2 text-[12.5px]",
                      active.status === s
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border text-muted-foreground",
                    )}
                  >
                    {statusLabel(s)}
                  </button>
                ))}
              </div>
            </div>

            {active.proposal ? (
              <div className="rounded-2xl bg-secondary/70 p-4">
                <p className="eyebrow">Proposed action</p>
                <p className="mt-1.5 text-[13.5px]">{active.proposal}</p>
                {active.approved ? (
                  <p className="mt-2 text-[12px] text-handled">Approved by you</p>
                ) : (
                  <button
                    onClick={() => {
                      update(active.id, {
                        approved: true,
                        status: "waiting",
                        meta: "Sent · awaiting confirmation",
                      });
                      setOpenId(null);
                      flash("Approved. Daylatch is handling it.");
                    }}
                    className="mt-3 w-full rounded-full bg-primary px-4 py-2.5 text-[13px] font-medium text-primary-foreground"
                  >
                    Approve and continue
                  </button>
                )}
              </div>
            ) : null}

            <button
              onClick={() => {
                remove(active.id);
                setOpenId(null);
                flash("Removed from your household.");
              }}
              className="w-full rounded-full border border-border px-4 py-2.5 text-[13px] text-muted-foreground"
            >
              Remove
            </button>
          </div>
        ) : null}
      </Sheet>

      {toast ? (
        <div className="animate-rise fixed inset-x-0 bottom-32 z-50 mx-auto w-fit max-w-[90%] rounded-full bg-foreground px-4 py-2 text-[12.5px] text-background shadow-float">
          {toast}
        </div>
      ) : null}
    </div>
  );
}

function Group({
  title,
  tone,
  count,
  children,
}: {
  title: string;
  tone: "attention" | "waiting" | "handled";
  count: number;
  children: React.ReactNode;
}) {
  return (
    <section>
      <div className="flex items-center justify-between px-1">
        <p className="flex items-center gap-2 text-[11px] font-semibold tracking-wide uppercase">
          <StatusDot tone={tone} /> {title}
        </p>
        <Chip tone={tone}>{count}</Chip>
      </div>
      <div className="mt-2.5 space-y-2.5">
        {count ? children : (
          <p className="rounded-2xl border border-dashed border-border px-4 py-6 text-center text-[13px] text-muted-foreground">
            Nothing here right now.
          </p>
        )}
      </div>
    </section>
  );
}
