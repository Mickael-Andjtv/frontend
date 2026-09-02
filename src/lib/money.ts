/**
 * Currency helper — this project only uses Malagasy Ariary (Ar / MGA).
 * All prices are formatted consistently as e.g. "25 000 Ar".
 */
export function formatAr(value: number): string {
  const rounded = Math.round(value ?? 0);
  return `${rounded.toLocaleString("fr-FR")} Ar`;
}