import http from "../utils/http.js";
import * as cheerio from "cheerio";
import { DEFAULT_HEADERS } from "../configs/header.config.js";

async function countPages(url) {
  try {
    const { data } = await http.get(url);
    const html = typeof data === 'string' ? data : (data?.html || "");
    const $ = cheerio.load(html);
    const lastPageHref = $(
      ".tab-content .pagination .page-item:last-child a"
    ).attr("href");
    const lastPageNumber = lastPageHref
      ? parseInt(lastPageHref.split("=").pop())
      : 1;
    return lastPageNumber;
  } catch (error) {
    console.error("Error counting pages:", error.message);
    throw error;
  }
}

export default countPages;
