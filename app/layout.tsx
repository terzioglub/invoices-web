import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "Billing",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <header>
          <Link href="/invoices" className="brand">
            Billing
          </Link>
          <nav>
            <Link href="/invoices">Invoices</Link>
            <Link href="/customers">Customers</Link>
          </nav>
        </header>
        <main>{children}</main>
      </body>
    </html>
  );
}
