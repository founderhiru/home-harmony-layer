import { useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Avatar, StatusDot } from "./primitives";
import {
  CATEGORY_LABEL,
  CURRENT_USER,
  HOUSEHOLD_NAME,
  MEMBERS,
  OWNERS,
  UNASSIGNED,
  classify,
  useItems,
  type Activity,
  type Draft,
  type Item,
} from "@/lib/daylatch-store";
import { cn } from "@/lib/utils";

type Screen = "home" | "household" | "activity";

function greeting() {
  const h = new Date().getHours();
  return h < 12 ? "Good morning" : h < 17 ? "Good afternoon" : "Good evening";
}

/* ---------------------------------- rows --------------------------------- */

function Row({ item, onOpen }: { item: Item; onOpen: () => void }) {
  return (
    <button
      onClick={onOpen}
      className="w-full rounded-2xl border border-border bg-surface-raised px-4 py-3.5 text-left shadow-card transition-transform active:scale-[0.985]"
    >
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
        <div className="min-w-0">
          <p
            className={cn(
              "truncate text-[15px] font-medium",
              item.status === "handled" && "text-muted-foreground line-through decoration-border",
            )}
          >
            {item.title}
          </p>
          <p className="mt-0.5 truncate text-[12.5px] text-muted-foreground">
            {[item.amount, item.due ? `Due ${item.due}` : null].filter(Boolean).join(" · ") ||
              item.meta}
          </p>
          <p className="mt-2 flex items-center gap-1.5 text-[12px] text-muted-foreground">
            <Avatar name={item.owner === UNASSIGNED ? "?" : item.owner} />
            {item.owner}
          </p>
        </div>
        <span className="text-muted-foreground">→</span>
      </div>
    </button>
  );
}

function GroupHeader({ label, count }: { label: string; count?: number }) {
  return (
    <div className="flex items-center justify-between px-1">
      <p className="text-[11px] font-semibold tracking-[0.14em] text-muted-foreground uppercase">
        {label}
      </p>
      {count !== undefined ? (
        <span className="font-display text-[15px] font-semibold">{count}</span>
      ) : null}
    </div>
  );
}

/* --------------------------------- capture -------------------------------- */

function Capture({
  onClose,
  onSave,
}: {
  onClose: () => void;
  onSave: (draft: Draft) => void;
}) {
  const [text, setText] = useState("");
  const [draft, setDraft] = useState<Draft | null>(null);

  if (draft) {
    return (
      <div className="flex min-h-full flex-col px-6 pt-8 pb-10">
        <button onClick={() => setDraft(null)} className="text-[13px] text-muted-foreground">
          ←
        </button>
        <p className="eyebrow mt-6">I understood this as</p>
        <h2 className="font-display mt-2 text-[26px] leading-tight font-semibold tracking-tight">
          {draft.title}
        </h2>

        <dl className="mt-5 space-y-2.5 border-y border-border py-5 text-[14px]">
          {draft.amount ? <Field label="Amount" value={draft.amount} /> : null}
          <Field label="Category" value={CATEGORY_LABEL[draft.category]} />
          <Field label="Domain" value={draft.domain} />
          <Field label="Due" value={draft.due ?? "No date"} />
          <Field label="Next step" value={draft.nextStep} />
        </dl>

        <p className="mt-6 text-[13px] text-muted-foreground">Who should handle this?</p>
        <div className="mt-3 space-y-2">
          {OWNERS.map((o) => (
            <button
              key={o}
              onClick={() => setDraft({ ...draft, owner: o })}
              className={cn(
                "w-full rounded-2xl border px-4 py-3 text-left text-[14px] transition-colors",
                draft.owner === o
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-surface-raised",
              )}
            >
              {o}
            </button>
          ))}
        </div>

        <button
          onClick={() => onSave(draft)}
          className="mt-8 w-full rounded-full bg-primary px-5 py-3.5 text-[15px] font-medium text-primary-foreground shadow-card"
        >
          Save
        </button>
        <p className="mt-3 text-center text-[12px] text-muted-foreground">
          Nothing is created until you save.
        </p>
      </div>
    );
  }

  return (
    <div className="flex min-h-full flex-col px-6 pt-8 pb-10">
      <button onClick={onClose} className="text-[13px] text-muted-foreground">
        Cancel
      </button>
      <h2 className="font-display mt-8 text-[28px] leading-tight font-semibold tracking-tight">
        What&apos;s on your plate?
      </h2>
      <p className="mt-2 text-[14px] text-muted-foreground">
        Tell Daylatch what needs to happen.
      </p>
      <textarea
        autoFocus
        rows={5}
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Electricity bill ₹4,820 due next Friday"
        className="mt-6 w-full resize-none rounded-2xl border border-input bg-surface-raised px-4 py-4 text-[15px] leading-relaxed outline-none focus:border-ring"
      />
      <button
        disabled={!text.trim()}
        onClick={() => setDraft(classify(text))}
        className="mt-6 w-full rounded-full bg-primary px-5 py-3.5 text-[15px] font-medium text-primary-foreground shadow-card disabled:opacity-40"
      >
        Understand →
      </button>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-[92px_minmax(0,1fr)] gap-3">
      <dt className="text-[12.5px] text-muted-foreground">{label}</dt>
      <dd className="text-[14px]">{value}</dd>
    </div>
  );
}

/* ------------------------------ responsibility ---------------------------- */

function Responsibility({
  item,
  onBack,
  onAssign,
  onComplete,
  onReopen,
}: {
  item: Item;
  onBack: () => void;
  onAssign: (owner: string) => void;
  onComplete: () => void;
  onReopen: () => void;
}) {
  const [assigning, setAssigning] = useState(false);
  return (
    <div className="flex min-h-full flex-col px-6 pt-8 pb-12">
      <button onClick={onBack} className="w-fit text-[16px] text-muted-foreground">
        ←
      </button>

      <h2 className="font-display mt-8 text-[28px] leading-tight font-semibold tracking-tight text-balance">
        {item.title}
      </h2>
      {item.amount ? (
        <p className="font-display mt-2 text-[22px] font-semibold text-primary">{item.amount}</p>
      ) : null}
      <p className="mt-3 text-[14px] text-muted-foreground">
        {item.due ? `Due ${item.due}` : "No due date"}
      </p>
      <p className="text-[14px] text-muted-foreground">{item.domain}</p>

      <div className="mt-7 border-t border-border pt-6">
        {assigning ? (
          <div className="space-y-2">
            {OWNERS.map((o) => (
              <button
                key={o}
                onClick={() => {
                  onAssign(o);
                  setAssigning(false);
                }}
                className={cn(
                  "w-full rounded-2xl border px-4 py-3 text-left text-[14px]",
                  item.owner === o
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-surface-raised",
                )}
              >
                {o}
              </button>
            ))}
          </div>
        ) : (
          <button onClick={() => setAssigning(true)} className="flex items-center gap-2 text-left">
            <Avatar name={item.owner === UNASSIGNED ? "?" : item.owner} />
            <span className="text-[15px] font-medium">
              {item.owner === UNASSIGNED ? "Nobody is responsible yet" : `${item.owner} is responsible`}
            </span>
          </button>
        )}
      </div>

      <div className="mt-7 border-t border-border pt-6">
        <p className="eyebrow">Next step</p>
        <p className="mt-2 text-[16px] leading-relaxed">{item.nextStep}</p>
      </div>

      <p className="mt-7 border-t border-border pt-6 text-[12.5px] text-muted-foreground">
        Added{" "}
        {new Date(item.createdAt).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
        {item.completedAt
          ? ` · Completed ${new Date(item.completedAt).toLocaleDateString(undefined, { month: "short", day: "numeric" })}`
          : ""}
      </p>

      <div className="mt-auto pt-10">
        {item.status === "handled" ? (
          <button
            onClick={onReopen}
            className="w-full rounded-full border border-border px-5 py-3.5 text-[15px] font-medium"
          >
            Reopen
          </button>
        ) : (
          <button
            onClick={onComplete}
            className="w-full rounded-full bg-primary px-5 py-3.5 text-[15px] font-medium text-primary-foreground shadow-card"
          >
            Mark complete
          </button>
        )}
      </div>
    </div>
  );
}

/* ---------------------------------- app ---------------------------------- */

export function MobileApp() {
  const { items, activity, create, assign, complete, reopen, reset } = useItems();
  const [screen, setScreen] = useState<Screen>("home");
  const [captureOpen, setCaptureOpen] = useState(false);
  const [openId, setOpenId] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const active = items.find((i) => i.id === openId) ?? null;

  function flash(msg: string) {
    setToast(msg);
    window.setTimeout(() => setToast(null), 2200);
  }

  const open = items.filter((i) => i.status !== "handled");
  const attention = open.filter((i) => i.status === "attention");
  const waiting = open.filter((i) => i.status === "waiting");
  const unassigned = attention.filter((i) => i.owner === UNASSIGNED);
  const mine = attention.filter((i) => i.owner === CURRENT_USER);
  const others = attention.filter((i) => i.owner !== CURRENT_USER && i.owner !== UNASSIGNED);

  const summary = useMemo(() => {
    const lines: string[] = [];
    if (mine.length) lines.push(`${mine.length} need${mine.length === 1 ? "s" : ""} you`);
    const byOwner = new Map<string, number>();
    others.forEach((i) => byOwner.set(i.owner, (byOwner.get(i.owner) ?? 0) + 1));
    byOwner.forEach((n, owner) => lines.push(`${n} need${n === 1 ? "s" : ""} ${owner}`));
    if (unassigned.length) lines.push(`${unassigned.length} unassigned`);
    if (waiting.length) lines.push(`${waiting.length} waiting on others`);
    return lines;
  }, [mine.length, others, unassigned.length, waiting.length]);

  if (active) {
    return (
      <Shell>
        <Responsibility
          item={active}
          onBack={() => setOpenId(null)}
          onAssign={(o) => {
            assign(active.id, o);
            flash(o === UNASSIGNED ? "Left unassigned." : `${o} is now responsible.`);
          }}
          onComplete={() => {
            complete(active.id);
            setOpenId(null);
            flash("Marked complete.");
          }}
          onReopen={() => {
            reopen(active.id);
            flash("Reopened.");
          }}
        />
        <Toast msg={toast} />
      </Shell>
    );
  }

  if (captureOpen) {
    return (
      <Shell>
        <Capture
          onClose={() => setCaptureOpen(false)}
          onSave={(draft) => {
            create(draft);
            setCaptureOpen(false);
            setScreen("home");
            flash("Added to your household.");
          }}
        />
        <Toast msg={toast} />
      </Shell>
    );
  }

  return (
    <Shell>
      <header className="sticky top-0 z-30 bg-background/92 px-6 pt-[calc(env(safe-area-inset-top)+16px)] pb-3 backdrop-blur">
        <div className="flex items-center justify-between">
          <p className="text-[12px] font-semibold tracking-[0.18em] text-muted-foreground uppercase">
            Daylatch
          </p>
          <Avatar name={CURRENT_USER} className="size-7 text-[11px]" />
        </div>
      </header>

      <main className="flex-1 space-y-8 px-6 pt-4 pb-40">
        {screen === "home" && (
          <>
            <div>
              <p className="text-[14px] text-muted-foreground">{greeting()}</p>
              <h1 className="font-display mt-1 text-[27px] leading-[1.15] font-semibold tracking-tight text-balance">
                {attention.length
                  ? `Your household has ${attention.length} thing${attention.length === 1 ? "" : "s"} needing attention.`
                  : "Your household is in good shape."}
              </h1>
              {summary.length ? (
                <ul className="mt-3 space-y-1">
                  {summary.map((l) => (
                    <li key={l} className="flex items-center gap-2 text-[13.5px] text-muted-foreground">
                      <StatusDot tone="attention" /> {l}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-3 text-[13.5px] text-muted-foreground">Nothing is overdue.</p>
              )}
            </div>

            <section>
              <GroupHeader label="Needs attention" count={attention.length} />
              <div className="mt-3 space-y-2.5">
                {attention.length ? (
                  [...mine, ...unassigned, ...others].map((i) => (
                    <Row key={i.id} item={i} onOpen={() => setOpenId(i.id)} />
                  ))
                ) : (
                  <Empty>Nothing needs you right now.</Empty>
                )}
              </div>
            </section>

            <section className="border-t border-border pt-7">
              <GroupHeader label="Waiting" count={waiting.length} />
              <div className="mt-3 space-y-2.5">
                {waiting.length ? (
                  waiting.map((i) => <Row key={i.id} item={i} onOpen={() => setOpenId(i.id)} />)
                ) : (
                  <Empty>Nothing is waiting on anyone.</Empty>
                )}
              </div>
            </section>
          </>
        )}

        {screen === "household" && (
          <>
            <div>
              <p className="eyebrow">Household</p>
              <h1 className="font-display mt-2 text-[27px] leading-tight font-semibold tracking-tight">
                {HOUSEHOLD_NAME}
              </h1>
              <p className="mt-1 text-[13.5px] text-muted-foreground">{MEMBERS.length} members</p>
            </div>

            <div className="space-y-3">
              {MEMBERS.map((m) => {
                const n = open.filter((i) => i.owner === m).length;
                return (
                  <div key={m} className="flex items-center gap-3 rounded-2xl border border-border bg-surface-raised px-4 py-3.5 shadow-card">
                    <Avatar name={m} className="size-8 text-[12px]" />
                    <div>
                      <p className="text-[15px] font-medium">{m}</p>
                      <p className="text-[12.5px] text-muted-foreground">
                        {n} thing{n === 1 ? "" : "s"}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            <section className="border-t border-border pt-7">
              <GroupHeader label="Who has what" />
              <div className="mt-4 space-y-6">
                {[...MEMBERS, UNASSIGNED].map((m) => {
                  const owned = open.filter((i) => i.owner === m);
                  if (!owned.length) return null;
                  return (
                    <div key={m}>
                      <p className="text-[14px] font-medium">{m}</p>
                      <ul className="mt-1.5 space-y-1.5">
                        {owned.map((i) => (
                          <li key={i.id}>
                            <button
                              onClick={() => setOpenId(i.id)}
                              className="text-left text-[13.5px] text-muted-foreground"
                            >
                              {i.title}
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                })}
              </div>
            </section>

            <div className="flex gap-2 border-t border-border pt-6">
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
          </>
        )}

        {screen === "activity" && <ActivityFeed activity={activity} />}
      </main>

      <nav className="fixed inset-x-0 bottom-0 z-40 mx-auto grid w-full max-w-md grid-cols-3 items-center border-t border-border bg-background/95 px-8 pt-2.5 pb-[calc(env(safe-area-inset-bottom)+12px)] backdrop-blur">
        <TabButton label="Home" activeTab={screen === "home"} onClick={() => setScreen("home")} />
        <div className="flex justify-center">
          <button
            onClick={() => setCaptureOpen(true)}
            aria-label="Capture something new"
            className="-mt-8 flex size-14 items-center justify-center rounded-full bg-primary text-[24px] leading-none text-primary-foreground shadow-float transition-transform active:scale-95"
          >
            ＋
          </button>
        </div>
        <div className="grid grid-cols-2">
          <TabButton
            label="House"
            activeTab={screen === "household"}
            onClick={() => setScreen("household")}
          />
          <TabButton
            label="Activity"
            activeTab={screen === "activity"}
            onClick={() => setScreen("activity")}
          />
        </div>
      </nav>

      <Toast msg={toast} />
    </Shell>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto flex min-h-screen w-full max-w-md flex-col bg-background">{children}</div>
  );
}

function TabButton({
  label,
  activeTab,
  onClick,
}: {
  label: string;
  activeTab: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "text-[11.5px] font-medium tracking-wide transition-colors",
        activeTab ? "text-foreground" : "text-muted-foreground",
      )}
    >
      {label}
    </button>
  );
}

function Empty({ children }: { children: React.ReactNode }) {
  return (
    <p className="rounded-2xl border border-dashed border-border px-4 py-6 text-center text-[13px] text-muted-foreground">
      {children}
    </p>
  );
}

function Toast({ msg }: { msg: string | null }) {
  if (!msg) return null;
  return (
    <div className="animate-rise fixed inset-x-0 bottom-28 z-50 mx-auto w-fit max-w-[90%] rounded-full bg-foreground px-4 py-2 text-[12.5px] text-background shadow-float">
      {msg}
    </div>
  );
}

function ActivityFeed({ activity }: { activity: Activity[] }) {
  const groups = useMemo(() => {
    const map = new Map<string, Activity[]>();
    const today = new Date().toDateString();
    const yesterday = new Date(Date.now() - 8.64e7).toDateString();
    [...activity]
      .sort((a, b) => b.ts - a.ts)
      .forEach((a) => {
        const d = new Date(a.ts).toDateString();
        const label =
          d === today
            ? "Today"
            : d === yesterday
              ? "Yesterday"
              : new Date(a.ts).toLocaleDateString(undefined, { month: "long", day: "numeric" });
        map.set(label, [...(map.get(label) ?? []), a]);
      });
    return [...map.entries()];
  }, [activity]);

  return (
    <>
      <div>
        <p className="eyebrow">Activity</p>
        <h1 className="font-display mt-2 text-[27px] leading-tight font-semibold tracking-tight">
          What your household has been doing
        </h1>
      </div>
      {groups.length ? (
        groups.map(([label, entries]) => (
          <section key={label}>
            <GroupHeader label={label} />
            <ul className="mt-3 space-y-4 border-l border-border pl-4">
              {entries.map((a) => (
                <li key={a.id}>
                  <p className="text-[14px]">
                    <span className="font-medium">{a.actor}</span>{" "}
                    <span className="text-muted-foreground">{a.verb}</span>
                  </p>
                  <p className="text-[13.5px] text-muted-foreground">{a.subject}</p>
                </li>
              ))}
            </ul>
          </section>
        ))
      ) : (
        <Empty>Nothing has happened yet.</Empty>
      )}
    </>
  );
}
