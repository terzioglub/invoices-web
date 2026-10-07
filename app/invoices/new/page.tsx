import Link from "next/link";
import { notFound } from "next/navigation";
import { api, ApiError } from "@/lib/api";
import { createInvoice } from "../actions";

function inDays(days: number) {
  return new Date(Date.now() + days * 86_400_000).toISOString().slice(0, 10);
}

export default async function NewInvoicePage({
  searchParams,
}: {
  searchParams: Promise<{ customer_id?: string }>;
}) {
  const { customer_id } = await searchParams;
  if (!customer_id) notFound();
  const customer = await api.getCustomer(Number(customer_id)).catch((err) => {
    if (err instanceof ApiError && (err.status === 404 || err.status === 400)) notFound();
    throw err;
  });

  return (
    <>
      <div className="page-header">
        <div>
          <h1>New invoice</h1>
          <p className="muted">
            for <Link href={`/customers/${customer.id}`}>{customer.name}</Link>
          </p>
        </div>
      </div>
      <form action={createInvoice} className="card form">
        <input type="hidden" name="customer_id" value={customer.id} />
        <div className="row">
          <label>
            Currency
            <select name="currency" defaultValue="USD">
              <option>USD</option>
              <option>EUR</option>
              <option>GBP</option>
            </select>
          </label>
          <label>
            Due date
            <input type="date" name="due_date" defaultValue={inDays(30)} required />
          </label>
        </div>
        <fieldset>
          <legend>Line items</legend>
          {[0, 1, 2].map((i) => (
            <div className="row" key={i}>
              <input name="description" placeholder="Description" required={i === 0} />
              <input name="quantity" type="number" min="1" step="1" placeholder="Qty" defaultValue={i === 0 ? 1 : undefined} />
              <input name="unit_price" type="number" min="0" step="0.01" placeholder="Unit price" />
            </div>
          ))}
        </fieldset>
        <button>Create invoice</button>
      </form>
    </>
  );
}
