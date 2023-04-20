import axios from 'axios';
import { Platform } from 'react-native';

import type { IGDBGameList } from '../types/igdb';

const clientId = 'qqlv6juxtdx29n2x1w1lh5bxs0h6pv';
const appSecret = '2cclv68wevphfbo1aiovcw56ie5msh';

let accessToken: string | null = null;

export const getGameSearchResults = async (searchTerm: string) => {
    if (!accessToken) {
        const tokenResponse = await axios.post(
            `https://id.twitch.tv/oauth2/token?client_id=${clientId}&client_secret=${appSecret}&grant_type=client_credentials`,
        );
        accessToken = tokenResponse.data.access_token;
    }

    const isWeb = Platform.OS === 'web';

    let gameList: IGDBGameList;
    if (isWeb) {
        const response = await axios
            .post<IGDBGameList>(
                'http://localhost:3001/api/games',
                `search "${searchTerm}"; fields name,platforms.name,cover.url; limit 10;`,
                {
                    headers: {
                        'x-access-token': accessToken,
                    },
                },
            )
            .catch(error => {
                console.log(error);
            });
        if (!response) {
            return;
        }
        gameList = response.data;
    } else {
        const response = await axios.post<IGDBGameList>(
            'https://api.igdb.com/v4/games',
            `search "${searchTerm}"; fields name,platforms.name,cover.url; limit 10;`,
            {
                headers: {
                    'Client-ID': 'qqlv6juxtdx29n2x1w1lh5bxs0h6pv', // Replace with your actual Client ID
                    Authorization: `Bearer ${accessToken}`, // Replace with your actual access token
                },
            },
        );
        if (!response) {
            return;
        }
        gameList = response.data;
    }

    return gameList;
};
