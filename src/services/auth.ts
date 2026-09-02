import { apiGet, apiPost, getAuthToken, setAuthToken } from "./http";
import type { Customer } from "@/features/client/types/client.types";

interface AuthResponseDto {
  token: string;
  customer: Customer;
}

export type RegisterPayload = {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  password: string;
};

export async function registerClient(
  payload: RegisterPayload,
): Promise<Customer> {
  const result = await apiPost<AuthResponseDto>("/api/auth/register", payload);
  setAuthToken(result.token);
  return result.customer;
}

export async function loginClient(
  email: string,
  password: string,
): Promise<Customer> {
  const result = await apiPost<AuthResponseDto>("/api/auth/login", {
    email,
    password,
  });
  setAuthToken(result.token);
  return result.customer;
}

export async function fetchCurrentCustomer(): Promise<Customer | null> {
  if (!getAuthToken()) return null;
  try {
    const result = await apiGet<AuthResponseDto>("/api/auth/me");
    setAuthToken(result.token);
    return result.customer;
  } catch {
    return null;
  }
}

export function logoutClient(): void {
  setAuthToken(null);
}