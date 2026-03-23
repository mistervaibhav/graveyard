import { Select } from '@mantine/core';
import { useTypedSelector } from '../../../../redux/useTypedSelector';
import { setPaymentMode } from '../../../../redux/cart';
import useAppDispatch from '../../../../redux/useAppDispatch';

const StepFour = () => {
  const dispatch = useAppDispatch();
  const paymentMode = useTypedSelector((store) => store.cart.paymentMode);

  return (
    <div>
      <Select
        searchable
        label="Select mode of payment"
        placeholder="Pick one"
        value={paymentMode}
        data={['Cash', 'Credit Card']}
        onChange={(value) => dispatch(setPaymentMode(value ?? ''))}
      />
    </div>
  );
};

export default StepFour;
