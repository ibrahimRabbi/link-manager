import React, { useContext, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import AuthContext from '../../Store/Auth-Context.jsx';
import style from './Login.module.scss';
import { useSelector } from 'react-redux';
import { useMixpanel } from 'react-mixpanel-browser';
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

const { titleSpan, main, title } = style;
const loginURL = `${process.env.REACT_APP_LM_REST_API_URL}/auth/login`;

const { StringType } = Schema.Types;

const model = Schema.Model({
  userName: StringType().isRequired('Username is required.'),
  password: StringType()
    .addRule((value) => {
      return value.length >= 5;
    }, 'Password should include at least 5 characters')
    .isRequired('Password is required.'),
});

// const mixpanelToken= process.env.REACT_APP_MIXPANEL_TOKEN;
const Login = () => {
  const { isWbe } = useSelector((state) => state.links);
  const [isLoading, setIsLoading] = useState(false);
  const [setFormError] = useState({});
  const [formValue, setFormValue] = useState({
    userName: '',
    password: '',
  });
  const loginFormRef = React.useRef();
  const authCtx = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();

  const toaster = useToaster();

  // React mixpanel browser
  const mixpanel = useMixpanel();
  mixpanel.init('197a3508675e32adcdfee4563c0e0595', { debug: true });

  // handle form submit
  const onSubmit = async () => {
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
        } else {
          //track who try to login
          mixpanel.track('Failed to login.', {
            username: formValue.userName,
          });
        }
        return res.json();
      })
      .then((data) => {
        if ('access_token' in data) {
          authCtx.login(data.access_token, data.expires_in);
          // manage redirect user
          if (location.state) navigate(location.state.from.pathname);
          else {
            isWbe ? navigate('/wbe') : navigate('/');
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
            toaster.push(message, { placement: 'bottomCenter', duration: 5000 });
          }
        }
      })
      .catch((err) => {
        const message = (
          <Message closable showIcon type="error">
            Something went wrong when connecting to the server. ({err.message})
          </Message>
        );
        toaster.push(message, { placement: 'bottomCenter', duration: 5000 });
      })
      .finally(() => setIsLoading(false));
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
