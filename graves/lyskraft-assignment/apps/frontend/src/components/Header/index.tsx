import { Avatar, Text, Title } from '@mantine/core';
import { useTypedSelector } from '../../redux/useTypedSelector';
import * as Styles from './styles';

export const getNameInitials = (name = '') => {
  name = name ? name.trim() : '';
  const parts = name.split(' ');
  let initials = '';

  if (name.length === 0) {
    initials = '';
  } else {
    parts.length > 1
      ? (initials =
          parts[0][0].toUpperCase() + parts[parts.length - 1][0].toUpperCase())
      : (initials = parts[0][0].toUpperCase());
  }
  return initials;
};

const Header = () => {
  const user = useTypedSelector((state) => state.user);

  return (
    <Styles.Wrapper>
      <Styles.Left>
        <Title order={5}>Store : {user.store.name}</Title>
      </Styles.Left>
      <Styles.Right>
        <Text> {user.name}</Text>
        <Avatar size="md" radius="xl">
          {getNameInitials(user.name ?? '')}
        </Avatar>
      </Styles.Right>
    </Styles.Wrapper>
  );
};

export default Header;
