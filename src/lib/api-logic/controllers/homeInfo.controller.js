import getSpotlights from "../extractors/spotlight.extractor.js";
import getTrending from "../extractors/trending.extractor.js";
import extractPage from "../helper/extractPages.helper.js";
import extractTopTen from "../extractors/topten.extractor.js";
import { routeTypes } from "../routes/category.route.js";
import extractSchedule from "../extractors/schedule.extractor.js";
import { getCachedData, setCachedData } from "../helper/cache.helper.js";

const genres = routeTypes
  .slice(0, 41)
  .map((genre) => genre.replace("genre/", ""));

export const getHomeInfo = async (req, res) => {
  try {
    console.log("Fetching home info sequentially...");

    // Sequential fetching to avoid ECONNRESET on kaido.to
    const spotlights = await getSpotlights().catch(e => { console.error("Spotlights failed:", e); return []; });
    const trending = await getTrending().catch(e => { console.error("Trending failed:", e); return []; });
    const topTen = await extractTopTen().catch(e => { console.error("TopTen failed:", e); return {}; });
    const schedule = await extractSchedule(new Date().toISOString().split("T")[0]).catch(e => { console.error("Schedule failed:", e); return []; });

    const topAiringRes = await extractPage(1, "top-airing").catch(e => { console.error("TopAiring failed:", e); return [[], 1]; });
    const mostPopularRes = await extractPage(1, "most-popular").catch(e => { console.error("MostPopular failed:", e); return [[], 1]; });
    const mostFavoriteRes = await extractPage(1, "most-favorite").catch(e => { console.error("MostFavorite failed:", e); return [[], 1]; });
    const latestCompletedRes = await extractPage(1, "completed").catch(e => { console.error("LatestCompleted failed:", e); return [[], 1]; });
    const latestEpisodeRes = await extractPage(1, "recently-updated").catch(e => { console.error("LatestEpisode failed:", e); return [[], 1]; });
    const topUpcomingRes = await extractPage(1, "top-upcoming").catch(e => { console.error("TopUpcoming failed:", e); return [[], 1]; });
    const recentlyAddedRes = await extractPage(1, "recently-added").catch(e => { console.error("RecentlyAdded failed:", e); return [[], 1]; });

    const responseData = {
      spotlights,
      trending,
      topTen,
      today: { schedule },
      topAiring: topAiringRes[0] || [],
      mostPopular: mostPopularRes[0] || [],
      mostFavorite: mostFavoriteRes[0] || [],
      latestCompleted: latestCompletedRes[0] || [],
      latestEpisode: latestEpisodeRes[0] || [],
      topUpcoming: topUpcomingRes[0] || [],
      recentlyAdded: recentlyAddedRes[0] || [],
      genres,
    };

    return responseData;
  } catch (err) {
    console.error("Error fetching home data:", err);
    // Return a structured empty object instead of the error object itself to avoid JSON.stringify issues
    return {
      spotlights: [],
      trending: [],
      topTen: { today: [], week: [], month: [] },
      today: { schedule: [] },
      genres: genres
    };
  }
};
