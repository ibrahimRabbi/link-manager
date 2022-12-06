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
  const onSubmit=async(data)=>{
    console.log(data);
    const loginURL =`http://lm-api-dev.koneksys.com/api/v1/auth/login?username=${data.userName}&passowrd=${data.password}`;
    await fetch(loginURL, {
      method:'POST', 
      headers:{
        'Content-type':'application/json'
      },
      body:JSON.stringify({username:data.userName, password:data.password})
    })
      .then(res => res.json())
      .then(async(res)=>{
        await console.log(res);
        useSessionStorage('set', 'userName', data.userName);
        useSessionStorage('set', 'password', data.password);
        await useSessionStorage('set','token', 'eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJpSTBHM0gtOExJUGhxaExDRjZKT2hKaFZRXzlhS0VXQmpyUEYwcnZwRDFNIn0.eyJleHAiOjE2NzAzODA0NzksImlhdCI6MTY3MDM0NDQ3OSwianRpIjoiOGZkMTcxM2UtNDZiZC00M2FmLWE3YzAtOGZiZDZiMDUxZWZlIiwiaXNzIjoiaHR0cDovL2tleWNsb2FrLmtvbmVrc3lzLmNvbS9yZWFsbXMvdHJpcHVkaW8iLCJhdWQiOiJhY2NvdW50Iiwic3ViIjoiNGU5ZmE3MjgtZDczMi00M2NlLTkxMWUtOTZhYTAwMTZhN2Q5IiwidHlwIjoiQmVhcmVyIiwiYXpwIjoibGluay1tYW5hZ2VyLWFwaSIsInNlc3Npb25fc3RhdGUiOiI3MWNlNzNjNy1jMjg4LTQ4OTEtYTE0MS0xMzU5ZDZhMDk3NmEiLCJhY3IiOiIxIiwiYWxsb3dlZC1vcmlnaW5zIjpbIioiXSwicmVhbG1fYWNjZXNzIjp7InJvbGVzIjpbImRlZmF1bHQtcm9sZXMtdHJpcHVkaW8iLCJvZmZsaW5lX2FjY2VzcyIsInVtYV9hdXRob3JpemF0aW9uIl19LCJyZXNvdXJjZV9hY2Nlc3MiOnsiYWNjb3VudCI6eyJyb2xlcyI6WyJtYW5hZ2UtYWNjb3VudCIsIm1hbmFnZS1hY2NvdW50LWxpbmtzIiwidmlldy1wcm9maWxlIl19fSwic2NvcGUiOiJlbWFpbCBwcm9maWxlIiwic2lkIjoiNzFjZTczYzctYzI4OC00ODkxLWExNDEtMTM1OWQ2YTA5NzZhIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsIm5hbWUiOiJNYXJpbyBKaW3DqW5leiIsInByZWZlcnJlZF91c2VybmFtZSI6Im1hcmlvIiwiZ2l2ZW5fbmFtZSI6Ik1hcmlvIiwiZmFtaWx5X25hbWUiOiJKaW3DqW5leiIsImVtYWlsIjoiaXNjY2FycmFzY29AaWNsb3VkLmNvbSJ9.ARvJ9UahSi6GDTeO3KRO7huVNB7nZYGpSJsuGXqmi2zTsxNa3pL-SQ3PAsG0ByXOmL1yLpVwWVhZaHVXfyHJ7Vi1tsdxHs53rZ1EaLXMHJP2CQKzVJQtN3y8I60A3b1qWX2fLiHRTc46y5S3ma90kAU6o4XtrsjIElJY9htQnkK_bES55lro2DN4UC-g2XnTFefYK-nfEUtbhrdbxZFU2TEQU_es4lCGJuTOsAUeYr7BveZlznPmvaKeJCnpYw70ZcJTMj5YoRLm7b7pw7lMp3iJMcOZf1ak_W91sminbtbPlAlA6j6T_c3I7NdWfg_w7m7A-w3rgfStX1B2NivXRQ');
      })
      .catch(err=>console.log(err));

      

    const token =useSessionStorage('get', 'token');
    const userName =useSessionStorage('get', 'userName');
    const password =useSessionStorage('get', 'password');
    console.log(token);
    dispatch(handleLoggedInUser({userName, password, token}));
    if(token && state?.from?.pathname) navigate(state?.from?.pathname);
    else if(token) navigate('/');
  };


  return (
    <div className={main}>
      <div className={container}>
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