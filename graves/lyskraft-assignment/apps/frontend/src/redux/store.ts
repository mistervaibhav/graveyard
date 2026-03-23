import { combineReducers, configureStore } from '@reduxjs/toolkit';
import {
  FLUSH,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
  REHYDRATE,
  persistReducer,
  persistStore,
} from 'redux-persist';
import { productsApi } from './products/api';
import { cartReducer } from './cart';
import { userReducer } from './user';
import { storesApi } from './stores/api';
import { billingApi } from './billing/api';
import { authApi } from './auth/api';
import storage from 'redux-persist/lib/storage';
import { ordersApi } from './orders/api';

const persistConfig = {
  key: 'root',
  storage: storage,
  whitelist: ['user'],
};

const middleware = [
  authApi.middleware,
  productsApi.middleware,
  storesApi.middleware,
  billingApi.middleware,
  ordersApi.middleware,
];

const rootReducer = combineReducers({
  cart: cartReducer,
  user: userReducer,
  [productsApi.reducerPath]: productsApi.reducer,
  [storesApi.reducerPath]: storesApi.reducer,
  [authApi.reducerPath]: authApi.reducer,
  [billingApi.reducerPath]: billingApi.reducer,
  [ordersApi.reducerPath]: ordersApi.reducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(middleware),
  devTools: true,
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
