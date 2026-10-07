const API_URL = process.env.API_URL ?? "http://localhost:3001";

export type InvoiceStatus = "draft" | "sent" | "paid" | "void";
export type Currency = "USD" | "EUR" | "GBP";

export interface Invoice {
  id: number;
  number: string;
  customer_id: number;
  customer_name: string;
  status: InvoiceStatus;
  currency: Currency | null;
  amount: number;
  issued_at: string;
  due_date: string;
  paid_at: string | null;
}

export interface LineItem {
  id: number;
  position: number;
  description: string;
  quantity: number;
  unit_price: number;
}

export interface InvoiceDetail extends Invoice {
  line_items: LineItem[];
}

export interface Customer {
  id: number;
  name: string;
  email: string;
  company: string | null;
  created_at: string;
}

export interface CustomerDetail extends Customer {
  invoices: Invoice[];
}

export interface Page<T> {
  data: T[];
  page: number;
  limit: number;
  total: number;
}

export interface NewInvoice {
  customer_id: number;
  currency: Currency;
  due_date: string;
  line_items: { description: string; quantity: number; unit_price: number }[];
}

export interface NewCustomer {
  name: string;
  email: string;
  company: string | null;
}

export class ApiError extends Error {
  constructor(
    readonly status: number,
    message: string,
  ) {
    super(message);
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    ...init,
    cache: "no-store",
    headers: { "content-type": "application/json", ...init?.headers },
  });
  if (!res.ok) {
    const body = (await res.json().catch(() => null)) as { error?: unknown } | null;
    const message = typeof body?.error === "string" ? body.error : `${res.status} ${res.statusText}`;
    throw new ApiError(res.status, message);
  }
  return (await res.json()) as T;
}

function query(params: Record<string, string | number | undefined>) {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== "") search.set(key, String(value));
  }
  const s = search.toString();
  return s ? `?${s}` : "";
}

export const api = {
  listInvoices: (params: { page?: number; status?: InvoiceStatus; customer_id?: number }) =>
    request<Page<Invoice>>(`/invoices${query({ limit: 25, ...params })}`),
  getInvoice: (id: number) => request<InvoiceDetail>(`/invoices/${id}`),
  createInvoice: (body: NewInvoice) =>
    request<Invoice>("/invoices", { method: "POST", body: JSON.stringify(body) }),
  updateInvoiceStatus: (id: number, status: InvoiceStatus) =>
    request<Invoice>(`/invoices/${id}`, { method: "PATCH", body: JSON.stringify({ status }) }),
  listCustomers: (params: { page?: number }) =>
    request<Page<Customer>>(`/customers${query({ limit: 25, ...params })}`),
  getCustomer: (id: number) => request<CustomerDetail>(`/customers/${id}`),
  createCustomer: (body: NewCustomer) =>
    request<Customer>("/customers", { method: "POST", body: JSON.stringify(body) }),
};
