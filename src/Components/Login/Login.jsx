import React, { useContext, useState } from 'react';
// import {PasswordInput, ProgressBar, TextInput } from '@carbon/react';
import { useForm } from 'react-hook-form';
import { useLocation, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import AuthContext from '../../Store/Auth-Context.jsx';
import style from './Login.module.scss';
import { useSelector } from 'react-redux';
import { useMixpanel } from 'react-mixpanel-browser';
import { ButtonToolbar, FlexboxGrid, Button, Form, Panel } from 'rsuite';

const {
  // formContainer, btnContainer,
  titleSpan,
  main,
  title,
  errText,
} = style;
const loginURL = `${process.env.REACT_APP_LM_REST_API_URL}/auth/login`;

// const mixpanelToken= process.env.REACT_APP_MIXPANEL_TOKEN;
const Login = () => {
  const { isWbe } = useSelector((state) => state.links);
  const [isLoading, setIsLoading] = useState(false);

  const authCtx = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm();

  // React mixpanel browser
  const mixpanel = useMixpanel();
  mixpanel.init('197a3508675e32adcdfee4563c0e0595', { debug: true });

  // handle form submit
  const onSubmit = (data) => {
    setIsLoading(true);

    //track who try to login
    mixpanel.track('Trying to login.', {
      username: data.userName,
    });

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
          //track who try to login
          mixpanel.track('Successfully logged in.', {
            username: data.userName,
          });
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
    <>
      <div className={main}>
        {/* <form onSubmit={handleSubmit(onSubmit)} className={formContainer}>
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
              <Button color='blue'
                appearance="primary" type="submit">
              Sign in
              </Button>
            </div>
          </form> */}

        {isLoading && <h5 style={{ textAlign: 'center' }}>Loading...</h5>}
        <FlexboxGrid justify="center" align="middle">
          <FlexboxGrid.Item colspan={12}>
            <Panel
              header={
                <h3 className={title}>
                  Link Manager Application <br />
                  <span className={titleSpan}>Please Login</span>
                </h3>
              }
              bordered
            >
              <Form fluid onSubmit={handleSubmit(onSubmit)}>
                <Form.Group>
                  <Form.Control
                    name="username"
                    placeholder="User Name"
                    {...register('userName', { required: true })}
                  />
                  <p className={errText}>{errors.userName && 'Invalid User Name'}</p>
                </Form.Group>

                <Form.Group>
                  <Form.Control
                    name="password"
                    type="password"
                    placeholder="Password"
                    {...register('password', { required: true, minLength: 5 })}
                  />
                  <p className={errText}>
                    {errors.password && 'Password should include at least 5 characters'}
                  </p>
                </Form.Group>

                <Form.Group>
                  <ButtonToolbar>
                    <Button color="blue" block appearance="primary" type="submit">
                      Sign in
                    </Button>
                  </ButtonToolbar>
                </Form.Group>
              </Form>
            </Panel>
          </FlexboxGrid.Item>
        </FlexboxGrid>
      </div>
    </>
  );
};

export default Login;
