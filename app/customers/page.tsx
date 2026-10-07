import Link from "next/link";
import { api } from "@/lib/api";
import { formatDate } from "@/lib/format";
import { Pagination } from "@/components/pagination";

export default async function CustomersPage({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  const params = await searchParams;
  const page = Math.max(1, Number(params.page) || 1);
  const result = await api.listCustomers({ page });

  return (
    <>
      <div className="page-header">
        <h1>Customers</h1>
        <Link href="/customers/new" className="button">
          New customer
        </Link>
      </div>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Company</th>
            <th>Since</th>
          </tr>
        </thead>
        <tbody>
          {result.data.map((customer) => (
            <tr key={customer.id}>
              <td>
                <Link href={`/customers/${customer.id}`}>{customer.name}</Link>
              </td>
              <td>{customer.email}</td>
              <td>{customer.company ?? <span className="muted">—</span>}</td>
              <td>{formatDate(customer.created_at)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <Pagination
        page={result.page}
        limit={result.limit}
        total={result.total}
        href={(p) => (p > 1 ? `/customers?page=${p}` : "/customers")}
      />
    </>
  );
}
