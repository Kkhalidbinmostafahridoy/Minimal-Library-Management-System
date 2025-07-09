import { configureStore } from "@reduxjs/toolkit";
import { api } from "../api/apiSlice"; // ✅ corrected

export const store = configureStore({
  reducer: {
    [api.reducerPath]: api.reducer, // ✅ use `api`
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware), // ✅ use `api`
  devTools: process.env.NODE_ENV !== "production",
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
