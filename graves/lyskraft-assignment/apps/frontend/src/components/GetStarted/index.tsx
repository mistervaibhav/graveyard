import { Flex, Text, Title } from '@mantine/core';

const GetStarted = () => {
  return (
    <Flex flex={1} direction="column" gap={24} px={24} py={20}>
      <Title>Welcome</Title>
      <Text>
        Get Started by selecting one of the modules on the left sidebar
      </Text>
    </Flex>
  );
};

export default GetStarted;
