import Link from "next/link";
import { api, type InvoiceStatus } from "@/lib/api";
import { InvoiceTable } from "@/components/invoice-table";
import { Pagination } from "@/components/pagination";

const filters: { label: string; status?: InvoiceStatus }[] = [
  { label: "All" },
  { label: "Draft", status: "draft" },
  { label: "Sent", status: "sent" },
  { label: "Paid", status: "paid" },
  { label: "Void", status: "void" },
];

function hrefFor(status: InvoiceStatus | undefined, page: number) {
  const params = new URLSearchParams();
  if (status) params.set("status", status);
  if (page > 1) params.set("page", String(page));
  const s = params.toString();
  return s ? `/invoices?${s}` : "/invoices";
}

export default async function InvoicesPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; status?: string }>;
}) {
  const params = await searchParams;
  const page = Math.max(1, Number(params.page) || 1);
  const status = filters.find((f) => f.status === params.status)?.status;
  const result = await api.listInvoices({ page, status });

  return (
    <>
      <div className="page-header">
        <h1>Invoices</h1>
      </div>
      <div className="filters">
        {filters.map((f) => (
          <Link key={f.label} href={hrefFor(f.status, 1)} className={f.status === status ? "active" : undefined}>
            {f.label}
          </Link>
        ))}
      </div>
      <InvoiceTable invoices={result.data} />
      <Pagination page={result.page} limit={result.limit} total={result.total} href={(p) => hrefFor(status, p)} />
    </>
  );
}
