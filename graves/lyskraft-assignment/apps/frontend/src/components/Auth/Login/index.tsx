import { Button, Text, TextInput } from '@mantine/core';
import * as Styles from './styles';
import { useEffect, useState } from 'react';
import { useLoginUserMutation } from '../../../redux/auth/api';
import toast from 'react-hot-toast';
import { setUserState } from '../../../redux/user';
import useAppDispatch from '../../../redux/useAppDispatch';

interface ILoginProps {
  switchToRegister: () => void;
}

const Login = ({ switchToRegister }: ILoginProps) => {
  const dispatch = useAppDispatch();

  const [login, loginResult] = useLoginUserMutation();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleFormChange = (key: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  useEffect(() => {
    if (loginResult.isSuccess) {
      toast('Logged in successfully', { icon: '🎉' });
      dispatch(setUserState(loginResult.data));
    }
  }, [loginResult]);

  return (
    <Styles.Wrapper>
      <TextInput
        label="Email"
        placeholder="john.doe@gmail.com"
        radius="md"
        size="sm"
        type="email"
        value={formData.email}
        onChange={(event) => handleFormChange('email', event.target.value)}
      />
      <TextInput
        label="Password"
        placeholder="*********"
        radius="md"
        size="sm"
        type="password"
        value={formData.password}
        onChange={(event) => handleFormChange('password', event.target.value)}
      />
      <Button
        size="sm"
        loading={loginResult.isLoading}
        onClick={() => {
          login(formData);
        }}
      >
        Login
      </Button>
      <Button size="xs" variant="subtle" onClick={switchToRegister}>
        Don't have an account ? Click here
      </Button>

      {loginResult.isError && (
        // @ts-expect-error data does exist on error
        <Text c="red">{loginResult.error?.data?.message}</Text>
      )}
    </Styles.Wrapper>
  );
};

export default Login;
