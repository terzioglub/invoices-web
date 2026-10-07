import Link from "next/link";
import { notFound } from "next/navigation";
import { api, ApiError, type InvoiceStatus } from "@/lib/api";
import { formatDate, formatMoney } from "@/lib/format";
import { StatusBadge } from "@/components/status-badge";
import { setInvoiceStatus } from "../actions";

const nextStatuses: Record<InvoiceStatus, { status: InvoiceStatus; label: string }[]> = {
  draft: [
    { status: "sent", label: "Mark as sent" },
    { status: "void", label: "Void" },
  ],
  sent: [
    { status: "paid", label: "Mark as paid" },
    { status: "void", label: "Void" },
  ],
  paid: [],
  void: [],
};

export default async function InvoicePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const invoice = await api.getInvoice(Number(id)).catch((err) => {
    if (err instanceof ApiError && (err.status === 404 || err.status === 400)) notFound();
    throw err;
  });

  return (
    <>
      <div className="page-header">
        <div>
          <h1>
            {invoice.number} <StatusBadge invoice={invoice} />
          </h1>
          <p className="muted">
            <Link href={`/customers/${invoice.customer_id}`}>{invoice.customer_name}</Link> · issued{" "}
            {formatDate(invoice.issued_at)} · due {formatDate(invoice.due_date)}
            {invoice.paid_at && <> · paid {formatDate(invoice.paid_at)}</>}
          </p>
        </div>
        <div className="actions">
          {nextStatuses[invoice.status].map((next) => (
            <form key={next.status} action={setInvoiceStatus.bind(null, invoice.id, next.status)}>
              <button className={next.status === "void" ? "secondary" : undefined}>{next.label}</button>
            </form>
          ))}
        </div>
      </div>

      <table>
        <thead>
          <tr>
            <th>Description</th>
            <th className="num">Qty</th>
            <th className="num">Unit price</th>
            <th className="num">Total</th>
          </tr>
        </thead>
        <tbody>
          {invoice.line_items.map((item) => (
            <tr key={item.id}>
              <td>{item.description}</td>
              <td className="num">{item.quantity}</td>
              <td className="num">{formatMoney(item.unit_price, invoice.currency)}</td>
              <td className="num">{formatMoney(item.quantity * item.unit_price, invoice.currency)}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan={3}>Total</td>
            <td className="num">{formatMoney(invoice.amount, invoice.currency)}</td>
          </tr>
        </tfoot>
      </table>
    </>
  );
}
