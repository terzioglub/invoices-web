import Link from "next/link";

export function Pagination({
  page,
  limit,
  total,
  href,
}: {
  page: number;
  limit: number;
  total: number;
  href: (page: number) => string;
}) {
  const pages = Math.max(1, Math.ceil(total / limit));
  return (
    <nav className="pagination">
      {page > 1 ? <Link href={href(page - 1)}>← Previous</Link> : <span />}
      <span className="muted">
        Page {page} of {pages} · {total.toLocaleString("en-US")} total
      </span>
      {page < pages ? <Link href={href(page + 1)}>Next →</Link> : <span />}
    </nav>
  );
}
