import { clsx, type ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function toNumberSafe(value: any): number {
  if (typeof value === 'number') return value;
  if (typeof value === 'string') return parseFloat(value);
  if (value && typeof value.toString === 'function') return parseFloat(value.toString());
  return 0;
}

export function toFixedSafe(value: any, digits = 2): string {
  return toNumberSafe(value).toFixed(digits);
}

export function formatPrice(price: any): string {
  return new Intl.NumberFormat("es-GT", {
    style: "currency",
    currency: "GTQ",
    minimumFractionDigits: 2
  }).format(toNumberSafe(price));
}

export function formatPriceUSD(price: any): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2
  }).format(toNumberSafe(price));
}
