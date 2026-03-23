import { Outlet } from 'react-router-dom';
import '@mantine/core/styles.css';
import Header from '../Header';
import Sidebar from '../Sidebar';
import * as Styles from './styles';

export function Layout() {
  return (
    <Styles.Wrapper>
      <Styles.Left>
        <Sidebar />
      </Styles.Left>
      <Styles.Right>
        <Header />
        <Styles.Bottom>
          <Outlet />
        </Styles.Bottom>
      </Styles.Right>
    </Styles.Wrapper>
  );
}

export default Layout;
