import type {
    Action as Action,
    CaseReducer as CaseReducer,
    PayloadAction as PayloadAction,
    ThunkAction as ThunkAction,
} from '@reduxjs/toolkit';

import { getStore } from './';

const store = getStore();

export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
    ReturnType,
    RootState,
    unknown,
    Action<string>
    >;
export type AppDispatch = typeof store.dispatch;

export type Reducer<T, K = any> = CaseReducer<T, PayloadAction<K>>;
