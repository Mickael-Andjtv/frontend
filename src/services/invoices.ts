import { apiGetBlob } from "./http";

export async function downloadInvoice(orderId: string): Promise<Blob> {
  return apiGetBlob(`/api/invoices/${orderId}`);
}
