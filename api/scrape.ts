import * as sg from "../lib/scraped_gold.js";
import { initializeApp } from "firebase/app";
import * as d from "dotenv";
import {
  update,
  getDatabase,
  ref,
  child,
  Database,
  push,
} from "firebase/database";

d.config();

// Initialize Firebase app outside of the handler
const firebaseConfig = {
  databaseURL: process.env["FIREBASE_URL"],
};
const firebaseApp = initializeApp(firebaseConfig);
const db = getDatabase(firebaseApp);
const db_ref = ref(db);

async function scrape(req?: Request) {
  try {
    const data = await update_current(db, req);

    return new Response(JSON.stringify(data), {
      headers: new Headers({
        "Content-Type": "application/json",
      }),
    });
  } catch (error) {
    console.error("Error in GET handler:", error);
    return new Response("Error", { status: 500 });
  }
}

export async function POST() {
  try {
    const data = await update_current(db);

    return new Response(JSON.stringify(data), {
      headers: new Headers({
        "Content-Type": "application/json",
      }),
    });
  } catch (error) {
    console.error("Error in GET handler:", error);
    return new Response("Error", { status: 500 });
  }
}

export async function GET(req: Request) {
  return await scrape(req);
}

async function update_current(db: Database, req?: Request) {
  try {
    const sell_data = await sg.scrape_sell_price();
    const buyback_data = await sg.scrape_buyback_price();
    let agent;
    if (req) {
      const sp = new URL(req.url).searchParams.get("agent");
      agent = sp || "manual";
    }
    const data_to_send = {
      captured_at: buyback_data.scraped_at,
      agent,
      gold: {
        buyback: {
          price: buyback_data.gold_price,
          last_update: buyback_data.data_last_update,
        },
        sell: {
          price: sell_data.gold_price,
          last_update: sell_data.data_last_update,
        },
      },
      silver: {
        sell: {
          price: sell_data.silver_price,
          last_update: sell_data.data_last_update,
        },
        buyback: {
          price: -1,
          last_update: -1,
        },
      },
    };

    await update(child(db_ref, "current"), data_to_send);
    await push(child(db_ref, "history"), data_to_send);
    return data_to_send;
  } catch (error) {
    console.error("Error fetching data from Firebase:", error);
  }
}
