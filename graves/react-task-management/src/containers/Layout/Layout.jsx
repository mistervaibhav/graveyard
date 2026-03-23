import React from 'react';
import Nav from '../../components/nav/Nav';

const Layout = ({ children }) => {
  return (
    <div>
      <Nav />
      <div className='container-fluid'>{children}</div>
    </div>
  );
};

export default Layout;
