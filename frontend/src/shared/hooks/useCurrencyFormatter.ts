import { useMemo } from "react";

export function useCurrencyFormatter(locale = "pt-BR", currency = "BRL") {
  return useMemo(
    () => new Intl.NumberFormat(locale, { style: "currency", currency }),
    [locale, currency],
  );
}
