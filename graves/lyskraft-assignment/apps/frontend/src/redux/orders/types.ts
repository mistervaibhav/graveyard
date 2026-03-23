export type GetOrdersResponse = Array<{
  id: string;
  customerId: string;
  addressId: string;
  paymentStatus: string;
  transactionId: string;
  paymentMode: string;
  salesStaffId: string;
  createdAt: string;
  updatedAt: string;
  status: string;
  customer: {
    name: string;
  };
  salesStaff: {
    name: string;
  };
}>;

export interface GetOrderDetailsResponse {
  id: string;
  customerId: string;
  addressId: any;
  paymentStatus: string;
  transactionId: string;
  paymentMode: string;
  salesStaffId: string;
  createdAt: string;
  updatedAt: string;
  status: string;
  customer: Customer;
  address: any;
  salesStaff: SalesStaff;
  items: Item[];
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  isWhatsappOpted: boolean;
  createdAt: string;
  updatedAt: any;
}

export interface SalesStaff {
  id: string;
  name: string;
  email: string;
  password: string;
  salt: string;
  storeId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Item {
  id: string;
  productId: string;
  size: string;
  color: string;
  sellingPrice: number;
  stockType: string;
  billingStoreId: string;
  fulfilmentStoreId: string;
  remarks: any;
  orderId: string;
  createdAt: string;
  updatedAt: string;
  quantity: number;
  product: Product;
  billingStore: BillingStore;
  fulfilmentStore: FulfilmentStore;
}

export interface Product {
  id: string;
  title: string;
  description: string;
  image: string;
  brand: string;
  sizes: any[];
  color: string;
  price: number;
  barcode: string;
  createdAt: string;
  updatedAt: any;
}

export interface BillingStore {
  id: string;
  name: string;
  GSTIN: string;
  addressId: string;
  createdAt: string;
  updatedAt: any;
}

export interface FulfilmentStore {
  id: string;
  name: string;
  GSTIN: string;
  addressId: string;
  createdAt: string;
  updatedAt: any;
}
