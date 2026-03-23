import { useState } from 'react';
import Login from './Login';
import Register from './Register';
import { Center, Title } from '@mantine/core';

const Auth = () => {
  const [mode, setMode] = useState<'login' | 'register'>('login');

  return (
    <Center h="100vh">
      {mode === 'login' ? (
        <Login switchToRegister={() => setMode('register')} />
      ) : (
        <Register switchToLogin={() => setMode('login')} />
      )}
    </Center>
  );
};

export default Auth;
