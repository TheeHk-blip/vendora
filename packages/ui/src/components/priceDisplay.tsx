"use client";

import { useCurrency } from "./../context/currencyContext";

interface PriceProps {
  amount: number;
  className?: string;
}

export default function PriceDisplay({amount, className}: PriceProps) {
  const { formatPrice } = useCurrency();

  return <span className={className}>{formatPrice(amount)}</span>
}