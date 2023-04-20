// reducer.ts
import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';

import type { PSGame } from '../../types/app';

const initialState = {
    games: [] as PSGame[],
};

const gamesSlice = createSlice({
    name: 'App',
    initialState,
    reducers: {
        addGame: (state, action: PayloadAction<PSGame>) => {
            state.games = [...state.games, action.payload];
        },
        removeGame: (state, action: PayloadAction<PSGame>) => {
            state.games = [...state.games, action.payload];
        },
    },
});

export const gameActions = gamesSlice.actions;
export default gamesSlice.reducer;
