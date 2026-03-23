import React, { useState } from 'react';

const Login = () => {
  const [details, setDetails] = useState({
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
        <h4 className='grey-text text-darken-3'>Log In</h4>
        <div className='input-field'>
          <label htmlFor='email'>Email</label>
          <input onChange={handleChange('email')} type='email' id='email' />
        </div>
        <div className='input-field'>
          <label htmlFor='password'>Password</label>
          <input onChange={handleChange('password')} type='password' id='password' />
        </div>
        <div className='input-field'>
          <button className='btn orange darken-1'>Login</button>
        </div>
      </form>
    </div>
  );
};

export default Login;
