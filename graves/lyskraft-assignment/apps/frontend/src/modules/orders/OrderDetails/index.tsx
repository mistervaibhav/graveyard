import { Drawer, Skeleton, Title } from '@mantine/core';
import { useGetOrderByIdQuery } from '../../../redux/orders/api';
import OrderItemsTable from './OrderItemsTable';

interface IOrderDetailsProps {
  isOpen: boolean;
  onClose: () => void;
  orderId: string;
}

const OrderDetails = ({ isOpen, onClose, orderId }: IOrderDetailsProps) => {
  const { data, isFetching, isLoading } = useGetOrderByIdQuery(orderId);

  return (
    <Drawer
      position="right"
      size="60vw"
      offset={8}
      opened={isOpen}
      onClose={onClose}
      title={<Title order={3}>Order Details</Title>}
      ff="text"
      overlayProps={{
        backgroundOpacity: 0.55,
        blur: 3,
      }}
    >
      <Title order={6}>Order ID: {orderId}</Title>
      {data?.items && (
        <Skeleton visible={isFetching || isLoading}>
          <OrderItemsTable items={data.items} />
        </Skeleton>
      )}
    </Drawer>
  );
};

export default OrderDetails;
