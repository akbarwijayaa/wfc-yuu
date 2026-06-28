// Format timestamps in Western Indonesia Time (WIB, UTC+7) regardless of the
// server timezone (Vercel runs in UTC).
const wibFormatter = new Intl.DateTimeFormat("id-ID", {
  timeZone: "Asia/Jakarta",
  dateStyle: "medium",
  timeStyle: "short",
});

export function formatWIB(date: Date | string): string {
  return `${wibFormatter.format(new Date(date))} WIB`;
}
