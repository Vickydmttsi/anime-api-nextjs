import http from "../utils/http.js";
import dotenv from "dotenv";

dotenv.config();

const CACHE_SERVER_URL = process.env.CACHE_URL || null;

export const getCachedData = async (key) => {
  try {
    if (!CACHE_SERVER_URL) {
      console.log(CACHE_SERVER_URL);
      return;
    }
    const response = await http.get(`${CACHE_SERVER_URL}/${key}`);
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 404) {
      return null;
    }
    throw error;
  }
};

export const setCachedData = async (key, value) => {
  try {
    if (!CACHE_SERVER_URL) {
      return;
    }
    await http.post(CACHE_SERVER_URL, { key, value });
  } catch (error) {
    console.error("Error setting cache data:", error);
    throw error;
  }
};
