import { extractor } from "../extractors/category.extractor.js";
import { getCachedData, setCachedData } from "../helper/cache.helper.js";

export const getCategory = async (req, res, routeType) => {
  if (routeType === "genre/martial-arts") {
    routeType = "genre/marial-arts";
  }

  // Map categories to kaido.to filter paths to avoid home page redirection
  const categoryMap = {
    'movie': 'filter?type=1',
    'tv': 'filter?type=2',
    'ova': 'filter?type=3',
    'ona': 'filter?type=4',
    'special': 'filter?type=5',
    'music': 'filter?type=6'
  };

  if (categoryMap[routeType]) {
    routeType = categoryMap[routeType];
  }
  const requestedPage = parseInt(req.query.page) || 1;
  // const cacheKey = `${routeType.replace(/\//g, "_")}_page_${requestedPage}`;
  try {
    // const cachedResponse = await getCachedData(cacheKey);
    // if (cachedResponse && Object.keys(cachedResponse).length > 0)
    //   return cachedResponse;
    const { data, totalPages } = await extractor(routeType, requestedPage);
    if (requestedPage > totalPages) {
      const error = new Error("Requested page exceeds total available pages.");
      error.status = 404;
      throw error;
    }
    const responseData = { totalPages: totalPages, data: data };
    // setCachedData(cacheKey, responseData).catch((err) => {
    //   console.error("Failed to set cache:", err);
    // });
    return responseData;
  } catch (e) {
    console.error(e);
    return e;
  }
};
