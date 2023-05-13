import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import walletReducer from "../features/wallet/walletSlice";

export default configureStore({
  reducer: {
    wallet: walletReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
});
