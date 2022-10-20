import { ArrowRight } from '@carbon/icons-react';
import { Button, TextInput } from '@carbon/react';
import React from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { handleLoggedInUser } from '../../Redux/slices/linksSlice';
import style from './Login.module.scss';

const {main,container, title, formContainer, btnContainer, titleSpan, errText}=style;

const Login = () => {
  const {handleSubmit, register, formState:{errors}}=useForm();
  const navigate=useNavigate();
  const dispatch=useDispatch();

  const onSubmit=(data)=>{
    dispatch(handleLoggedInUser({email:data.email}));
    navigate('/link-manager');
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

          <TextInput.PasswordInput
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