import * as cheerio from "cheerio";
import * as momento from "./momento.js";

export type ScrapedSellData = {
  scraped_at: string;
  data_last_update: string;
  gold_price: number;
  silver_price: number;
};

export type ScrapedBuybackData = {
  scraped_at: string;
  data_last_update: string;
  gold_price: number;
};

function parsePrice(text: string): number {
  return parseFloat(
    text
      .replace(/[^0-9.,]/g, "")
      .replace(/\./g, "")
      .replace(/,/g, ".")
  );
}

function parseBuybackPrice(text: string): number {
  return parseFloat(text.replace(/[^0-9.,]/g, "").replace(/,/g, ""));
}

async function link_to_cheerio(link: string): Promise<cheerio.CheerioAPI> {
  const request = await fetch(link);
  const html = await request.text();
  return cheerio.load(html);
}

export async function scrape_sell_price(): Promise<ScrapedSellData> {
  const scraped_at = momento.formatScrapeDate(new Date());
  const $ = await link_to_cheerio("https://www.logammulia.com/id");
  const gold_price = parsePrice(
    $(
      "body > section.index-hero > div.hero-price > div.child.child-2.has-bg.has-overlay.overlay-gold > div > p.price > span.current"
    ).text()
  );
  const silver_price = parsePrice(
    $(
      "body > section.index-hero > div.hero-price > div.child.child-3.has-bg.has-overlay.overlay-silver > div > p.price > span.current"
    ).text()
  );
  const data_last_update = momento.formatSiteDate(
    $(
      "body > section.index-hero > div.hero-price > div.child.child-4 > div > p > span"
    )
      .text()
      .split(": ")[1]
  );
  return {
    scraped_at,
    data_last_update,
    gold_price,
    silver_price,
  };
}

export async function scrape_buyback_price(): Promise<ScrapedBuybackData> {
  const scraped_at = momento.formatScrapeDate(new Date());
  const $ = await link_to_cheerio("https://www.logammulia.com/id/sell/gold");
  const gold_price = parseBuybackPrice(
    $(
      "body > section.section-padding.n-no-padding-bottom > div > div > div.grid-child.n-1200-2per3.n-no-margin-bottom > div > div > div.right > div > div:nth-child(1) > span.value > span.text"
    ).text()
  );
  const data_last_update = momento.formatSiteDate(
    $(
      "body > section.section-padding.n-no-padding-bottom > div > div > div.grid-child.n-1200-2per3.n-no-margin-bottom > div > div > div.right > div > div:nth-child(3) > span.value.update > span"
    ).text()
  );
  return {
    scraped_at,
    data_last_update,
    gold_price,
  };
}
