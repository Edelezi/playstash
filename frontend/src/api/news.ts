import type { FetchNewsResponse } from '../types/news';

const NEWS_API_KEY = 'c27236f58ce2425983e3ff26def8bd3f'; // Replace with your NewsAPI key

export async function fetchGameNews(gameName: string) {
    const url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(
        gameName,
    )}&apiKey=${NEWS_API_KEY}`;

    const response = await fetch(url);
    const data = (await response.json()) as FetchNewsResponse;

    if (data.articles && data.articles.length > 0) {
        return data.articles;
    } else {
        throw new Error('No news found');
    }
}
