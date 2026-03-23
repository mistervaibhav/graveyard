import { Address, Customer } from '@prisma/client';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const billingApi = createApi({
  reducerPath: 'billing',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:3000/api',
  }),
  endpoints: (builder) => ({
    getProducts: builder.query({
      query: () => `/billing`,
    }),
    getCustomers: builder.query<Array<Customer>, string>({
      query: (searchQuery) => `/customers?search=${searchQuery}`,
    }),
    getCustomerAddresses: builder.query<Array<Address>, string>({
      query: (customerId) => `/customers/${customerId}/addresses`,
    }),
    createCustomer: builder.mutation({
      query: (userData) => ({
        url: '/customers',
        method: 'POST',
        body: userData,
      }),
    }),
    createAddressForCustomer: builder.mutation({
      query: (userData) => ({
        url: `/customers/${userData.customerId}/addresses`,
        method: 'POST',
        body: userData,
      }),
    }),
  }),
});

export const {
  useGetProductsQuery,
  useLazyGetCustomersQuery,
  useCreateCustomerMutation,
  useLazyGetCustomerAddressesQuery,
  useCreateAddressForCustomerMutation,
} = billingApi;

export const { resetApiState: resetBillingState } = billingApi.util;
