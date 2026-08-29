import { useCallback, useEffect, useState } from "react";

export type Status = "attention" | "waiting" | "handled";
export type Category = "bill" | "form" | "appointment" | "document" | "renewal";

export type Item = {
  id: string;
  title: string;
  meta: string;
  owner: string;
  status: Status;
  category: Category;
  due?: string;
  /** Draft action Daylatch proposes; requires approval before it is "sent". */
  proposal?: string;
  approved?: boolean;
  createdAt: number;
};

export const OWNERS = ["Mom", "Dad", "Ira", "Unassigned"] as const;

export const CATEGORY_LABEL: Record<Category, string> = {
  bill: "Bill",
  form: "Form",
  appointment: "Appointment",
  document: "Document",
  renewal: "Renewal",
};

const STORAGE_KEY = "daylatch.items.v1";

const seed: Item[] = [
  {
    id: "1",
    title: "School consent form",
    meta: "Signature required",
    owner: "Mom",
    status: "attention",
    category: "form",
    due: "Tomorrow",
    proposal: "Sign digitally and email back to Greenfield School.",
    createdAt: Date.now() - 8.64e7,
  },
  {
    id: "2",
    title: "Electricity bill",
    meta: "₹4,820",
    owner: "Dad",
    status: "attention",
    category: "bill",
    due: "Sep 5",
    proposal: "Pay ₹4,820 to BESCOM from the household account.",
    createdAt: Date.now() - 1.7e8,
  },
  {
    id: "3",
    title: "Car insurance renewal",
    meta: "₹18,400 · needs a decision",
    owner: "Dad",
    status: "attention",
    category: "renewal",
    due: "Sep 14",
    proposal: "Renew with the current insurer at ₹18,400 for 12 months.",
    createdAt: Date.now() - 2.6e8,
  },
  {
    id: "4",
    title: "Insurance provider",
    meta: "Response expected Sep 3 · following up",
    owner: "Mom",
    status: "waiting",
    category: "document",
    createdAt: Date.now() - 3.4e8,
  },
  {
    id: "5",
    title: "AC service appointment",
    meta: "Confirmation pending · chased once",
    owner: "Ira",
    status: "waiting",
    category: "appointment",
    createdAt: Date.now() - 4.3e8,
  },
  {
    id: "6",
    title: "School fee",
    meta: "Paid Aug 22",
    owner: "Mom",
    status: "handled",
    category: "bill",
    createdAt: Date.now() - 6e8,
  },
  {
    id: "7",
    title: "Doctor appointment",
    meta: "Confirmed for Aug 30",
    owner: "Dad",
    status: "handled",
    category: "appointment",
    createdAt: Date.now() - 7e8,
  },
];

function load(): Item[] {
  if (typeof window === "undefined") return seed;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return seed;
    const parsed = JSON.parse(raw) as Item[];
    return Array.isArray(parsed) && parsed.length ? parsed : seed;
  } catch {
    return seed;
  }
}

/** Naive on-device classifier: turns pasted text into a structured item. */
export function classify(text: string): Omit<Item, "id" | "createdAt"> {
  const t = text.toLowerCase();
  const amount = text.match(/(?:₹|rs\.?\s?|\$)\s?[\d,]+(?:\.\d{2})?/i)?.[0];
  const date = text.match(
    /\b(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\s?\d{1,2}\b|\btomorrow\b|\btoday\b|\b\d{1,2}\/\d{1,2}(?:\/\d{2,4})?\b/i,
  )?.[0];

  let category: Category = "document";
  if (/bill|invoice|payment|due|recharge|electricity|water|gas/.test(t)) category = "bill";
  else if (/form|consent|sign|application/.test(t)) category = "form";
  else if (/appointment|visit|doctor|dentist|service|meeting/.test(t)) category = "appointment";
  else if (/renew|policy|insurance|subscription|expiry/.test(t)) category = "renewal";

  const firstLine = text.trim().split("\n")[0]!.trim();
  const title = firstLine.length > 52 ? firstLine.slice(0, 52).trimEnd() + "…" : firstLine;

  const proposals: Record<Category, string> = {
    bill: `Pay ${amount ?? "this bill"} from the household account.`,
    form: "Prepare a filled draft and route it for signature.",
    appointment: "Confirm the slot and add it to the household calendar.",
    renewal: `Renew at ${amount ?? "the quoted price"} and set a reminder next year.`,
    document: "File this under household records and watch for follow-ups.",
  };

  return {
    title: title || "Untitled item",
    meta: [amount, date ? `Due ${date}` : null].filter(Boolean).join(" · ") || "Captured just now",
    owner: "Unassigned",
    status: "attention",
    category,
    ...(date ? { due: date } : {}),
    proposal: proposals[category],
  };
}

export function useItems() {
  const [items, setItems] = useState<Item[]>(seed);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setItems(load());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      /* storage unavailable */
    }
  }, [items, hydrated]);

  const add = useCallback((text: string) => {
    const item: Item = {
      ...classify(text),
      id: crypto.randomUUID(),
      createdAt: Date.now(),
    };
    setItems((prev) => [item, ...prev]);
    return item;
  }, []);

  const update = useCallback((id: string, patch: Partial<Item>) => {
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, ...patch } : i)));
  }, []);

  const remove = useCallback((id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }, []);

  const reset = useCallback(() => setItems(seed), []);

  return { items, hydrated, add, update, remove, reset };
}
