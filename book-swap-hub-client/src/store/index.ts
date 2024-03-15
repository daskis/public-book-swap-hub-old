import {configureStore} from '@reduxjs/toolkit'
import {useDispatch, useSelector} from 'react-redux'
import type {TypedUseSelectorHook} from 'react-redux'
import {authApi} from "./services/authApi";
import authSlice from "./features/authSlice";
import {bookApi} from "./services/bookApi";
import {commentApi} from "./services/commentApi";
import bookSettingsSlice from "./features/bookSettingsSlice";

const store = configureStore({
    reducer: {
        auth: authSlice,
        bookSettings: bookSettingsSlice,
        [authApi.reducerPath] : authApi.reducer,
        [bookApi.reducerPath] : bookApi.reducer,
        [commentApi.reducerPath] : commentApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(authApi.middleware, bookApi.middleware, commentApi.middleware)
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export const useAppDispatch: () => AppDispatch = useDispatch
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector


export default store