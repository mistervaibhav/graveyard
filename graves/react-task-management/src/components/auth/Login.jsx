import React from 'react';
import loginImg from '../../assets/loginImg.jpg';
import Layout from '../../containers/Layout/Layout';
import { Link } from 'react-router-dom';

const Login = () => {
  return (
    <Layout>
      <div className='row mt-4 mb-4'>
        <div className='card col-md-3 mx-auto px-0'>
          <img className='card-img-top' src={loginImg} alt='Loading...' />
          <div className='card-body'>
            <h4 className='card-title text-center'>Login</h4>
            <form>
              <div className='form-group'>
                <label htmlFor='username'>Username</label>
                <input id='username' name='username' type='text' className='form-control' />
              </div>
              <div className='form-group'>
                <label htmlFor='password'>Password</label>
                <input id='password' name='password' type='password' className='form-control' />
              </div>
              <button className='btn btn-primary btn-block mt-4'>Login</button>
              <p className='card-text text-center  mt-4'>
                Not a member yet ? <Link to='/register'>Register</Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Login;
