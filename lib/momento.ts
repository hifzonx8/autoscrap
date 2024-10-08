import { DateTime } from "luxon";

export function formatScrapeDate(date: Date) {
  return DateTime.fromJSDate(date).toISO() as string;
}

// string: 28 Aug 2024 08:28:21
export function formatSiteDate(date: string) {
  const jsdate = new Date(date);
  const lx = DateTime.fromJSDate(jsdate);
  lx.setZone("Asia/Jakarta");
  return lx.toISO() as string;
}

export function formatOldISODate(ISOString: string) {
  const lx = DateTime.fromISO(ISOString);
  lx.setZone("Asia/Jakarta");
  return lx.toISO() as string;
}
