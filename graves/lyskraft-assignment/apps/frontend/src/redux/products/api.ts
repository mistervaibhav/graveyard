import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Product } from '@prisma/client';
import { ProductWithStocks } from './types';

export const productsApi = createApi({
  reducerPath: 'products',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:3000/api/products',
  }),
  endpoints: (builder) => ({
    getProducts: builder.query<Array<Product>, { inStock: null | boolean }>({
      query: ({ inStock }) => (inStock ? `/?inStock=${inStock}` : '/'),
    }),
    getProductByBarcode: builder.query<ProductWithStocks, string>({
      query: (barcode) => `/barcode/${barcode}`,
      keepUnusedDataFor: 0,
    }),
  }),
});

export const { useGetProductsQuery, useLazyGetProductByBarcodeQuery } =
  productsApi;

export const { resetApiState: resetProductsState } = productsApi.util;
