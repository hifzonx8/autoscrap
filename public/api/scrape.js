var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import * as sg from "../lib/scraped_gold.js";
import { initializeApp } from "firebase/app";
import * as d from "dotenv";
import { update, getDatabase, ref, child, push, } from "firebase/database";
d.config();
// Initialize Firebase app outside of the handler
const firebaseConfig = {
    databaseURL: process.env["FIREBASE_URL"],
};
const firebaseApp = initializeApp(firebaseConfig);
const db = getDatabase(firebaseApp);
const db_ref = ref(db);
function scrape(req) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const data = yield update_current(db, req);
            return new Response(JSON.stringify(data), {
                headers: new Headers({
                    "Content-Type": "application/json",
                }),
            });
        }
        catch (error) {
            console.error("Error in GET handler:", error);
            return new Response("Error", { status: 500 });
        }
    });
}
export function POST() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const data = yield update_current(db);
            return new Response(JSON.stringify(data), {
                headers: new Headers({
                    "Content-Type": "application/json",
                }),
            });
        }
        catch (error) {
            console.error("Error in GET handler:", error);
            return new Response("Error", { status: 500 });
        }
    });
}
export function GET(req) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield scrape(req);
    });
}
function update_current(db, req) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const sell_data = yield sg.scrape_sell_price();
            const buyback_data = yield sg.scrape_buyback_price();
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
            yield update(child(db_ref, "current"), data_to_send);
            yield push(child(db_ref, "history"), data_to_send);
            return data_to_send;
        }
        catch (error) {
            console.error("Error fetching data from Firebase:", error);
        }
    });
}
