import { useTypedSelector } from '../../../redux/useTypedSelector';
import Footer from './Footer';
import GetStarted from './GetStarted';
import StepFive from './StepFive';
import StepFour from './StepFour';
import StepOne from './StepOne';
import StepThree from './StepThree';
import StepTwo from './StepTwo';
import * as Styles from './styles';

const BillingForms = () => {
  const currentStep = useTypedSelector((store) => store.cart.currentStep);

  return (
    <Styles.Wrapper>
      {/* <Header /> */}
      {currentStep === -1 && <GetStarted />}
      {currentStep === 0 && <StepOne />}
      {currentStep === 1 && <StepTwo />}
      {currentStep === 2 && <StepThree />}
      {currentStep === 3 && <StepFour />}
      {currentStep === 4 && <StepFive />}
      {/* <Footer /> */}
    </Styles.Wrapper>
  );
};

export default BillingForms;
