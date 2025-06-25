import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./features/auth/authSlice";
import { authApi } from "./features/auth/authQuery";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import cookieStorage from "./services/cookieStorage";
import { categoriesApi } from "./features/Categories/CategoriesSlice";
// import storage from 'redux-persist/lib/storage'; // uses localStorage


// ✅ Step 1: Configure persistence for only `auth`
const persistConfig = {
  key: "authData",
  storage: cookieStorage,
   whitelist: ["authData"],
  
  
};

const persistedAuthReducer = persistReducer(persistConfig, authReducer);

// ✅ Step 2: Configure store
export const store = configureStore({
  reducer: {
    auth: persistedAuthReducer, // use persisted version
    [authApi.reducerPath]: authApi.reducer,
    [categoriesApi.reducerPath]: categoriesApi.reducer,

  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(
      authApi.middleware,
      categoriesApi.middleware,
      

    ),
});

// ✅ Step 3: Create persistor
export const persistor = persistStore(store);

// ✅ Step 4: Type exports
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
