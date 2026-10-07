import type { Invoice } from "@/lib/api";
import { isOverdue } from "@/lib/format";

export function StatusBadge({ invoice }: { invoice: Pick<Invoice, "status" | "due_date"> }) {
  const overdue = isOverdue(invoice);
  return <span className={`badge badge-${overdue ? "overdue" : invoice.status}`}>{overdue ? "overdue" : invoice.status}</span>;
}
