import { useState } from 'react';
import { useGetOrdersQuery } from '../../../redux/orders/api';
import { Table, Flex, Skeleton, Title, Select } from '@mantine/core';
import * as Styles from './styles';

interface IOrdersTableProps {
  onOrderSelect: (orderId: string) => void;
}

const OrdersTable = ({ onOrderSelect }: IOrdersTableProps) => {
  const [filters, setFilters] = useState<{
    paymentStatus: string;
    orderStatus: string;
  }>({
    paymentStatus: 'ALL',
    orderStatus: 'ALL',
  });

  const { data, isFetching, isLoading } = useGetOrdersQuery(filters);

  const rows = data?.map((element, index) => (
    <Table.Tr key={element.id} onClick={() => onOrderSelect(element.id)}>
      <Table.Td>{index + 1}</Table.Td>
      <Table.Td>{element.customer.name}</Table.Td>
      <Table.Td>{element.paymentMode}</Table.Td>
      <Table.Td>{element.salesStaff.name}</Table.Td>
      <Table.Td>{element.status}</Table.Td>
    </Table.Tr>
  ));

  return (
    <Flex direction="column" gap={24}>
      <Flex>
        <Title>Orders</Title>
        <Flex flex={1} justify="flex-end" gap={24}>
          <Select
            size="xs"
            label="Payment Status"
            placeholder="eg. COMPLETED"
            value={filters.paymentStatus}
            defaultValue={'ALL'}
            data={['ALL', 'COMPLETED', 'PENDING']}
            onChange={(value) => {
              if (!value) return;
              setFilters((prev) => ({ ...prev, paymentStatus: value }));
            }}
          />
          <Select
            size="xs"
            label="Order Status"
            placeholder="eg. DRAFT"
            value={filters.orderStatus}
            defaultValue={'ALL'}
            data={['ALL', 'DRAFT', 'RUNNING', 'FULFILLED']}
            onChange={(value) => {
              if (!value) return;
              setFilters((prev) => ({ ...prev, orderStatus: value }));
            }}
          />
        </Flex>
      </Flex>
      <Skeleton visible={isFetching || isLoading}>
        <Styles.Wrapper>
          <Table
            stickyHeader
            striped
            highlightOnHover
            horizontalSpacing="sm"
            verticalSpacing="sm"
          >
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Serial</Table.Th>
                <Table.Th>Customer</Table.Th>
                <Table.Th>Payment Mode</Table.Th>
                <Table.Th>Sales Associate</Table.Th>
                <Table.Th>Status</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>{rows}</Table.Tbody>
          </Table>
        </Styles.Wrapper>
      </Skeleton>
    </Flex>
  );
};

export default OrdersTable;
