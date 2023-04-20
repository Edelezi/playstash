// store.ts
import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import type { Store } from 'redux';

import type { RootState } from '../reducers';
import reducer from '../reducers';
import { loadGames } from '../utils/localStorage';

const loadStateFromStorage = async () => {
    const games = await loadGames();
    return { gameStash: { games } };
};

let store: Store<RootState, any> | null = null;

const initializeStore = async () => {
    const preloadedState = await loadStateFromStorage();
    const middleware = getDefaultMiddleware();

    store = configureStore({ reducer, preloadedState, middleware });

    return store;
};

export const getStore = () => {
    if (!store) {
        throw new Error(
            'Store has not been initialized. Call `initializeStore` before using the store.',
        );
    }

    return store;
};

export default initializeStore;
