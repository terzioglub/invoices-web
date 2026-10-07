import Link from "next/link";
import { notFound } from "next/navigation";
import { api, ApiError } from "@/lib/api";
import { InvoiceTable } from "@/components/invoice-table";

export default async function CustomerPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const customer = await api.getCustomer(Number(id)).catch((err) => {
    if (err instanceof ApiError && (err.status === 404 || err.status === 400)) notFound();
    throw err;
  });

  const open = customer.invoices.filter((invoice) => invoice.status === "sent").length;

  return (
    <>
      <div className="page-header">
        <div>
          <h1>{customer.name}</h1>
          <p className="muted">
            {customer.email}
            {customer.company && <> · {customer.company}</>}
          </p>
        </div>
        <Link href={`/invoices/new?customer_id=${customer.id}`} className="button">
          New invoice
        </Link>
      </div>
      <div className="stats">
        <div className="card">
          <span className="muted">Invoices</span>
          <strong>{customer.invoices.length}</strong>
        </div>
        <div className="card">
          <span className="muted">Open</span>
          <strong>{open}</strong>
        </div>
      </div>
      <InvoiceTable invoices={customer.invoices} showCustomer={false} />
    </>
  );
}
