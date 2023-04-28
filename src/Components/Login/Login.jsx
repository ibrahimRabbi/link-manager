import React, { useContext, useState } from 'react';
// import {PasswordInput, ProgressBar, TextInput } from '@carbon/react';
import { useLocation, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import AuthContext from '../../Store/Auth-Context.jsx';
import style from './Login.module.scss';
import { useSelector } from 'react-redux';
import { useMixpanel } from 'react-mixpanel-browser';
import { FlexboxGrid, Button, Panel, Col, Loader, Schema, Form } from 'rsuite';
import TextField from '../AdminDasComponents/TextField.jsx';
import PasswordField from '../AdminDasComponents/PasswordField.jsx';

const { titleSpan, main, title } = style;
const loginURL = `${process.env.REACT_APP_LM_REST_API_URL}/auth/login`;

const { StringType } = Schema.Types;

const model = Schema.Model({
  userName: StringType().isRequired('Username is required.'),
  password: StringType()
    .addRule((value) => {
      if (value.length < 5) {
        return false;
      }
      return true;
    }, 'Password should include at least 5 characters')
    .isRequired('Password is required.'),
});

// const mixpanelToken= process.env.REACT_APP_MIXPANEL_TOKEN;
const Login = () => {
  const { isWbe } = useSelector((state) => state.links);
  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = React.useState({});
  const [formValue, setFormValue] = React.useState({
    userName: '',
    password: '',
  });
  const loginFormRef = React.useRef();
  const authCtx = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();

  // React mixpanel browser
  const mixpanel = useMixpanel();
  mixpanel.init('197a3508675e32adcdfee4563c0e0595', { debug: true });

  // handle form submit
  const onSubmit = async () => {
    if (!loginFormRef.current.check()) {
      console.error('Form Error', formError);
      return;
    }
    setIsLoading(true);
    //track who try to login
    mixpanel.track('Trying to login.', {
      username: formValue.userName,
    });

    const authData = window.btoa(formValue.userName + ':' + formValue.password);
    await fetch(loginURL, {
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
            username: formValue.userName,
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
    <div className={main}>
      {isLoading && (
        <h5 style={{ textAlign: 'center' }}>
          <Loader size="md" />
        </h5>
      )}

      <FlexboxGrid justify="center" align="middle">
        <FlexboxGrid.Item as={Col} colspan={16} md={14} lg={12} xl={10} xxl={8}>
          <Panel
            header={
              <h3 className={title}>
                Link Manager Application <br />
                <span className={titleSpan}>Please Login</span>
              </h3>
            }
            bordered
          >
            <Form
              fluid
              ref={loginFormRef}
              onChange={setFormValue}
              onCheck={setFormError}
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
