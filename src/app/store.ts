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
import { profileApi } from "./features/profileSlice/profileSlice";
import { packagesApi } from "./features/packages/packages";
import { customersApi } from "./features/Users/usersSlice";
import { ordersApi } from "./features/Orders/ordersSlice";
import { subAdminApi } from "./features/subAdmins/subAdmins";
import { recommendationsApi } from "./features/Recommendations/RecommendationsSlice";
import { coursesApi } from "./features/Courses/coursesSlice";
import { leactuersApi } from "./features/Lectuers/Lectuers";
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
    [profileApi.reducerPath]: profileApi.reducer,
    [packagesApi.reducerPath]: packagesApi.reducer,
    [customersApi.reducerPath]: customersApi.reducer,
    [ordersApi.reducerPath]: ordersApi.reducer,
    [subAdminApi.reducerPath]: subAdminApi.reducer,
    [recommendationsApi.reducerPath]: recommendationsApi.reducer,
    [coursesApi.reducerPath]: coursesApi.reducer,
    [leactuersApi.reducerPath]: leactuersApi.reducer,

  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(
      authApi.middleware,
      categoriesApi.middleware,
      profileApi.middleware,
      packagesApi.middleware,
      customersApi.middleware,
      ordersApi.middleware,
      subAdminApi.middleware,
      recommendationsApi.middleware,
      coursesApi.middleware,
      leactuersApi.middleware,
      

    ),
});

// ✅ Step 3: Create persistor
export const persistor = persistStore(store);

// ✅ Step 4: Type exports
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
