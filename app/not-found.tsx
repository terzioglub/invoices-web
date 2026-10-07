import Link from "next/link";

export default function NotFound() {
  return (
    <div className="card">
      <h1>Not found</h1>
      <Link href="/invoices">Back to invoices</Link>
    </div>
  );
}
