import { Button, TextInput, Select, Text } from '@mantine/core';
import * as Styles from './styles';
import { useGetStoresQuery } from '../../../redux/stores/api';
import { useRegisterUserMutation } from '../../../redux/auth/api';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface IRegisterProps {
  switchToLogin: () => void;
}

const Register = ({ switchToLogin }: IRegisterProps) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    storeId: '',
  });

  const { data: stores, isFetching: isStoresFetching } = useGetStoresQuery();
  const [registerUser, userRegisterResult] = useRegisterUserMutation();

  const handleFormChange = (key: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  useEffect(() => {
    if (userRegisterResult.isSuccess) {
      toast('User registered successfully', { icon: '🎉' });
      switchToLogin();
    }
  }, [userRegisterResult]);

  return (
    <Styles.Wrapper>
      <TextInput
        label="Name"
        placeholder="John Doe"
        radius="md"
        size="sm"
        onChange={(event) => handleFormChange('name', event.target.value)}
        value={formData.name}
      />
      <TextInput
        label="Email"
        placeholder="john.doe@gmail.com"
        radius="md"
        size="sm"
        type="email"
        value={formData.email}
        onChange={(event) => handleFormChange('email', event.target.value)}
        error={
          formData.email && !emailRegex.test(formData.email)
            ? 'Invalid email'
            : ''
        }
      />
      <TextInput
        label="Password"
        placeholder="*********"
        radius="md"
        size="md"
        type="password"
        value={formData.password}
        onChange={(event) => handleFormChange('password', event.target.value)}
      />
      <TextInput
        label="Confirm your Password"
        placeholder="*********"
        radius="md"
        size="sm"
        type="password"
        value={formData.confirmPassword}
        onChange={(event) =>
          handleFormChange('confirmPassword', event.target.value)
        }
        error={
          formData.confirmPassword &&
          formData.password !== formData.confirmPassword &&
          'Passwords do not match'
        }
      />
      <Select
        size="sm"
        disabled={isStoresFetching}
        label="Select your store"
        placeholder=""
        data={stores?.map((item) => ({ value: item.id, label: item.name }))}
        value={formData.storeId}
        onChange={(value) => handleFormChange('storeId', value as string)}
      />
      <Button
        size="sm"
        loading={userRegisterResult.isLoading}
        onClick={() => {
          registerUser(formData);
        }}
      >
        Register
      </Button>
      <Button size="xs" variant="subtle" onClick={switchToLogin}>
        Already a member ? Click here
      </Button>

      {userRegisterResult.isError && (
        // @ts-expect-error data does exist on error
        <Text c="red">{userRegisterResult.error?.data?.message}</Text>
      )}
    </Styles.Wrapper>
  );
};

export default Register;
