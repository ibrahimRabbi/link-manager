import { ArrowRight } from '@carbon/icons-react';
import { Button, PasswordInput, ProgressBar, TextInput } from '@carbon/react';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { handleIsLoading, handleLoggedInUser } from '../../Redux/slices/linksSlice';
import useSessionStorage from '../Shared/UseSessionStorage/UseSessionStorage';
import style from './Login.module.scss';

const {main,container, title, formContainer, btnContainer, titleSpan, errText}=style;

const Login = () => {
  const {loggedInUser, isLoading}=useSelector(state=>state.links);
  const {handleSubmit, register, formState:{errors}}=useForm();
  const {state}=useLocation();
  const navigate=useNavigate();
  const dispatch=useDispatch();

  // redirect management
  useEffect(()=>{
    const token =useSessionStorage('get', 'token');
    if(token && state?.from?.pathname) navigate(state?.from?.pathname);
    else if(token) navigate('/');
  }, [loggedInUser]);

  // handle form submit
  const onSubmit = async (data)=>{
    dispatch(handleIsLoading(true));
    const loginURL ='https://lm-api-dev.koneksys.com/api/v1/auth/login';
    const authdata = window.btoa(data.userName + ':' + data.password);
    await fetch(loginURL, {
      method:'POST', 
      headers:{
        'Content-type':'application/json',
        'Authorization': 'Basic ' + authdata
      }
    })
      .then(res => res.json())
      .then(data=>{
        dispatch(handleIsLoading(false));
        const token =data.access_token;
        useSessionStorage('set','token', window.btoa(token));
        dispatch(handleLoggedInUser({token}));
        if(token && state?.from?.pathname) navigate(state?.from?.pathname);
        else if(token) navigate('/');
      })
      .catch(err=>console.log(err))
      .finally(()=> dispatch(handleIsLoading(false)));
  };

  return (
    <div className={main}>
      <div className={container}>
        { 
          isLoading && <ProgressBar label=''/>
        }
        <h3 className={title}>Link Manager Application<br />
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