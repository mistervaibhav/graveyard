import { Stepper as MantineStepper } from '@mantine/core';
import { useTypedSelector } from '../../../redux/useTypedSelector';
import { StyledStepper, StyledStep } from './styles';
import { setCurrentBillingStep } from '../../../redux/cart';
import useAppDispatch from '../../../redux/useAppDispatch';

const Stepper = () => {
  const dispatch = useAppDispatch();
  const currentStep = useTypedSelector((store) => store.cart.currentStep);
  const canOrderBeCreated = useTypedSelector(
    (store) => store.cart.canOrderBeCreated
  );

  return (
    <StyledStepper
      size="lg"
      active={currentStep}
      onStepClick={(step) => dispatch(setCurrentBillingStep(step))}
      orientation="vertical"
    >
      <StyledStep label="Items" description="Add items to cart" />
      <StyledStep label="Customer" description="Select Customer" />
      <StyledStep label="Sales" description="Select Sales Associate" />
      <StyledStep label="Payment" description="Make Money" />
      {canOrderBeCreated && <StyledStep label="Create Order" description="" />}
    </StyledStepper>
  );
};

export default Stepper;
