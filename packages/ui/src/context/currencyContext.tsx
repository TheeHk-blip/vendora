"use client";

import { createContext, useContext, useMemo } from "react";
import { useGetCookie } from "cookies-next";

interface CurrencyProps {
  currency: string;
  formatPrice: (amount: number) => string;
}

const CurrencyContext = createContext<CurrencyProps | undefined>(undefined);

export function CurrencyProvider({ children }: {children: React.ReactNode}) {
  const getCookie = useGetCookie();
  const currency = (getCookie("user-currency") as string) || "Ksh";

  const formatter = useMemo(() => {
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency: currency,
    });
  }, [currency]);

  const formatPrice = (amount: number) => formatter.format(amount);

  return (
    <CurrencyContext.Provider
      value={{ currency, formatPrice }}
    >
      {children}
    </CurrencyContext.Provider>
  )
}

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (!context) throw new Error("useCurrency must be used within a currency provider");
  return context;
}