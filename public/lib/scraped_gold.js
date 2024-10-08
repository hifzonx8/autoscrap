var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import * as cheerio from "cheerio";
import * as momento from "./momento.js";
function parsePrice(text) {
    return parseFloat(text
        .replace(/[^0-9.,]/g, "")
        .replace(/\./g, "")
        .replace(/,/g, "."));
}
function parseBuybackPrice(text) {
    return parseFloat(text.replace(/[^0-9.,]/g, "").replace(/,/g, ""));
}
function link_to_cheerio(link) {
    return __awaiter(this, void 0, void 0, function* () {
        const request = yield fetch(link);
        const html = yield request.text();
        return cheerio.load(html);
    });
}
export function scrape_sell_price() {
    return __awaiter(this, void 0, void 0, function* () {
        const scraped_at = momento.formatScrapeDate(new Date());
        const $ = yield link_to_cheerio("https://www.logammulia.com/id");
        const gold_price = parsePrice($("body > section.index-hero > div.hero-price > div.child.child-2.has-bg.has-overlay.overlay-gold > div > p.price > span.current").text());
        const silver_price = parsePrice($("body > section.index-hero > div.hero-price > div.child.child-3.has-bg.has-overlay.overlay-silver > div > p.price > span.current").text());
        const data_last_update = momento.formatSiteDate($("body > section.index-hero > div.hero-price > div.child.child-4 > div > p > span")
            .text()
            .split(": ")[1]);
        return {
            scraped_at,
            data_last_update,
            gold_price,
            silver_price,
        };
    });
}
export function scrape_buyback_price() {
    return __awaiter(this, void 0, void 0, function* () {
        const scraped_at = momento.formatScrapeDate(new Date());
        const $ = yield link_to_cheerio("https://www.logammulia.com/id/sell/gold");
        const gold_price = parseBuybackPrice($("body > section.section-padding.n-no-padding-bottom > div > div > div.grid-child.n-1200-2per3.n-no-margin-bottom > div > div > div.right > div > div:nth-child(1) > span.value > span.text").text());
        const data_last_update = momento.formatSiteDate($("body > section.section-padding.n-no-padding-bottom > div > div > div.grid-child.n-1200-2per3.n-no-margin-bottom > div > div > div.right > div > div:nth-child(3) > span.value.update > span").text());
        return {
            scraped_at,
            data_last_update,
            gold_price,
        };
    });
}
