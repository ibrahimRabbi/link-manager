import { Button, TextInput } from '@carbon/react';
import React from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import style from './Login.module.css';

const {container, title, formContainer, btnContainer, titleSpan, errText}=style;

const Login = () => {
  const {handleSubmit, register, formState:{errors}}=useForm();
  const navigate=useNavigate();

  const onSubmit=()=>{
    navigate('/link-manager');
  };

  return (
    <div className='mainContainer'>
      <div className={container}>
        <h3 className={title}>Link Manager Application<br />
          <span className={titleSpan}>Please Login</span>
        </h3>

        <form onSubmit={handleSubmit(onSubmit)} className={formContainer}>
          <TextInput
            type='email'
            id='email'
            labelText='Email'
            placeholder='example@gmail.com'
            {...register('email', { required: true })}
          />
          <p className={errText}>{errors.email && 'Invalid email'}</p>

          <TextInput
            type='password'
            id='pass'
            labelText='Password'
            placeholder='Your password'
            {...register('password', { required: true, minLength: 6 })}
          />
          <p className={errText}>{errors.password && 'Password should include at least 6 characters'}</p>

          <div className={btnContainer}>
            <Button size='md' kind='primary' type='submit'>Sign in</Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;