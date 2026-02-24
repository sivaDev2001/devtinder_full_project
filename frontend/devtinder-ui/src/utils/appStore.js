import { configureStore, combineReducers } from "@reduxjs/toolkit"
import {
    persistStore, persistReducer,
    FLUSH, REGISTER, REHYDRATE, PAUSE, PERSIST, PURGE
} from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import userSlice from './slices'
import feedSlice from './feedSlices'

const rootReducer = combineReducers(
    {
        user: userSlice,
        feed: feedSlice
    }
)
const persistConfiguration = {
    key: "root",
    storage,
    whitelist: ["user"]
}
const persistedReducer = persistReducer(persistConfiguration, rootReducer)
const appStore = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) => {
        return getDefaultMiddleware({
            serializableCheck: {
                ignoreActions: [FLUSH, REHYDRATE, REGISTER, PAUSE, PERSIST, PURGE]
            }
        })
    }
});

export default appStore

export const persistor = persistStore(appStore)