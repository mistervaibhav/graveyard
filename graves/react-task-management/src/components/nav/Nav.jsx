import React from 'react';
import { Link, withRouter } from 'react-router-dom';

const Nav = () => {
  return (
    <nav className='navbar navbar-expand-md navbar-dark bg-dark'>
      <Link className='navbar-brand' to='/'>
        <h2>Task Management</h2>
      </Link>
      <button className='navbar-toggler' data-toggle='collapse' data-target='#navbarMenu'>
        <span className='navbar-toggler-icon'></span>
      </button>
      <div className='collapse navbar-collapse' id='navbarMenu'>
        <ul className='navbar-nav ml-auto'>
          <li className='nav-item'>
            <Link className='nav-link' to='/login'>
              <h4>Login</h4>
            </Link>
          </li>
          <li className='nav-item'>
            <Link className='nav-link' to='/register'>
              <h4>Register</h4>
            </Link>
          </li>
          <li className='nav-item'>
            <span style={{ cursor: 'pointer' }} className='nav-link'>
              <h4>Logout</h4>
            </span>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default withRouter(Nav);
