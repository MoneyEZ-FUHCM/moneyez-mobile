import { configureStore } from "@reduxjs/toolkit";
import { persistStore } from "redux-persist";

import { setupListeners } from "@reduxjs/toolkit/query";

export const store = configureStore({
  reducer: {},
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

setupListeners(store.dispatch);
