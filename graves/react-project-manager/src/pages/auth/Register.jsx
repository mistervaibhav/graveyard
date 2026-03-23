import React, { useState } from 'react';

const Register = () => {
  const [details, setDetails] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  });

  const handleChange = (name) => (e) => {
    setDetails({ ...details, [name]: e.target.value });
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    // console.log(details);
  };

  return (
    <div className='container'>
      <form onSubmit={handleSubmit}>
        <h4 className='grey-text text-darken-3'>Sign Up</h4>
        <div className='input-field'>
          <label htmlFor='firstName'>First Name</label>
          <input onChange={handleChange('firstName')} type='text' id='firstName' />
        </div>
        <div className='input-field'>
          <label htmlFor='lastName'>Last Name</label>
          <input onChange={handleChange('lastName')} type='text' id='lastName' />
        </div>
        <div className='input-field'>
          <label htmlFor='email'>Email</label>
          <input onChange={handleChange('email')} type='email' id='email' />
        </div>
        <div className='input-field'>
          <label htmlFor='password'>Password</label>
          <input onChange={handleChange('password')} type='password' id='password' />
        </div>
        <div className='input-field'>
          <button className='btn orange darken-1'>Register</button>
        </div>
      </form>
    </div>
  );
};

export default Register;
