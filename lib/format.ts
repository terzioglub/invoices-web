import type { Currency } from "./api";

export function formatMoney(amount: number, currency: Currency | null): string {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: currency ?? "USD" }).format(amount);
}

export function formatDate(value: string): string {
  return new Date(value.length === 10 ? `${value}T00:00:00Z` : value).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });
}

export function isOverdue(invoice: { status: string; due_date: string }, today = new Date()): boolean {
  return invoice.status === "sent" && invoice.due_date < today.toISOString().slice(0, 10);
}
