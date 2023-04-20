import { PSGame } from '../../types/app';
import { saveGames } from '../../utils/localStorage';
import { gameActions } from './reducer';
import { AppThunk } from '../../store/types';

export const addGameThunk =
    (game: PSGame): AppThunk =>
        (dispatch, getStore) => {
            const store = getStore();
            dispatch(gameActions.addGame(game));
            void saveGames(store.games.games);
        };

export const removeGameThunk =
    (gameId: number): AppThunk =>
        (dispatch, getStore) => {
            const store = getStore();
            const game = store.games.games.find((game) => game.id === gameId);
            if (!game) {
                return;
            }
            dispatch(gameActions.removeGame(game));
            void saveGames(store.games.games);
        };