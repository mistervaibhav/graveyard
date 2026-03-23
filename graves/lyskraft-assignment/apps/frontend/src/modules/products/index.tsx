import { Checkbox, Flex, Title } from '@mantine/core';
import ProductsTable from './ProductsTable';
import { useGetProductsQuery } from '../../redux/products/api';
import { useState } from 'react';

export function Products() {
  const [filters, setFilters] = useState<{
    inStock: null | boolean;
  }>({
    inStock: null,
  });

  const { data, isFetching, isLoading } = useGetProductsQuery(filters);

  return (
    <Flex direction="column" gap={24} px={24} py={20} flex={1}>
      <Flex align="center">
        <Title> {filters.inStock ? 'Products in stock' : 'All Products'}</Title>
        <Flex justify="flex-end" flex={1} gap={24}>
          <Checkbox
            checked={filters.inStock ?? false}
            radius="sm"
            label="Show products in stock"
            onChange={() =>
              setFilters((prev) => ({ ...prev, inStock: !prev.inStock }))
            }
          />
        </Flex>
      </Flex>
      <ProductsTable data={data ?? []} isLoading={isFetching || isLoading} />
    </Flex>
  );
}

export default Products;
