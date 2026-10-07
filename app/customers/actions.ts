"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { api } from "@/lib/api";

export async function createCustomer(formData: FormData) {
  const company = String(formData.get("company") ?? "").trim();
  const customer = await api.createCustomer({
    name: String(formData.get("name")).trim(),
    email: String(formData.get("email")).trim(),
    company: company || null,
  });

  revalidatePath("/customers");
  redirect(`/customers/${customer.id}`);
}
