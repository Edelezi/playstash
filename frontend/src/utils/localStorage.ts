import AsyncStorage from '@react-native-async-storage/async-storage';
import { PSGame } from '../types/app';

const EXPANDED_CATEGORIES_STORAGE_KEY = 'expandedCategories';
const GAMES_STORAGE_KEY = 'games';

export const saveGames = async (games: PSGame[]) => {
    try {
        await AsyncStorage.setItem(GAMES_STORAGE_KEY, JSON.stringify(games));
    } catch (error) {
        console.error('Error saving games to local storage:', error);
    }
};

export const loadGames = async (): Promise<PSGame[]> => {
    try {
        const storedData = await AsyncStorage.getItem(GAMES_STORAGE_KEY);

        if (storedData) {
            return JSON.parse(storedData);
        }
    } catch (error) {
        console.error('Error loading games from local storage:', error);
    }

    return [];
};

export const saveExpandedCategories = async (expandedCategories: string[]) => {
    try {
        await AsyncStorage.setItem(EXPANDED_CATEGORIES_STORAGE_KEY, JSON.stringify(expandedCategories));
    } catch (error) {
        console.error('Error saving expanded categories to local storage:', error);
    }
};

export const loadExpandedCategories = async (): Promise<string[]> => {
    try {
        const storedData = await AsyncStorage.getItem(EXPANDED_CATEGORIES_STORAGE_KEY);

        if (storedData) {
            return JSON.parse(storedData);
        }
    } catch (error) {
        console.error('Error loading expanded categories from local storage:', error);
    }

    return [];
};
