import { IoTrash } from 'react-icons/io5';
import { ActionIcon, Flex, Image, Table, Text, Title } from '@mantine/core';
import { useTypedSelector } from '../../../../redux/useTypedSelector';
import { AddedProductsWrapper } from './styles';
import { deleteOrderItem } from '../../../../redux/cart';
import useAppDispatch from '../../../../redux/useAppDispatch';

const AddedProducts = () => {
  const dispatch = useAppDispatch();

  const products = useTypedSelector(
    (store) =>
      store.cart.orderItems.map((item) => ({
        orderItemId: item.id,
        ...item.product,
        stockType: item.stockType,
      })) ?? []
  );

  if (products.length === 0) {
    return null;
  }

  const rows = products?.map((element, index) => (
    <Table.Tr key={element.id}>
      <Table.Td>
        <Flex align="center">
          <Text size="sm">{index + 1}</Text>
        </Flex>
      </Table.Td>
      <Table.Td>
        <Flex gap={12} align="center">
          <Image
            h={48}
            w={48}
            radius="md"
            src={element.image}
            fallbackSrc="https://placehold.co/48x48?text=No+Image"
            loading="lazy"
          />
          <Flex direction="column" gap={12}>
            <Text size="sm">{element.title}</Text>
          </Flex>
        </Flex>
      </Table.Td>
      <Table.Td>{element.stockType}</Table.Td>

      <Table.Td>
        <Flex align="center">
          <Text size="sm">{element.price}</Text>
        </Flex>
      </Table.Td>
      <Table.Td>
        <ActionIcon
          variant="light"
          onClick={() => {
            dispatch(deleteOrderItem(element.orderItemId));
          }}
        >
          <IoTrash />
        </ActionIcon>
      </Table.Td>
    </Table.Tr>
  ));

  const totalSum = products?.reduce((acc, curr) => {
    return acc + Number(curr.price);
  }, 0);

  return (
    <Flex direction="column">
      <AddedProductsWrapper>
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
              <Table.Th>Product</Table.Th>
              <Table.Th>Stock Type</Table.Th>
              <Table.Th w={150}>Price (INR)</Table.Th>
              <Table.Th w={150}></Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>{rows}</Table.Tbody>
        </Table>
      </AddedProductsWrapper>

      <Flex justify="flex-end" align="center" px={48} gap={24}>
        <Text size="lg">Total Price</Text>
        <Title order={5}>INR {totalSum}</Title>
      </Flex>
    </Flex>
  );
};

export default AddedProducts;
