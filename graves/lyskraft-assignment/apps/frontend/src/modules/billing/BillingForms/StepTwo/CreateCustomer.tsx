import React, { useEffect, useState } from 'react';
import { Button, Flex, Text, TextInput } from '@mantine/core';
import { useCreateCustomerMutation } from '../../../../redux/billing/api';
import { setCustomer } from '../../../../redux/cart';
import useAppDispatch from '../../../../redux/useAppDispatch';
import toast from 'react-hot-toast';
import { Customer } from '@prisma/client';

interface ICreateCustomerProps {
  successCallback: (customer: Customer) => void;
}

const CreateCustomer = ({ successCallback }: ICreateCustomerProps) => {
  const dispatch = useAppDispatch();

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
  });

  const [createCustomer, createCustomerResult] = useCreateCustomerMutation();

  useEffect(() => {
    if (createCustomerResult.isSuccess) {
      setFormData({
        name: '',
        phone: '',
      });
      toast.success('Customer created successfully');
      dispatch(setCustomer(createCustomerResult.data));
      successCallback(createCustomerResult.data);
    }
  }, [createCustomerResult]);

  return (
    <div>
      <Text>Create New Customer</Text>
      <TextInput
        size="md"
        radius="md"
        label="Name"
        placeholder="Name"
        value={formData.name}
        onChange={(event) =>
          setFormData({ ...formData, name: event.target.value })
        }
      />
      <TextInput
        size="md"
        radius="md"
        label="Phone Number"
        placeholder="Phone Number"
        type="tel"
        value={formData.phone}
        onChange={(event) =>
          setFormData({ ...formData, phone: event.target.value })
        }
      />
      <Button
        loading={createCustomerResult.isLoading}
        disabled={!formData.name || !formData.phone}
        onClick={() => {
          createCustomer(formData);
        }}
      >
        Add Customer
      </Button>
    </div>
  );
};

export default CreateCustomer;
