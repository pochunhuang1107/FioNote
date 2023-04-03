import { combineReducers } from '@reduxjs/toolkit';
import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query/react';
import { persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import { userApi } from './apis/userApi';
import { itemApi } from './apis/itemApi';
import authReducer from './slices/authSlice';
import storage from 'redux-persist/lib/storage';

const persistConfig = {
    key: 'auth',
    storage,
    whitelist: ['auth'],
};

const rootReducer = combineReducers({
    auth: authReducer,
    [userApi.reducerPath]: userApi.reducer,
    [itemApi.reducerPath]: itemApi.reducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) => {
        return getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
            }
        }).concat(userApi.middleware)
        .concat(itemApi.middleware);
    }
});

setupListeners(store.dispatch);

export { useCreateUserMutation, useLoginUserMutation } from './apis/userApi';
export { useFetchItemsQuery, useCreateItemMutation, useCompleteItemMutation, useRemoveItemMutation } from './apis/itemApi';