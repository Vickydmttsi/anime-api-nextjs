import http from "../utils/http.js";

async function fetchScript(url) {
  const response = await http.get(url);
  return response.data;
}

export default fetchScript;
