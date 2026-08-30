import { useCallback, useEffect, useState } from "react";

export type Status = "attention" | "waiting" | "handled";
export type Category = "bill" | "form" | "appointment" | "document" | "renewal";
export type Domain = "Home" | "School" | "Health" | "Vehicle" | "Money" | "Admin";

export type Item = {
  id: string;
  title: string;
  meta: string;
  owner: string;
  status: Status;
  category: Category;
  domain: Domain;
  amount?: string;
  due?: string;
  /** The single next step for whoever owns this. */
  nextStep: string;
  createdAt: number;
  completedAt?: number;
};

export type Activity = {
  id: string;
  ts: number;
  actor: string;
  verb: "completed" | "was assigned" | "added" | "reopened";
  subject: string;
};

export const HOUSEHOLD_NAME = "The Sharma Household";
export const MEMBERS = ["Dad", "Mom", "Child"] as const;
export const UNASSIGNED = "Nobody yet";
export const OWNERS = [...MEMBERS, UNASSIGNED] as const;
/** Who is using the app on this device. */
export const CURRENT_USER = "Mom";

export const CATEGORY_LABEL: Record<Category, string> = {
  bill: "Bill",
  form: "Form",
  appointment: "Appointment",
  document: "Document",
  renewal: "Renewal",
};

const STORAGE_KEY = "daylatch.items.v2";
const ACTIVITY_KEY = "daylatch.activity.v2";

const day = 8.64e7;

const seedItems: Item[] = [
  {
    id: "1",
    title: "School consent form",
    meta: "Signature required",
    owner: "Mom",
    status: "attention",
    category: "form",
    domain: "School",
    due: "Tomorrow",
    nextStep: "Sign and send it back to Greenfield School.",
    createdAt: Date.now() - day,
  },
  {
    id: "2",
    title: "Electricity payment",
    meta: "₹4,820",
    owner: "Dad",
    status: "attention",
    category: "bill",
    domain: "Home",
    amount: "₹4,820",
    due: "Sep 5",
    nextStep: "Pay before the due date.",
    createdAt: Date.now() - 2 * day,
  },
  {
    id: "3",
    title: "Car insurance renewal",
    meta: "₹18,400",
    owner: "Dad",
    status: "attention",
    category: "renewal",
    domain: "Vehicle",
    amount: "₹18,400",
    due: "Sep 14",
    nextStep: "Confirm the quote and renew for 12 months.",
    createdAt: Date.now() - 3 * day,
  },
  {
    id: "4",
    title: "School project materials",
    meta: "Needs a shopping list",
    owner: "Child",
    status: "attention",
    category: "document",
    domain: "School",
    due: "Sep 8",
    nextStep: "Write down what's needed before the weekend.",
    createdAt: Date.now() - 4 * day,
  },
  {
    id: "5",
    title: "Passport renewal appointment",
    meta: "Slot not booked yet",
    owner: UNASSIGNED,
    status: "attention",
    category: "appointment",
    domain: "Admin",
    nextStep: "Decide who books the appointment.",
    createdAt: Date.now() - 5 * day,
  },
  {
    id: "6",
    title: "Insurance provider reply",
    meta: "Response expected Sep 3",
    owner: "Mom",
    status: "waiting",
    category: "document",
    domain: "Money",
    nextStep: "Follow up if there's no reply by Sep 3.",
    createdAt: Date.now() - 6 * day,
  },
  {
    id: "7",
    title: "AC service confirmation",
    meta: "Chased once",
    owner: "Mom",
    status: "waiting",
    category: "appointment",
    domain: "Home",
    nextStep: "Wait for the service centre to confirm the slot.",
    createdAt: Date.now() - 7 * day,
  },
  {
    id: "8",
    title: "Internet payment",
    meta: "Paid Aug 29",
    owner: "Dad",
    status: "handled",
    category: "bill",
    domain: "Home",
    amount: "₹1,299",
    nextStep: "Nothing left to do.",
    createdAt: Date.now() - 9 * day,
    completedAt: Date.now() - day,
  },
  {
    id: "9",
    title: "Doctor appointment",
    meta: "Confirmed for Aug 30",
    owner: "Mom",
    status: "handled",
    category: "appointment",
    domain: "Health",
    nextStep: "Nothing left to do.",
    createdAt: Date.now() - 11 * day,
    completedAt: Date.now() - 2 * day,
  },
];

const seedActivity: Activity[] = [
  { id: "a1", ts: Date.now() - 3 * 3.6e6, actor: "Mom", verb: "was assigned", subject: "School consent form" },
  { id: "a2", ts: Date.now() - 6 * 3.6e6, actor: "You", verb: "added", subject: "Electricity payment" },
  { id: "a3", ts: Date.now() - day, actor: "Dad", verb: "completed", subject: "Internet payment" },
  { id: "a4", ts: Date.now() - 2 * day, actor: "Mom", verb: "completed", subject: "Doctor appointment" },
];

function load<T>(key: string, fallback: T[]): T[] {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw) as T[];
    return Array.isArray(parsed) && parsed.length ? parsed : fallback;
  } catch {
    return fallback;
  }
}

export type Draft = Omit<Item, "id" | "createdAt">;

/** Naive on-device interpreter: turns natural language into a structured draft. */
export function classify(text: string): Draft {
  const t = text.toLowerCase();
  const amount = text.match(/(?:₹|rs\.?\s?|\$)\s?[\d,]+(?:\.\d{2})?/i)?.[0];
  const date = text.match(
    /\b(?:next\s+)?(?:mon|tue|wed|thu|fri|sat|sun)[a-z]*\b|\b(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\s?\d{1,2}\b|\btomorrow\b|\btoday\b|\b\d{1,2}\/\d{1,2}(?:\/\d{2,4})?\b/i,
  )?.[0];

  let category: Category = "document";
  if (/bill|invoice|payment|due|recharge|electricity|water|gas|pay\b/.test(t)) category = "bill";
  else if (/form|consent|sign|application/.test(t)) category = "form";
  else if (/appointment|visit|doctor|dentist|service|meeting|book/.test(t)) category = "appointment";
  else if (/renew|policy|insurance|subscription|expiry/.test(t)) category = "renewal";

  let domain: Domain = "Admin";
  if (/school|class|teacher|homework|project|exam/.test(t)) domain = "School";
  else if (/doctor|dentist|health|medicine|clinic|vaccine/.test(t)) domain = "Health";
  else if (/car|bike|vehicle|fuel|service centre|insurance/.test(t)) domain = "Vehicle";
  else if (/electricity|water|gas|internet|rent|maintenance|home|ac\b/.test(t)) domain = "Home";
  else if (/bank|loan|tax|salary|fee|payment|bill/.test(t)) domain = "Money";

  const firstLine = text.trim().split("\n")[0]!.trim();
  const cleaned = firstLine
    .replace(/(?:₹|rs\.?\s?|\$)\s?[\d,]+(?:\.\d{2})?/gi, "")
    .replace(/\bdue\b.*$/i, "")
    .replace(/[·,.\-–—\s]+$/g, "")
    .trim();
  const base = cleaned || firstLine || "Untitled";
  const title = base.length > 46 ? base.slice(0, 46).trimEnd() + "…" : base;

  const nextSteps: Record<Category, string> = {
    bill: amount ? `Pay ${amount} before the due date.` : "Pay this before the due date.",
    form: "Fill it in, sign it, and send it back.",
    appointment: "Book the slot and add it to the household calendar.",
    renewal: "Confirm the quote and renew.",
    document: "File it and watch for a follow-up.",
  };

  return {
    title: title.charAt(0).toUpperCase() + title.slice(1),
    meta: [amount, date ? `Due ${date}` : null].filter(Boolean).join(" · ") || "Captured just now",
    owner: UNASSIGNED,
    status: "attention",
    category,
    domain,
    ...(amount ? { amount } : {}),
    ...(date ? { due: date.replace(/^next\s+/i, "Next ") } : {}),
    nextStep: nextSteps[category],
  };
}

export function useItems() {
  const [items, setItems] = useState<Item[]>(seedItems);
  const [activity, setActivity] = useState<Activity[]>(seedActivity);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setItems(load(STORAGE_KEY, seedItems));
    setActivity(load(ACTIVITY_KEY, seedActivity));
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
      window.localStorage.setItem(ACTIVITY_KEY, JSON.stringify(activity));
    } catch {
      /* storage unavailable */
    }
  }, [items, activity, hydrated]);

  const log = useCallback((actor: string, verb: Activity["verb"], subject: string) => {
    setActivity((prev) => [
      { id: crypto.randomUUID(), ts: Date.now(), actor, verb, subject },
      ...prev,
    ]);
  }, []);

  const create = useCallback(
    (draft: Draft) => {
      const item: Item = { ...draft, id: crypto.randomUUID(), createdAt: Date.now() };
      setItems((prev) => [item, ...prev]);
      log("You", "added", item.title);
      if (draft.owner !== UNASSIGNED) log(draft.owner, "was assigned", item.title);
      return item;
    },
    [log],
  );

  const update = useCallback((id: string, patch: Partial<Item>) => {
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, ...patch } : i)));
  }, []);

  const assign = useCallback(
    (id: string, owner: string) => {
      setItems((prev) => {
        const item = prev.find((i) => i.id === id);
        if (item && item.owner !== owner && owner !== UNASSIGNED) log(owner, "was assigned", item.title);
        return prev.map((i) => (i.id === id ? { ...i, owner } : i));
      });
    },
    [log],
  );

  const complete = useCallback(
    (id: string) => {
      setItems((prev) => {
        const item = prev.find((i) => i.id === id);
        if (item) log(item.owner === UNASSIGNED ? "You" : item.owner, "completed", item.title);
        return prev.map((i) =>
          i.id === id
            ? { ...i, status: "handled" as Status, completedAt: Date.now(), nextStep: "Nothing left to do." }
            : i,
        );
      });
    },
    [log],
  );

  const reopen = useCallback(
    (id: string) => {
      setItems((prev) => {
        const item = prev.find((i) => i.id === id);
        if (item) log("You", "reopened", item.title);
        return prev.map((i) =>
          i.id === id ? { ...i, status: "attention" as Status, completedAt: undefined } : i,
        );
      });
    },
    [log],
  );

  const remove = useCallback((id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }, []);

  const reset = useCallback(() => {
    setItems(seedItems);
    setActivity(seedActivity);
  }, []);

  return { items, activity, hydrated, create, update, assign, complete, reopen, remove, reset };
}
