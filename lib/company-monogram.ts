export function companyMonogram(company: string): string {
  const trimmed = company.trim();
  if (!trimmed) return "??";
  const words = trimmed.split(/\s+/).filter(Boolean);
  if (words.length >= 2) {
    return (words[0][0] + words[words.length - 1][0]).toUpperCase();
  }
  return trimmed.slice(0, 2).toUpperCase();
}
