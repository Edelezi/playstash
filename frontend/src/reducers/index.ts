import type { TypedUseSelectorHook } from 'react-redux';
import { useDispatch, useSelector } from 'react-redux';
import { combineReducers } from 'redux';

import type { AppDispatch } from '../store/types';
import gamesReducer from './games/reducer';


const rootReducer = combineReducers({
    games: gamesReducer,
    // other: otherReducer
});

export type RootState = ReturnType<typeof rootReducer>;

export const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector;

type DispatchFunc = () => AppDispatch;
export const useTypedDispatch: DispatchFunc = useDispatch;

export default rootReducer;