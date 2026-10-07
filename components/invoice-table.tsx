import Link from "next/link";
import type { Invoice } from "@/lib/api";
import { formatDate, formatMoney } from "@/lib/format";
import { StatusBadge } from "./status-badge";

export function InvoiceTable({ invoices, showCustomer = true }: { invoices: Invoice[]; showCustomer?: boolean }) {
  if (invoices.length === 0) return <p className="muted">No invoices yet.</p>;
  return (
    <table>
      <thead>
        <tr>
          <th>Number</th>
          {showCustomer && <th>Customer</th>}
          <th>Status</th>
          <th className="num">Amount</th>
          <th>Issued</th>
          <th>Due</th>
        </tr>
      </thead>
      <tbody>
        {invoices.map((invoice) => (
          <tr key={invoice.id}>
            <td>
              <Link href={`/invoices/${invoice.id}`}>{invoice.number}</Link>
            </td>
            {showCustomer && (
              <td>
                <Link href={`/customers/${invoice.customer_id}`}>{invoice.customer_name}</Link>
              </td>
            )}
            <td>
              <StatusBadge invoice={invoice} />
            </td>
            <td className="num">{formatMoney(invoice.amount, invoice.currency)}</td>
            <td>{formatDate(invoice.issued_at)}</td>
            <td>{formatDate(invoice.due_date)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
