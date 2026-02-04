import { extractStreamingInfo } from "../extractors/streamInfo.extractor.js";

export const getStreamInfo = async (req, res, fallback = false) => {
  try {
    const input = req.query.id;
    const server = req.query.server || "vidstreaming";
    const type = req.query.type || "sub";

    console.log(`[StreamInfo] Request for ID: ${input}, Server: ${server}, Type: ${type}, Fallback: ${fallback}`);

    let finalId = input.split('?')[0];
    if (input.includes('ep=')) {
      const match = input.match(/ep=(\d+)/);
      if (match) finalId = match[1];
    }

    const streamingInfo = await extractStreamingInfo(finalId, server, type, fallback);
    return streamingInfo;
  } catch (e) {
    console.error(e);
    return { error: e.message };
  }
};
