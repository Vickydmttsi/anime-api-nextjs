import http from "../utils/http.js";
import { v1_base_url } from "../utils/base_v1.js";
import { DEFAULT_HEADERS } from "../configs/header.config.js";



export default async function extractRandomId() {
  try {
    const url = `https://${v1_base_url}/random`;
    const resp = await http.get(url, {
      redirect: 'manual'
    });

    // If we want the redirected URL
    if (resp.status >= 300 && resp.status < 400) {
      const redirectedUrl = resp.headers.get('location');
      const id = redirectedUrl.split("/").pop();
      return id;
    }

    // If it's already at the final URL (unlikely for /random but good to handle)
    const finalUrl = resp.url;
    return finalUrl.split("/").pop();
  } catch (error) {
    console.error("Error extracting random anime info:", error);
  }
}
