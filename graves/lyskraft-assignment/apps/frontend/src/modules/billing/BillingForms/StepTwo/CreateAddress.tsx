import { Button, Flex, Text, TextInput, Textarea } from '@mantine/core';
import { useCreateAddressForCustomerMutation } from '../../../../redux/billing/api';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

interface ICreateAddressProps {
  customerId: string;
  createAddressSuccessCallback: () => void;
}
const CreateAddress = ({
  customerId,
  createAddressSuccessCallback,
}: ICreateAddressProps) => {
  const [formData, setFormData] = useState({
    addressLine: '',
    city: '',
    state: '',
    pincode: '',
  });

  const [createAddress, createAddressResult] =
    useCreateAddressForCustomerMutation();

  useEffect(() => {
    if (createAddressResult.isSuccess) {
      toast.success('Address Created Successfully');
      createAddressSuccessCallback();
    }
  }, [createAddressResult]);

  return (
    <Flex direction="column" gap={12}>
      <Text size="lg">Create a new Address</Text>
      <TextInput
        size="md"
        radius="md"
        label="City"
        placeholder="eg. Gurgaon"
        value={formData.city}
        onChange={(event) =>
          setFormData((prev) => ({ ...prev, city: event.target.value }))
        }
      />
      <TextInput
        size="md"
        radius="md"
        label="State"
        placeholder="eg. Haryana"
        value={formData.state}
        onChange={(event) =>
          setFormData((prev) => ({ ...prev, state: event.target.value }))
        }
      />
      <TextInput
        size="md"
        radius="md"
        label="Pincode"
        placeholder="eg. Haryana"
        value={formData.pincode}
        onChange={(event) =>
          setFormData((prev) => ({ ...prev, pincode: event.target.value }))
        }
      />
      <Textarea
        size="md"
        radius="md"
        label="Address Line"
        placeholder="eg. 221 B, Baker Street"
        value={formData.addressLine}
        onChange={(event) =>
          setFormData((prev) => ({ ...prev, addressLine: event.target.value }))
        }
      />
      <Flex justify="flex-end" gap={24} mt={24}>
        <Button variant="subtle">Cancel</Button>
        <Button
          loading={createAddressResult.isLoading}
          onClick={() => {
            if (
              formData.addressLine === '' ||
              formData.city === '' ||
              formData.state === '' ||
              formData.pincode === ''
            ) {
              return;
            }

            createAddress({
              customerId,
              addressLine: formData.addressLine,
              city: formData.city,
              state: formData.state,
              pincode: formData.pincode,
            });

            setFormData({
              addressLine: '',
              city: '',
              state: '',
              pincode: '',
            });
          }}
        >
          Add new Address
        </Button>
      </Flex>
    </Flex>
  );
};

export default CreateAddress;
