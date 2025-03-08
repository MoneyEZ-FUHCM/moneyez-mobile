import { configureStore } from "@reduxjs/toolkit";
import groupReducer from "@/app/(tabs)/(group)/group-details/group-home/group-home-default/groupHomeDefaultSlice";

const store = configureStore({
  reducer: {
    group: groupReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
