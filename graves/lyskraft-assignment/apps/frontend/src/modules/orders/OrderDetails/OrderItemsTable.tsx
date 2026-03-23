import { Table } from '@mantine/core';
import { Item } from '../../../redux/orders/types';
import * as Styles from './styles';

interface IOrderItemsTableProps {
  items: Item[];
}

const OrderItemsTable = ({ items }: IOrderItemsTableProps) => {
  return (
    <Styles.TableWrapper>
      <Table striped>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Product</Table.Th>
            <Table.Th>Size</Table.Th>
            <Table.Th>Color</Table.Th>
            <Table.Th>Selling Price</Table.Th>
            <Table.Th>Stock Type</Table.Th>
            <Table.Th>Billing Store</Table.Th>
            <Table.Th>Fulfilment Store</Table.Th>
            <Table.Th>Quantity</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {items.map((item) => (
            <Table.Tr key={item.id}>
              <Table.Td>{item.product.title}</Table.Td>
              <Table.Td>{item.size}</Table.Td>
              <Table.Td>{item.color}</Table.Td>
              <Table.Td>{item.sellingPrice}</Table.Td>
              <Table.Td>{item.stockType}</Table.Td>
              <Table.Td>{item.billingStore?.name}</Table.Td>
              <Table.Td>{item.fulfilmentStore?.name}</Table.Td>
              <Table.Td>{item.quantity}</Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
    </Styles.TableWrapper>
  );
};

export default OrderItemsTable;
