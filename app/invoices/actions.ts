"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { api, type Currency, type InvoiceStatus } from "@/lib/api";

export async function createInvoice(formData: FormData) {
  const descriptions = formData.getAll("description").map(String);
  const quantities = formData.getAll("quantity").map(Number);
  const prices = formData.getAll("unit_price").map(Number);

  const lineItems = descriptions
    .map((description, i) => ({
      description: description.trim(),
      quantity: quantities[i] ?? 0,
      unit_price: prices[i] ?? 0,
    }))
    .filter((item) => item.description && item.quantity > 0);

  const invoice = await api.createInvoice({
    customer_id: Number(formData.get("customer_id")),
    currency: String(formData.get("currency")) as Currency,
    due_date: String(formData.get("due_date")),
    line_items: lineItems,
  });

  revalidatePath("/invoices");
  redirect(`/invoices/${invoice.id}`);
}

export async function setInvoiceStatus(id: number, status: InvoiceStatus) {
  await api.updateInvoiceStatus(id, status);
  revalidatePath(`/invoices/${id}`);
}
