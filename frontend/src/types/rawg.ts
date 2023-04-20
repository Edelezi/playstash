export type RawgPlatform = {
    id: number;
    name: string;
    slug: string;
};

export type RawgStore = {
    id: number;
    name: string;
    slug: string;
};

type RawgRating = {
    id: number;
    title: string;
    count: number;
    percent: number;
};

type RawgTag = {
    id: number;
    name: string;
    slug: string;
    language: string;
    games_count: number;
    image_background: string;
};

type RawgEsrbRating = {
    id: number;
    name: string;
    slug: string;
    name_en: string;
    name_ru: string;
};

type RawgShortScreenshot = {
    id: number;
    image: string;
};

type RawgParentPlatform = {
    platform: RawgPlatform;
};

type RawgGenre = {
    id: number;
    name: string;
    slug: string;
};

export type RAWGGameData = {
    slug: string;
    name: string;
    playtime: number;
    platforms: {
        platform: RawgPlatform;
    }[];
    stores: {
        store: RawgStore;
    }[];
    released: string;
    tba: boolean;
    background_image: string;
    rating: number;
    rating_top: number;
    ratings: RawgRating[];
    ratings_count: number;
    reviews_text_count: number;
    added: number;
    added_by_status: {
        yet: number;
        owned: number;
        beaten: number;
        toplay: number;
        dropped: number;
        playing: number;
    };
    metacritic: number;
    suggestions_count: number;
    updated: string;
    id: number;
    score: string;
    clip: null;
    tags: RawgTag[];
    esrb_rating: RawgEsrbRating;
    user_game: null;
    reviews_count: number;
    saturated_color: string;
    dominant_color: string;
    short_screenshots: RawgShortScreenshot[];
    parent_platforms: RawgParentPlatform[];
    genres: RawgGenre[];
};

export type RawgGameSearchResponse = {
    count: number;
    next: string;
    previous: string;
    results: RAWGGameData[];
};
