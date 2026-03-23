import { createSlice } from '@reduxjs/toolkit';
import { Customer, OrderItem } from '@prisma/client';
import { ProductWithStocks } from '../products/types';

interface IRawOrderItem
  extends Omit<OrderItem, 'orderId' | 'createdAt' | 'updatedAt'> {
  orderId: null | string;
  product: ProductWithStocks;
}

interface ICartState {
  /**
   *  Zero based Indexing
   */
  currentStep: -1 | 0 | 1 | 2 | 3 | 4;
  orderItems: Array<IRawOrderItem>;
  staffId: string;
  paymentMode: string;
  canOrderBeCreated: boolean;
  customer: Customer;
  addressId: string;
}

const INITIAL_STATE: ICartState = {
  currentStep: -1,
  orderItems: [],
  staffId: '',
  paymentMode: '',
  canOrderBeCreated: true,
  customer: {} as Customer,
  addressId: '',
} as const;

const cartSlice = createSlice({
  name: 'cart',
  initialState: INITIAL_STATE,
  reducers: {
    resetCartState(state) {
      state.currentStep = -1;
      state.orderItems = [];
      state.staffId = '';
      state.paymentMode = '';
      state.canOrderBeCreated = true;
      state.customer = {} as Customer;
      state.addressId = '';
    },
    setCurrentBillingStep(state, action) {
      state.currentStep = action.payload;
    },
    addOrderItem(state, action: { payload: IRawOrderItem; type: string }) {
      state.orderItems.push(action.payload);
    },
    deleteOrderItem(
      state,
      action: { payload: IRawOrderItem['id']; type: string }
    ) {
      console.log(action.payload, state.orderItems);

      state.orderItems = state.orderItems.filter(
        (item) => item.id !== action.payload
      );
    },
    setStaffId(state, action: { payload: string; type: string }) {
      state.staffId = action.payload;
    },
    setPaymentMode(state, action: { payload: string; type: string }) {
      state.paymentMode = action.payload;
    },
    setCanOrderBeCreated(state, action: { payload: boolean; type: string }) {
      state.canOrderBeCreated = action.payload;
    },
    setCustomer(state, action: { payload: Customer; type: string }) {
      state.customer = action.payload;
    },
    setAddressId(state, action: { payload: string; type: string }) {
      state.addressId = action.payload;
    },
  },
});

export const {
  setCurrentBillingStep,
  addOrderItem,
  setStaffId,
  setPaymentMode,
  setCustomer,
  setAddressId,
  resetCartState,
  deleteOrderItem,
} = cartSlice.actions;

export const cartReducer = cartSlice.reducer;
