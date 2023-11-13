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
} from 'rsuite';
import TextField from '../AdminDasComponents/TextField.jsx';
import PasswordField from '../AdminDasComponents/PasswordField.jsx';
import { handleGetSources } from '../../Redux/slices/linksSlice.jsx';
import fetchAPIRequest from '../../apiRequests/apiRequest.js';

const { titleSpan, main, title } = style;
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

const Login = () => {
  const { isWbe, sourceDataList } = useSelector((state) => state.links);
  const [isLoading, setIsLoading] = useState(false);
  const [setFormError] = useState({});
  const [formValue, setFormValue] = useState({
    userName: '',
    password: '',
  });
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

          console.log(data);
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
            const isAdminDashboard = redirectPath?.includes('/admin');

            // if redirect path is admin dashboard & user is not a admin.
            if (isAdminDashboard && role === 'user') {
              navigate(orgName ? orgName : '/');
            } else {
              navigate(redirectPath);
            }
          } else {
            if (isSource) navigate('/wbe' + orgName);
            else if (isWbe) navigate('/wbe' + orgName);
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

  return (
    <div className={main}>
      {isLoading && (
        <Loader
          backdrop
          center
          size="md"
          vertical
          content="Authenticating"
          style={{ zIndex: '10' }}
        />
      )}

      <FlexboxGrid justify="center" align="middle">
        <FlexboxGrid.Item as={Col} colspan={16} md={14} lg={12} xl={10} xxl={8}>
          <Panel
            header={
              <h3 className={title}>
                TraceLynx
                <br />
                <span className={titleSpan}>Please Login</span>
              </h3>
            }
            bordered
          >
            <Form
              fluid
              ref={loginFormRef}
              onChange={setFormValue}
              check={setFormError}
              formValue={formValue}
              model={model}
            >
              <TextField
                name="userName"
                type="text"
                label="User Name"
                reqText="User name is required"
              />

              <PasswordField
                name="password"
                type="password"
                label="Password"
                reqText="Password is required"
              />

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
    </div>
  );
};

export default Login;
