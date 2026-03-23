import React, { useState } from 'react';
import regImg from '../../assets/regImg.jpg';
import Layout from '../../containers/Layout/Layout';
import { Link } from 'react-router-dom';

import { register } from './helper/index';

const Register = () => {
  //

  const [formData, setFormData] = useState({
    username: 'alpha',
    email: 'alpha@test.com',
    password: 'password',
    error: '',
  });

  const { username, email, password } = formData;

  //* TO GATHER INPUT FROM THE FORM
  const inputHandler = (input) => async (event) => {
    await setFormData({
      ...formData,
      error: false,
      [input]: event.target.value,
    });
  };

  //* TO SUBMIT GATHERED DATA TO THE BACKEND
  const submitHandler = async (event) => {
    //
    event.preventDefault();

    await setFormData({
      ...formData,
      error: false,
    });
    await register({ username, email, password })
      .then((data) => {
        if (data.error) {
          setFormData({
            ...formData,
            error: data.error,
          });
        } else {
          setFormData({
            ...formData,
            username: '',
            email: '',
            password: '',
            error: '',
          });
        }
      })
      .catch((error) => console.log('error in registering user'));
  };

  //* THE LOGIN COMPONENT
  return (
    <Layout>
      <div className='row'>
        <div className='card col-md-3 mx-auto px-0'>
          <img className='card-img-top' src={regImg} alt='Loading...' />
          <div className='card-body'>
            <h4 className='card-title text-center'>Register</h4>
            <form>
              <div className='form-group'>
                <label htmlFor='email'>Email</label>
                <input
                  value={email}
                  onChange={inputHandler('email')}
                  id='email'
                  name='email'
                  type='email'
                  className='form-control'
                />
              </div>
              <div className='form-group'>
                <label htmlFor='username'>Username</label>
                <input
                  value={username}
                  onChange={inputHandler('username')}
                  id='username'
                  name='username'
                  type='text'
                  className='form-control'
                />
              </div>
              <div className='form-group'>
                <label htmlFor='password'>Password</label>
                <input
                  value={password}
                  onChange={inputHandler('password')}
                  id='password'
                  name='password'
                  type='password'
                  className='form-control'
                />
              </div>
              <button onClick={submitHandler} className='btn btn-primary btn-block mt-3'>
                Register
              </button>
              <p className='card-text text-center  mt-3'>
                Already a member ? <Link to='/login'>Login</Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Register;
