const formatter = new Intl.DateTimeFormat("vi-VN", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

export function formatPostDate(date: string | Date) {
  return formatter.format(typeof date === "string" ? new Date(date) : date);
}
