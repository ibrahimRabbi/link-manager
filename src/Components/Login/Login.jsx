import React, { useContext, useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import AuthContext from '../../Store/Auth-Context.jsx';
import style from './Login.module.scss';
import { useDispatch, useSelector } from 'react-redux';
import { Mixpanel } from '../../../Mixpanel.js';
import {
  FlexboxGrid,
  Button,
  Panel,
  Col,
  Schema,
  Form,
  Loader,
  useToaster,
  Message,
  Tooltip,
  Whisper,
} from 'rsuite';
import TextField from '../AdminDasComponents/TextField.jsx';
import PasswordField from '../AdminDasComponents/PasswordField.jsx';
import { handleGetSources } from '../../Redux/slices/linksSlice.jsx';
import fetchAPIRequest from '../../apiRequests/apiRequest.js';
import AddNewModal from '../AdminDasComponents/AddNewModal.jsx';
import { handleIsAddNewModal } from '../../Redux/slices/navSlice.jsx';
import { useMutation } from '@tanstack/react-query';

const { titleSpan, main, title, forgotLabel, logoContainer } = style;
const loginURL = `${import.meta.env.VITE_LM_REST_API_URL}/auth/login`;
const { StringType } = Schema.Types;

const model = Schema.Model({
  userName: StringType().isRequired('Username is required.'),
  password: StringType()
    .addRule((value) => {
      return value.length >= 5;
    }, 'Password should include at least 5 characters')
    .isRequired('Password is required.'),
});
const resetModel = Schema.Model({
  email: StringType()
    .isEmail('Please enter a valid email address.')
    .isRequired('This field is required.'),
});

const Login = () => {
  const { isWbe, sourceDataList } = useSelector((state) => state.links);
  const { isDark } = useSelector((state) => state.nav);
  const [isLoading, setIsLoading] = useState(false);
  const [resetFormError, setResetFormError] = useState({});
  const [formValue, setFormValue] = useState({
    userName: '',
    password: '',
  });
  const [resetForm, setResetForm] = useState({
    email: '',
  });

  const resetFormRef = useRef();
  const loginFormRef = useRef();
  const authCtx = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();
  const toaster = useToaster();
  const dispatch = useDispatch();
  const isMounted = useRef(null); // Variable to track component mount state
  const sourceData = sessionStorage.getItem('sourceData');
  const isSource = sourceDataList?.uri ? sourceDataList?.uri : sourceData;

  useEffect(() => {
    if (sourceData) {
      dispatch(handleGetSources(JSON.parse(sourceData)));
    }
  }, [sourceData]);

  useEffect(() => {
    return () => {
      // Cleanup function
      isMounted.current = true; // Update the mount state on unmount
    };
  }, []);

  const showNotification = (type, message) => {
    if (type && message) {
      const messages = (
        <Message closable showIcon type={type}>
          {message}
        </Message>
      );
      toaster.push(messages, { placement: 'bottomCenter', duration: 5000 });
    }
  };

  const onSubmit = async () => {
    if (!loginFormRef.current.check()) {
      return;
    }

    setIsLoading(true);
    // Track who tried to login
    Mixpanel.track('Trying to login.', {
      username: formValue.userName,
    });

    try {
      const authData = window.btoa(formValue.userName + ':' + formValue.password);
      const response = await fetch(loginURL, {
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
          Authorization: 'Basic ' + authData,
        },
      });

      if (isMounted.current) {
        if (response.ok) {
          // Track successful login
          Mixpanel.track('Successfully logged in.', {
            username: formValue.userName,
          });
        } else {
          // Track failed login
          Mixpanel.track('Failed to login.', {
            username: formValue.userName,
          });
        }
      }

      const data = await response.json();

      if (isMounted.current) {
        if ('access_token' in data) {
          // set user role
          let role = '';
          if (data?.user_role?.includes('super_admin')) {
            role = 'super_admin';
          } else if (data?.user_role?.includes('admin')) {
            role = 'admin';
          } else if (data?.user_role?.includes('user')) {
            role = 'user';
          }

          // get organization details from the api
          const organization = await fetchAPIRequest({
            urlPath: `organization/${data?.organization_id}`,
            token: data?.access_token,
            showNotification: showNotification,
            method: 'GET',
          });

          authCtx.login({
            token: data.access_token,
            expiresIn: data.expires_in,
            user_id: data?.user_id,
            organization_id: data?.organization_id,
            user_role: role,
            organization,
          });

          const orgName = organization?.name
            ? `/${organization?.name?.toLowerCase()}`
            : '';
          // Manage redirect
          if (location.state) {
            const redirectPath = location.state.from.pathname;

            if (role.includes('admin')) {
              if (isSource || location.state.from.pathname.includes('wbe')) {
                navigate('/wbe');
              } else {
                navigate(orgName + '/admin');
              }
            } else {
              if (redirectPath.includes('admin')) navigate(orgName ? orgName : '/');
              else {
                navigate(redirectPath);
              }
            }
          } else {
            if (isSource || isWbe) navigate('/wbe' + orgName);
            else {
              navigate(orgName ? orgName : '/');
            }
          }
        } else {
          let errorMessage = 'Authentication failed: ';
          if (data && data.message) {
            errorMessage += data.message;
            const message = (
              <Message closable showIcon type="error">
                {errorMessage}
              </Message>
            );
            toaster.push(message, {
              placement: 'bottomCenter',
              duration: 5000,
            });
          }
        }
      }
    } catch (err) {
      if (isMounted.current) {
        const message = (
          <Message closable showIcon type="error">
            Something went wrong when connecting to the server. ({err.message})
          </Message>
        );
        toaster.push(message, { placement: 'bottomCenter', duration: 5000 });
      }
    } finally {
      if (isMounted.current) {
        setIsLoading(false);
      }
    }
  };

  // send request to forgot password using react query
  const { isLoading: forgotPassLoading, mutate: forgotPassMutate } = useMutation(() =>
    fetchAPIRequest({
      urlPath: '/user/forgot_password',
      token: '',
      method: 'POST',
      body: { email: resetForm?.email },
      showNotification: showNotification,
    }),
  );

  // password reset submit
  const handleResetPass = () => {
    if (!resetFormRef.current.check()) {
      return;
    }

    forgotPassMutate();
    dispatch(handleIsAddNewModal(false));
    handleResetResetPassForm();
  };

  const handleResetResetPassForm = () => {
    setTimeout(() => {
      setResetForm({ email: '' });
    }, 1000);
  };

  return (
    <div className={main}>
      {(isLoading || forgotPassLoading) && (
        <Loader
          backdrop
          center
          size="md"
          vertical
          content={isLoading ? 'Authenticating' : ''}
          style={{ zIndex: '10' }}
        />
      )}

      <FlexboxGrid justify="center" align="middle">
        <FlexboxGrid.Item as={Col} colspan={16} md={14} lg={12} xl={10} xxl={8}>
          <Panel bordered>
            <div style={{ marginBottom: '20px' }}>
              <h2 className={title}>
                <span className={titleSpan}>Sign in</span>
              </h2>
              <div className={logoContainer}>
                <img
                  src={window.location.origin + '/traceLynx_logo.svg'}
                  height={30}
                  alt="TL_logo"
                />
                <h2 className={title}>
                  <span
                    style={{
                      color: isDark === 'dark' ? '#3491e2' : '#2c74b3',
                    }}
                  >
                    Trace
                  </span>
                  <span
                    style={{
                      color: isDark === 'dark' ? '#1d69ba' : '#144272',
                    }}
                  >
                    Lynx
                  </span>
                </h2>
              </div>
            </div>

            <Form
              fluid
              ref={loginFormRef}
              onChange={setFormValue}
              formValue={formValue}
              model={model}
            >
              <TextField
                name="userName"
                type="text"
                label="Username"
                reqText="User name is required"
              />

              <PasswordField
                name="password"
                type="password"
                label="Password"
                reqText="Password is required"
              />

              <div style={{ display: 'flex', justifyContent: 'start' }}>
                <Whisper
                  placement="bottom"
                  controlId="control-id-hover"
                  trigger="hover"
                  speaker={<Tooltip>Reset your password</Tooltip>}
                >
                  <p
                    className={forgotLabel}
                    onClick={() => dispatch(handleIsAddNewModal(true))}
                  >
                    Forgot password?
                  </p>
                </Whisper>
              </div>

              <Button
                color="blue"
                data-cy="login-submit"
                block
                type="submit"
                appearance="primary"
                onClick={onSubmit}
              >
                Sign in
              </Button>
            </Form>
          </Panel>
        </FlexboxGrid.Item>
      </FlexboxGrid>

      {/* handle reset password modal */}
      <AddNewModal
        title={'Reset Password'}
        handleSubmit={handleResetPass}
        handleReset={handleResetResetPassForm}
        size={'sm'}
      >
        <Form
          fluid
          ref={resetFormRef}
          onChange={setResetForm}
          formValue={resetForm}
          onCheck={setResetFormError}
          model={resetModel}
        >
          <p style={{ marginBottom: '25px' }}>
            Enter your email address and we will email you the instructions to reset your
            password.
          </p>

          <TextField
            name="email"
            type="email"
            label="Email address: "
            reqText="Email is required!"
            error={resetFormError.email}
          />
        </Form>
      </AddNewModal>
    </div>
  );
};

export default Login;
