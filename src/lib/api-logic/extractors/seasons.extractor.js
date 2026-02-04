import http from "../utils/http.js";
import * as cheerio from "cheerio";
import { v1_base_url } from "../utils/base_v1.js";

async function extractSeasons(id) {
    try {
        const resp = await http.get(`https://${v1_base_url}/${id}`, {
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
            },
            timeout: 10000
        });
        const html = typeof resp.data === 'string' ? resp.data : (resp.data?.html || "");
        const $ = cheerio.load(html);

        // Selector covers both Detail page (.block_area-seasons) and Watch page (.other-season)
        const seasons = $(".os-list a.os-item")
            .map((index, element) => {
                const href = $(element).attr("href");
                if (!href) return null;

                const data_number = index;
                const data_id = parseInt(href.split("-").pop());
                const season = $(element).find(".title").text().trim();
                const title = $(element).attr("title")?.trim() || season;
                const seasonId = href.replace(/^\/+/, "").replace(/^watch\//, "");

                const style = $(element).find(".season-poster").attr("style") || "";
                const posterMatch = style.match(/url\((.*?)\)/);
                const season_poster = posterMatch ? posterMatch[1].replace(/['"]/g, "") : "/no_poster.jpg";

                return { id: seasonId, data_number, data_id, season, title, season_poster };
            })
            .get()
            .filter(s => s !== null);

        return seasons;
    } catch (e) {
        console.error("Error extracting seasons:", e.message);
        return [];
    }
}

export default extractSeasons;
