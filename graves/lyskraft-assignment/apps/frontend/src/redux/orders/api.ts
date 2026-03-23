import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { GetOrderDetailsResponse, GetOrdersResponse } from './types';

export const ordersApi = createApi({
  reducerPath: 'orders',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:3000/api/orders',
  }),
  endpoints: (builder) => ({
    getOrders: builder.query<GetOrdersResponse, Record<string, string>>({
      query: (filters) => `?${new URLSearchParams(filters).toString()}`,
    }),
    getOrderById: builder.query<GetOrderDetailsResponse, string>({
      query: (orderId) => `/${orderId}`,
    }),
    createOrder: builder.mutation({
      query: (orderData) => ({
        url: '/',
        method: 'POST',
        body: orderData,
      }),
    }),
  }),
});

export const {
  useCreateOrderMutation,
  useGetOrderByIdQuery,
  useGetOrdersQuery,
} = ordersApi;

export const { resetApiState: resetProductsState } = ordersApi.util;
