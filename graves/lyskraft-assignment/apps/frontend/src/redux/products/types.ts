import { Product, Stock, Store } from '@prisma/client';

export type StockWithStore = Stock & { store: Store };
export type ProductWithStocks = Product & { stocks: Array<StockWithStore> };
