import { Table, Image, Flex, Text, Skeleton } from '@mantine/core';
import * as Styles from './styles';
import { Product } from '@prisma/client';

interface IProductsTableProps {
  data: Array<Product>;
  isLoading: boolean;
}

const ProductsTable = ({ data, isLoading }: IProductsTableProps) => {
  // if (isFetching || isLoading) {
  //   return <div>Loading...</div>;
  // }

  const rows = data?.map((element, index) => (
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
            <Text size="xs">{element.description}</Text>
          </Flex>
        </Flex>
      </Table.Td>
      <Table.Td>{element.brand}</Table.Td>
      <Table.Td>{element.color}</Table.Td>
      <Table.Td>
        <Flex align="center">
          <Text size="sm">{element.sizes.join(',')}</Text>
        </Flex>
      </Table.Td>
      <Table.Td>
        <Flex align="center">
          <Text size="sm">{element.price}</Text>
        </Flex>
      </Table.Td>
    </Table.Tr>
  ));

  return (
    <Skeleton visible={isLoading}>
      <Styles.Wrapper>
        <Table stickyHeader striped horizontalSpacing="sm" verticalSpacing="sm">
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Serial</Table.Th>
              <Table.Th>Product</Table.Th>
              <Table.Th>Brand</Table.Th>
              <Table.Th>Color</Table.Th>
              <Table.Th>Sizes</Table.Th>
              <Table.Th w={150}>Price (INR)</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>{rows}</Table.Tbody>
        </Table>
      </Styles.Wrapper>
    </Skeleton>
  );
};

export default ProductsTable;
