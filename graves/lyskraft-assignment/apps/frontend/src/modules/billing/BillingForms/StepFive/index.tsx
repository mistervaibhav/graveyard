import { Button } from '@mantine/core';
import { v4 as uuid } from 'uuid';
import { useTypedSelector } from '../../../../redux/useTypedSelector';
import { resetCartState } from '../../../../redux/cart';
import useAppDispatch from '../../../../redux/useAppDispatch';
import { resetBillingState } from '../../../../redux/billing/api';
import { useCreateOrderMutation } from '../../../../redux/orders/api';
import { useEffect } from 'react';
import toast from 'react-hot-toast';

const StepFive = () => {
  const dispatch = useAppDispatch();
  const cart = useTypedSelector((store) => store.cart);

  const [createOrder, createOrderResult] = useCreateOrderMutation();

  useEffect(() => {
    if (createOrderResult.isSuccess) {
      toast.success('Order created successfully', { icon: '🚀' });
      dispatch(resetCartState());
      dispatch(resetBillingState());
    }
  }, [createOrderResult]);

  return (
    <div>
      <Button
        loading={createOrderResult.isLoading}
        onClick={() => {
          createOrder({
            customerId: cart.customer.id,
            addressId: cart.addressId,
            paymentMode: cart.paymentMode,
            salesStaffId: cart.staffId,
            paymentStatus: 'COMPLETED',
            transactionId: uuid(),
            items: cart.orderItems.map((item) => ({
              productId: item.productId,
              size: item.size,
              color: item.color,
              sellingPrice: item.sellingPrice,
              stockType: item.stockType,
              billingStoreId: item.billingStoreId,
              fulfilmentStoreId: item.fulfilmentStoreId,
              remarks: item.remarks,
              quantity: item.quantity,
            })),
          });
        }}
      >
        Create Order
      </Button>
    </div>
  );
};

export default StepFive;
