import React from 'react';
import { Link, NavLink } from 'react-router-dom';

const SignedInLinks = () => {
  return (
    <ul className='right'>
      <li>
        <NavLink to='/new'>New Project</NavLink>
      </li>
      <li>
        <NavLink to='/'>Logout</NavLink>
      </li>
      <li>
        <NavLink to='/' className='btn btn-floating orange darken-1'>
          JD
        </NavLink>
      </li>
    </ul>
  );
};

const SignedOutLinks = () => {
  return (
    <ul className='right'>
      <li>
        <NavLink to='/register'>Sign Up</NavLink>
      </li>
      <li>
        <NavLink to='/login'>Log In</NavLink>
      </li>
    </ul>
  );
};

const Navbar = () => {
  return (
    <nav className='nav-wrapper blue-grey darken-3'>
      <div className='container'>
        <Link to='/' className='brand-logo'>
          Project Manager
        </Link>
        <SignedInLinks />
        <SignedOutLinks />
      </div>
    </nav>
  );
};

export default Navbar;
