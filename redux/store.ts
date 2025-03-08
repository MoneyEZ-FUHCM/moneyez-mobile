import authApi from "@/services/auth";
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import loadingReducer from "./slices/loadingSlice";
import userReducer from "./slices/userSlice";
import tabReducer from "./slices/tabSlice";
import groupHomeDefaultReducer from "@/app/(tabs)/(group)/group-details/group-home/group-home-default/groupHomeDefaultSlice";

const rootReducer = combineReducers({
  [authApi.reducerPath]: authApi.reducer,
  loading: loadingReducer,
  user: userReducer,
  tab: tabReducer,
  groupHomeDefault: groupHomeDefaultReducer,
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(authApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

setupListeners(store.dispatch);
