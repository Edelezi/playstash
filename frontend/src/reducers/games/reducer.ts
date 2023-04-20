// reducer.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { PSGame } from '../../types/app';

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

const actions = gamesSlice.actions;

export const gameActions = gamesSlice.actions;
export default gamesSlice.reducer;
