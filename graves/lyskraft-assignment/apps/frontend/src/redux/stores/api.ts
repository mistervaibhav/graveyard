import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Store, StoreStaff } from '@prisma/client';

export const storesApi = createApi({
  reducerPath: 'stores',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:3000/api',
  }),
  endpoints: (builder) => ({
    getStores: builder.query<Array<Store>, void>({
      query: () => `/stores`,
    }),
    getStaffByStoreId: builder.query<Array<StoreStaff>, string>({
      query: (storeId) => `/staff/${storeId}`,
    }),
  }),
});

export const { useGetStoresQuery, useGetStaffByStoreIdQuery } = storesApi;
