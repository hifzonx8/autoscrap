import { DateTime } from "luxon";
export function formatScrapeDate(date) {
    return DateTime.fromJSDate(date).toISO();
}
// string: 28 Aug 2024 08:28:21
export function formatSiteDate(date) {
    const jsdate = new Date(date);
    const lx = DateTime.fromJSDate(jsdate);
    lx.setZone("Asia/Jakarta");
    return lx.toISO();
}
export function formatOldISODate(ISOString) {
    const lx = DateTime.fromISO(ISOString);
    lx.setZone("Asia/Jakarta");
    return lx.toISO();
}
