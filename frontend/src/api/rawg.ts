const RAWG_API_KEY = '4d9eb57d81784905a295519c84be9f1c'; // Replace with your RAWG API key

export async function fetchGameDetails(gameName: string) {
    const url = `https://api.rawg.io/api/games?key=${RAWG_API_KEY}&search=${encodeURIComponent(
        gameName
    )}`;

    const response = await fetch(url);
    const data = await response.json();

    if (data.results && data.results.length > 0) {
         // Assuming the first result is the most relevant
        return data.results[0];
    } else {
        throw new Error('Game not found');
    }
}