import React, { useContext, useState } from 'react';

import { ArrowRight } from '@carbon/icons-react';
import { Button, PasswordInput, ProgressBar, TextInput } from '@carbon/react';
import { useForm } from 'react-hook-form';
import { useLocation, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import AuthContext from '../../Store/Auth-Context.jsx';
import style from './Login.module.scss';
import { useSelector } from 'react-redux';

const { main, container, title, formContainer, btnContainer, titleSpan, errText } = style;
const loginURL = `${process.env.REACT_APP_LM_REST_API_URL}/auth/login`;

const Login = () => {
  const { isWbe } = useSelector((state) => state.links);
  const [isLoading, setIsLoading] = useState(false);
  const authCtx = useContext(AuthContext);
  const location = useLocation();

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();

  // handle form submit
  const onSubmit = (data) => {
    setIsLoading(true);
    const authData = window.btoa(data.userName + ':' + data.password);
    fetch(loginURL, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
        Authorization: 'Basic ' + authData,
      },
    })
      .then((res) => {
        if (res.ok) {
          return res.json();
        } else {
          res.json().then((data) => {
            let errorMessage = 'Authentication failed: ';
            if (data && data.message) {
              errorMessage += data.message;
              Swal.fire({ title: 'Error', text: errorMessage, icon: 'error' });
            }
          });
        }
      })
      .then((data) => {
        const expirationTime = new Date(new Date().getTime() + +data.expires_in * 1000);
        authCtx.login(data.access_token, expirationTime.toISOString());

        // manage redirect user
        if (location.state) navigate(location.state.from.pathname);
        else {
          isWbe ? navigate('/wbe') : navigate('/');
        }
      })
      .catch((err) => {
        Swal.fire({ title: 'Error', text: err.message, icon: 'error' });
      })
      .finally(() => setIsLoading(false));
  };

  return (
    <div className={main}>
      <div className={container}>
        <h3 className={title}>
          Link Manager Application <br />
          <span className={titleSpan}>Please Login</span>
        </h3>

        <form onSubmit={handleSubmit(onSubmit)} className={formContainer}>
          <TextInput
            type="text"
            id="userName"
            labelText="User name"
            placeholder="Enter user name"
            {...register('userName', { required: true })}
          />
          <p className={errText}>{errors.userName && 'Invalid User'}</p>

          <PasswordInput
            type="password"
            id="login_password_id"
            labelText="Password"
            placeholder="Enter your password"
            autoComplete="on"
            {...register('password', { required: true, minLength: 5 })}
          />
          <p className={errText}>
            {errors.password && 'Password should include at least 5 characters'}
          </p>
          {isLoading && <ProgressBar label="" />}
          <div className={btnContainer}>
            <Button renderIcon={ArrowRight} size="lg" kind="primary" type="submit">
              Sign in
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
