"use client";

import { useCounter } from "@/hooks/useCounter";
import { formatNumber } from "@/lib/utils";

interface CounterProps {
  value: number;
  suffix?: string;
  prefix?: string;
  className?: string;
}

export function Counter({ value, suffix = "", prefix = "", className }: CounterProps) {
  const { ref, value: animated } = useCounter(value);

  return (
    <div ref={ref} className={className}>
      {prefix}
      {formatNumber(animated)}
      {suffix}
    </div>
  );
}
