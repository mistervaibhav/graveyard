import Lottie from 'react-lottie';
import * as animationData from './animation.json';
import { Button, Flex } from '@mantine/core';
import useAppDispatch from '../../../../redux/useAppDispatch';
import { setCurrentBillingStep } from '../../../../redux/cart';

const defaultOptions = {
  loop: true,
  autoplay: true,
  animationData: animationData,
  rendererSettings: {
    preserveAspectRatio: 'xMidYMid slice',
  },
};

const GetStarted = () => {
  const dispatch = useAppDispatch();

  return (
    <Flex
      flex={1}
      gap={72}
      direction="column"
      //   justify="center"
      align="center"
    >
      <Lottie
        isClickToPauseDisabled
        options={defaultOptions}
        height={400}
        width={400}
      />
      <Button
        w={300}
        size="lg"
        onClick={() => {
          dispatch(setCurrentBillingStep(0));
        }}
      >
        Create a New Bill
      </Button>
    </Flex>
  );
};

export default GetStarted;
