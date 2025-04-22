import axios from "axios";

const SCRYFALL_BASE_URL = "https://api.scryfall.com";

/**
 * Search for cards using the Scryfall API.
 * @param {string} query - The search query (e.g., card name or type).
 * @returns {Promise} - A promise resolving to the search results.
 */
export const searchCards = async (query) => {
  try {
    const response = await axios.get(`${SCRYFALL_BASE_URL}/cards/search`, {
      params: { q: query },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching cards from Scryfall:", error);
    throw error;
  }
};
