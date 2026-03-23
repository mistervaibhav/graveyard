import { Flex, Title } from '@mantine/core';
import OrdersTable from './OrdersTable';
import OrderDetails from './OrderDetails';
import { useDisclosure } from '@mantine/hooks';
import { useState } from 'react';

export function Orders() {
  const [selectedOrderId, setSelectedOrderId] = useState<string>('');

  const [
    isOrderDetailsDrawerOpen,
    { open: openOrderDetailsDrawer, close: closeOrderDetailsDrawer },
  ] = useDisclosure(false);

  return (
    <Flex direction="column" gap={24} px={24} py={20} flex={1}>
      <OrdersTable
        onOrderSelect={(orderId) => {
          setSelectedOrderId(orderId);
          openOrderDetailsDrawer();
        }}
      />
      <OrderDetails
        orderId={selectedOrderId}
        isOpen={isOrderDetailsDrawerOpen}
        onClose={closeOrderDetailsDrawer}
      />
    </Flex>
  );
}

export default Orders;
