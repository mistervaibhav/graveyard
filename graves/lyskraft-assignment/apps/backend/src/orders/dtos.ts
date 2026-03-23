export class CreateOrderDto {
  customerId: string;
  addressId: string;
  paymentMode: string;
  salesStaffId: string;
  paymentStatus: string;
  transactionId: string;
  items: Array<CreateOrderItemDto>;
}

export class CreateOrderItemDto {
  productId: string;
  size: string;
  color: string;
  sellingPrice: number;
  stockType: string;
  billingStoreId: string;
  fulfilmentStoreId?: string;
  remarks?: string;
  quantity?: number;
}
