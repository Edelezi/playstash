export type IGDBPlatform = {
    id: number;
    name: string;
};

export type IGDBGame = {
    cover: { url: string };
    id: number;
    name: string;
    platforms: IGDBPlatform[];
};

export type IGDBGameList = IGDBGame[];