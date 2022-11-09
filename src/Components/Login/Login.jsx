import { ArrowRight } from '@carbon/icons-react';
import { Button, PasswordInput, TextInput } from '@carbon/react';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { handleLoggedInUser } from '../../Redux/slices/linksSlice';
import useSessionStorage from '../Shared/UseSessionStorage/UseSessionStorage';
import style from './Login.module.scss';

const {main,container, title, formContainer, btnContainer, titleSpan, errText}=style;

const Login = () => {
  const {loggedInUser}=useSelector(state=>state.links);
  const {handleSubmit, register, formState:{errors}}=useForm();
  const {state}=useLocation();
  const navigate=useNavigate();
  const dispatch=useDispatch();

  // redirect management
  useEffect(()=>{
    const userName =useSessionStorage('get', 'userName');
    if(userName && state?.from?.pathname) navigate(state?.from?.pathname);
    else if(userName) navigate('/');
  }, [loggedInUser]);

  // handle form submit
  const onSubmit=(data)=>{
    useSessionStorage('set', 'userName', data.email);
    useSessionStorage('set', 'password', data.password);

    const userName =useSessionStorage('get', 'userName');
    const password =useSessionStorage('get', 'password');

    dispatch(handleLoggedInUser({userName, password}));
    if(userName && state?.from?.pathname) navigate(state?.from?.pathname);
    else if(userName) navigate('/');
  };


  return (
    <div className={main}>
      <div className={container}>
        <h3 className={title}>Link Manager Application<br />
          <span className={titleSpan}>Please Login</span>
        </h3>

        <form onSubmit={handleSubmit(onSubmit)} className={formContainer}>
          <TextInput
            type='email'
            id='email'
            labelText='Email'
            placeholder='Enter your email'
            {...register('email', { required: true })}
          />
          <p className={errText}>{errors.email && 'Invalid email'}</p>

          <PasswordInput
            type='password'
            id='pass'
            labelText='Password'
            placeholder='Enter your password'
            {...register('password', { required: true, minLength: 6 })}
          />
          <p className={errText}>{errors.password && 'Password should include at least 6 characters'}</p>

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