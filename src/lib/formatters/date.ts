/**
 * Formats a date string (YYYY-MM-DD) into Indian standard format (DD/MM/YYYY)
 */
export function formatDate(dateString?: string): string {
  if (!dateString) return "";
  try {
    const [year, month, day] = dateString.split("-");
    if (year && month && day) {
      return `${day}/${month}/${year}`;
    }
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return dateString;
    const dayPad = String(d.getDate()).padStart(2, "0");
    const monthPad = String(d.getMonth() + 1).padStart(2, "0");
    return `${dayPad}/${monthPad}/${d.getFullYear()}`;
  } catch {
    return dateString;
  }
}

export function formatDateTime(isoString?: string): string {
  if (!isoString) return "";
  try {
    const d = new Date(isoString);
    if (isNaN(d.getTime())) return isoString;
    return d.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return isoString;
  }
}
