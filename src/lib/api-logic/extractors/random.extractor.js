import http from "../utils/http.js";
import { v1_base_url } from "../utils/base_v1.js";
import extractAnimeInfo from "./animeInfo.extractor.js";
import { DEFAULT_HEADERS } from "../configs/header.config.js";

export default async function extractRandom() {
  try {
    const url = `https://${v1_base_url}/random`;
    const resp = await http.get(url, {
      redirect: 'manual'
    });

    let id = "";
    if (resp.status >= 300 && resp.status < 400) {
      const redirectedUrl = resp.headers.get('location');
      id = redirectedUrl.split("/").pop();
    } else {
      id = resp.url.split("/").pop();
    }
    const animeInfo = await extractAnimeInfo(id);
    return animeInfo;
  } catch (error) {
    console.error("Error extracting random anime info:", error);
  }
}
