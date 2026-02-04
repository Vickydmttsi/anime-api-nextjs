import http from "../utils/http.js";
import * as cheerio from "cheerio";
import { v1_base_url } from "../utils/base_v1.js";
// import decryptMegacloud from "../parsers/decryptors/megacloud.decryptor.js";
// import AniplayExtractor from "../parsers/aniplay.parser.js";
import { decryptSources_v1 } from "../parsers/decryptors/decrypt_v1.decryptor.js";

export async function extractServers(id) {
  try {
    const epIdOnly = id?.toString().split("?ep=").pop();
    const resp = await http.get(
      `https://${v1_base_url}/ajax/episode/servers?episodeId=${epIdOnly}`,
      {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          "Referer": `https://${v1_base_url}/watch/${id}`,
          "X-Requested-With": "XMLHttpRequest"
        },
        timeout: 10000
      }
    );
    if (!resp.data || !resp.data.html) {
      console.log(`[Extractor] No servers HTML for ${epIdOnly}`);
      return [];
    }
    const $ = cheerio.load(resp.data.html);
    const serverData = [];

    $(".server-item").each((index, element) => {
      const data_id = $(element).attr("data-id");
      const server_id = $(element).attr("data-server-id");
      const type = $(element).attr("data-type");
      let serverName = $(element).find("a").text().trim();

      // Standardize names based on server_id for consistency
      if (server_id === "4") serverName = "Vidstreaming";
      if (server_id === "1") serverName = "Vidcloud";

      serverData.push({
        data_id,
        server_id,
        type,
        serverName,
      });
    });
    return serverData;
  } catch (error) {
    console.log(error);
    return [];
  }
}

async function extractSkipInfo(id) {
  try {
    const epIdOnly = id?.toString().split("?ep=").pop();
    const { data } = await http.get(
      `https://${v1_base_url}/ajax/episode/skip?episodeId=${epIdOnly}`,
      {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          "Referer": `https://${v1_base_url}/watch/${id}`,
          "X-Requested-With": "XMLHttpRequest"
        },
        timeout: 5000
      }
    );
    return data;
  } catch (error) {
    return null;
  }
}

async function extractStreamingInfo(id, name, type, fallback) {
  try {
    const epIdOnly = id.split("?ep=").pop();

    if (fallback) {
      // In fallback mode (premium player), we can skip fetching the servers list
      // because the fallback decryptor uses the epId directly.
      const streamingLink = await decryptSources_v1(
        epIdOnly,
        null, // data_id not needed for fallback
        name,
        type,
        fallback
      );

      if (streamingLink && (!streamingLink.intro || streamingLink.intro.end === 0)) {
        const skipData = await extractSkipInfo(epIdOnly);
        if (skipData) {
          streamingLink.intro = skipData.results?.intro || skipData.intro || streamingLink.intro;
          streamingLink.outro = skipData.results?.outro || skipData.outro || streamingLink.outro;
        }
      }

      return { streamingLink, servers: [] };
    }

    const servers = await extractServers(epIdOnly);
    console.log(`[Extractor] Available servers for ${id}:`, servers.map(s => `${s.serverName} (${s.type})`).join(", "));

    let requestedServer = servers.filter(
      (server) =>
        server.serverName.toLowerCase() === name.toLowerCase() &&
        server.type.toLowerCase() === type.toLowerCase()
    );
    if (requestedServer.length === 0) {
      requestedServer = servers.filter(
        (server) =>
          server.serverName.toLowerCase() === name.toLowerCase() &&
          server.type.toLowerCase() === "raw"
      );
    }
    if (requestedServer.length === 0) {
      throw new Error(
        `No matching server found for name: ${name}, type: ${type}`
      );
    }
    const streamingLink = await decryptSources_v1(
      epIdOnly,
      requestedServer[0].data_id,
      name,
      type,
      fallback
    );

    // Merge skip info if missing or zero
    if (streamingLink && (!streamingLink.intro || streamingLink.intro.end === 0)) {
      const skipData = await extractSkipInfo(epIdOnly);
      if (skipData) {
        streamingLink.intro = skipData.intro || streamingLink.intro;
        streamingLink.outro = skipData.outro || streamingLink.outro;
      }
    }

    return { streamingLink, servers };
  } catch (error) {
    console.error("An error occurred in extractStreamingInfo:", error);
    return { streamingLink: [], servers: [] };
  }
}
export { extractStreamingInfo };
