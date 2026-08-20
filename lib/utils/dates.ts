export function isSameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export function followUpStatus(dueDate: string, completedAt?: string | null) {
  if (completedAt) return "Completed" as const;
  const due = new Date(dueDate);
  const now = new Date();
  if (isSameDay(due, now)) return "Due Today" as const;
  return due < now ? ("Overdue" as const) : ("Upcoming" as const);
}

export function formatDate(value?: string | null, options?: Intl.DateTimeFormatOptions) {
  if (!value) return "Not set";
  return new Intl.DateTimeFormat("en-SG", options ?? { dateStyle: "medium" }).format(
    new Date(value),
  );
}

export function formatDateTime(value?: string | null) {
  return formatDate(value, { dateStyle: "medium", timeStyle: "short" });
}

export function daysSince(value?: string | null) {
  if (!value) return Number.POSITIVE_INFINITY;
  return Math.max(0, Math.floor((Date.now() - new Date(value).getTime()) / 86_400_000));
}

export function toDateTimeLocal(date: Date) {
  const offset = date.getTimezoneOffset();
  return new Date(date.getTime() - offset * 60_000).toISOString().slice(0, 16);
}

