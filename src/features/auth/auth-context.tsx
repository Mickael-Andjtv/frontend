"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { Customer } from "@/features/client/types/client.types";
import {
  fetchCurrentCustomer,
  loginClient,
  logoutClient,
  registerClient,
  type RegisterPayload,
} from "@/services/auth";
import { initAuthToken } from "@/services/http";

type AuthContextValue = {
  customer: Customer | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<Customer>;
  register: (payload: RegisterPayload) => Promise<Customer>;
  logout: () => void;
  refresh: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    initAuthToken();
    fetchCurrentCustomer()
      .then((current) => {
        if (active) setCustomer(current);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const result = await loginClient(email, password);
    setCustomer(result);
    return result;
  }, []);

  const register = useCallback(async (payload: RegisterPayload) => {
    const result = await registerClient(payload);
    setCustomer(result);
    return result;
  }, []);

  const logout = useCallback(() => {
    logoutClient();
    setCustomer(null);
  }, []);

  const refresh = useCallback(async () => {
    const current = await fetchCurrentCustomer();
    setCustomer(current);
  }, []);

  const value = useMemo(
    () => ({
      customer,
      loading,
      isAuthenticated: Boolean(customer),
      login,
      register,
      logout,
      refresh,
    }),
    [customer, loading, login, register, logout, refresh],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}