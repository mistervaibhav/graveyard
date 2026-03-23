import { Link, useLocation } from 'react-router-dom';
import { Button, Flex, Title } from '@mantine/core';
import { CiReceipt, CiShoppingCart, CiLogout, CiBoxList } from 'react-icons/ci';
import useAppDispatch from '../../redux/useAppDispatch';
import { resetUserState } from '../../redux/user';
import * as Styles from './styles';

const getButtonVariant = (pathname: string, path: string) => {
  if (pathname.includes(path)) {
    return 'light';
  }

  return 'subtle';
};

const Sidebar = () => {
  const { pathname } = useLocation();

  const dispatch = useAppDispatch();

  return (
    <Styles.Wrapper>
      <Flex direction="column" h={75} px={48} py={20}>
        <Title order={3}>Lyskraft</Title>
        <Title order={6}>Assignment</Title>
      </Flex>
      <Styles.SidebarBody>
        <Link to="/orders">
          <Button
            justify="flex-start"
            variant={getButtonVariant(pathname, 'orders')}
            leftSection={<CiShoppingCart strokeWidth={1} />}
            fullWidth
          >
            Orders
          </Button>
        </Link>
        <Link to="/products">
          <Button
            justify="flex-start"
            variant={getButtonVariant(pathname, 'products')}
            leftSection={<CiBoxList strokeWidth={1} />}
            fullWidth
          >
            Products
          </Button>
        </Link>
        <Link to="/billing">
          <Button
            justify="flex-start"
            variant={getButtonVariant(pathname, 'billing')}
            leftSection={<CiReceipt strokeWidth={1} />}
            fullWidth
          >
            Billing
          </Button>
        </Link>
      </Styles.SidebarBody>
      <Styles.SidebarFooter>
        <Button
          justify="flex-start"
          variant="subtle"
          leftSection={<CiLogout strokeWidth={1} />}
          fullWidth
          onClick={() => {
            dispatch(resetUserState());
          }}
        >
          Logout
        </Button>
      </Styles.SidebarFooter>
    </Styles.Wrapper>
  );
};

export default Sidebar;
