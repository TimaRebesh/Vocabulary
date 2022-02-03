import { combineReducers, configureStore } from "@reduxjs/toolkit";
import configApi from "../API/configApi";
import vocabularyApi from "../API/vocabularyApi";
import panelsReducer from './reducers/panelsSlice';
import countdownReducer from './reducers/countdownSlice';
import cheerReducer from './reducers/cheerSlice';
import vocPanelReducer from './reducers/vocPanelSlice';
import errorSlice from './reducers/errorSlice';


export const rootReducer = combineReducers({
    panels: panelsReducer,
    countdown: countdownReducer,
    cheer: cheerReducer,
    vocPanel: vocPanelReducer,
    error: errorSlice,
    [configApi.reducerPath]: configApi.reducer,
    [vocabularyApi.reducerPath]: vocabularyApi.reducer,
})

export const setupStore = () => {
    return configureStore({
        reducer: rootReducer,
        middleware: (getDefaultMiddleware) =>
            getDefaultMiddleware()
                .concat(configApi.middleware, vocabularyApi.middleware)
    })
}

export type RootState = ReturnType<typeof rootReducer>
export type AppStore = ReturnType<typeof setupStore>
export type AppDispatch = AppStore['dispatch']
