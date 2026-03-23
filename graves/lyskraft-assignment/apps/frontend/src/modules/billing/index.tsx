import { Button, Flex, Title } from '@mantine/core';
import Stepper from './Stepper';
import * as Styles from './styles';
import BillingForms from './BillingForms';

const Billing = () => {
  return (
    <Flex flex={1} direction="column" gap={24} px={24} py={20}>
      <Title>Billing</Title>
      <Flex gap={24} flex={1}>
        <Stepper />
        <BillingForms />
      </Flex>
    </Flex>
  );
};

export default Billing;
