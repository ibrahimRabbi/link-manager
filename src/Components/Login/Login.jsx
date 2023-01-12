import React, { useContext, useState } from 'react';

import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../../Store/Auth-Context.jsx';

import { ArrowRight } from '@carbon/icons-react';
import { Button, PasswordInput, ProgressBar, TextInput } from '@carbon/react';

import style from './Login.module.scss';

const loginURL = `${process.env.REACT_APP_REST_API_URL}/auth/login`;

const {main,container, title, formContainer, btnContainer, titleSpan, errText}=style;

const Login = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const authCtx = useContext(AuthContext);

  const {handleSubmit, register, formState:{errors}}=useForm();
  const navigate = useNavigate();

  console.log('Login.jsx -> loginURL', loginURL);

  // handle form submit
  const onSubmit = (data) => {
    setIsLoading(true);
    const authData = window.btoa(data.userName + ':' + data.password);
    fetch(
      loginURL,
      {
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
          'Authorization': 'Basic ' + authData,
        }
      })
      .then(res => {
        if (res.ok) {
          return res.json();
        } else {
          return res.json().then(data => {
            let errorMessage = 'Authentication failed: ';
            if (data && data.message) {
              errorMessage += data.message;
            }
            throw new Error(errorMessage);
          });
        }
      })
      .then(data => {
        const expirationTime = new Date(new Date().getTime() + (+data.expires_in * 1000));
        authCtx.login(data.access_token, expirationTime.toISOString());
        navigate('/', {replace: true});
      })
      .catch(err => {
        setError(err.message);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <div className={main}>
      <div className={container}>
        <h3 className={title}>Link Manager Application <br />
          <span className={titleSpan}>Please Login</span>
        </h3>

        <form onSubmit={handleSubmit(onSubmit)} className={formContainer}>
          <TextInput
            type='text'
            id='userName'
            labelText='User name'
            placeholder='Enter user name'
            {...register('userName', { required: true })}
          />
          <p className={errText}>{errors.userName && 'Invalid User'}</p>

          <PasswordInput
            type='password'
            id='pass'
            labelText='Password'
            placeholder='Enter your password'
            {...register('password', { required: true, minLength: 5 })}
          />
          <p className={errText}>{errors.password && 'Password should include at least 5 characters'}</p>
          { 
            isLoading && <ProgressBar label=''/>
          }
          {
            error && <p className={errText}>{error}</p>
          }
          <div className={btnContainer}>
            <Button
              renderIcon={ArrowRight}
              size='lg' kind='primary' type='submit'>Sign in</Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
