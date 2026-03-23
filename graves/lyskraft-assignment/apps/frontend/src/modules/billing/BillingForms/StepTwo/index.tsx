import { useState } from 'react';
import { useDisclosure } from '@mantine/hooks';
import { useDebouncedCallback } from '@mantine/hooks';
import { Flex, Loader, Modal, Text, TextInput, Title } from '@mantine/core';
import {
  useLazyGetCustomersQuery,
  useLazyGetCustomerAddressesQuery,
} from '../../../../redux/billing/api';
import { useTypedSelector } from '../../../../redux/useTypedSelector';
import CreateCustomer from './CreateCustomer';
import { setAddressId, setCustomer } from '../../../../redux/cart';
import useAppDispatch from '../../../../redux/useAppDispatch';
import * as Styles from './styles';
import CreateAddress from './CreateAddress';
import { Customer } from '@prisma/client';

const StepTwo = () => {
  const dispatch = useAppDispatch();

  const orderItems = useTypedSelector((store) => store.cart.orderItems);
  const selectedCustomer = useTypedSelector((store) => store.cart.customer);

  const [searchQuery, setSearchQuery] = useState('');
  const [searchCustomer, searchCustomerResult] = useLazyGetCustomersQuery();
  const [getCustomerAddresses, getCustomerAddressesResult] =
    useLazyGetCustomerAddressesQuery();

  const [
    isCustomerModalOpen,
    { open: openCustomerModal, close: closeCustomerModal },
  ] = useDisclosure(false);

  const [
    isAddressModalOpen,
    { open: openAddressModal, close: closeAddressModal },
  ] = useDisclosure(false);

  const handleSearchCustomers = useDebouncedCallback(async (query: string) => {
    searchCustomer(query);
  }, 500);

  const handleChangeSearchQuery = (value: string) => {
    setSearchQuery(value);
    handleSearchCustomers(value);
  };

  const customerSelectSuccessCallback = (customer: Customer) => {
    const doesMtoExist = orderItems.some((item) => item.stockType === 'MTO');

    const isServiceFromAnotherStore = orderItems.some(
      (item) => item.billingStoreId !== item.fulfilmentStoreId
    );

    if (doesMtoExist || isServiceFromAnotherStore) {
      closeCustomerModal();
      getCustomerAddresses(customer.id);
      openAddressModal();
      return;
    }

    closeCustomerModal();
  };

  const addressSelectSuccessCallback = () => {
    closeAddressModal();
  };

  return (
    <div>
      {selectedCustomer.id && (
        <Flex direction="column" gap={12}>
          <Title order={4}>Selected Customer : </Title>
          <Text>
            {selectedCustomer.name} - {selectedCustomer.phone}
          </Text>
        </Flex>
      )}

      <TextInput
        size="md"
        radius="md"
        label={selectedCustomer.id ? 'Change Customer' : 'Search Customers'}
        placeholder="Name / Phone Number"
        onClick={openCustomerModal}
      />
      <Modal
        centered
        opened={isCustomerModalOpen}
        onClose={closeCustomerModal}
        title={<Title order={3}>Select Customer</Title>}
        size="lg"
        h={500}
        ff="text"
        overlayProps={{
          backgroundOpacity: 0.55,
          blur: 3,
        }}
      >
        <TextInput
          size="md"
          radius="md"
          label="Search Customers"
          placeholder="Name / Phone Number"
          onClick={openCustomerModal}
          value={searchQuery}
          onChange={(event) =>
            handleChangeSearchQuery(event.currentTarget.value)
          }
          rightSection={searchCustomerResult.isFetching && <Loader size={20} />}
        />

        {searchQuery.length === 0 && <Text>Start by Searching something</Text>}

        {!searchCustomerResult.isFetching &&
          searchQuery.length > 0 &&
          searchCustomerResult.data?.length === 0 && (
            <Flex direction="column">
              <Text>No Customers Found with query "{searchQuery}"</Text>
              <CreateCustomer successCallback={customerSelectSuccessCallback} />
            </Flex>
          )}
        {searchCustomerResult.data && searchCustomerResult.data.length > 0 && (
          <div
            style={{
              maxHeight: 300,
              overflow: 'auto',
              marginTop: 10,
              border: '1px solid #e1e1e1',
              borderRadius: 8,
            }}
          >
            {searchCustomerResult.data.map((customer) => (
              <Styles.CustomerListItem
                key={customer.id}
                onClick={() => {
                  dispatch(setCustomer(customer));
                  customerSelectSuccessCallback(customer);
                }}
              >
                <Text p={10}>
                  {customer.name} - {customer.phone}
                </Text>
              </Styles.CustomerListItem>
            ))}
          </div>
        )}
      </Modal>

      <Modal
        centered
        opened={isAddressModalOpen}
        onClose={closeAddressModal}
        title={<Title order={3}>Choose Delivery Address</Title>}
        size="lg"
        h={500}
        ff="text"
        overlayProps={{
          backgroundOpacity: 0.55,
          blur: 3,
        }}
      >
        {getCustomerAddressesResult.data &&
          getCustomerAddressesResult.data.length > 0 && (
            <div
              style={{
                maxHeight: 200,
                overflow: 'auto',
                marginTop: 10,
                border: '1px solid #e1e1e1',
                borderRadius: 8,
              }}
            >
              {getCustomerAddressesResult.data.map((address) => (
                <Styles.CustomerListItem
                  key={address.id}
                  onClick={() => {
                    dispatch(setAddressId(address.id));
                    addressSelectSuccessCallback();
                  }}
                >
                  <Text p={10}>
                    {address.addressLine} - {address.city}, {address.state},{' '}
                    {address.pincode}
                  </Text>
                </Styles.CustomerListItem>
              ))}
            </div>
          )}
        <CreateAddress
          customerId={selectedCustomer.id}
          createAddressSuccessCallback={() => {
            getCustomerAddresses(selectedCustomer.id);
            // addressSelectSuccessCallback();
          }}
        />
      </Modal>
    </div>
  );
};

export default StepTwo;
