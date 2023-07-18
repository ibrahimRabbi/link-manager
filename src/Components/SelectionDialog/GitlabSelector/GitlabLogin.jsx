import React, { useContext, useState } from 'react';
import { Button, Col, FlexboxGrid, Form, Message, Panel, useToaster } from 'rsuite';
import style from './GitlabLogin.module.css';
import { useLocation, useNavigate } from 'react-router-dom';
import SelectionAuthContext from '../../../Store/SelectionAuthContext';
const GitlabLogin = () => {
  const [setFormError] = useState({});
  //   const [/*isLoading,*/ setIsLoading] = useState(false);
  const [formValue, setFormValue] = useState({
    userName: '',
    password: '',
  });
  const loginFormRef = React.useRef();
  const authCtx = useContext(SelectionAuthContext);
  const location = useLocation();
  const navigate = useNavigate();
  const toaster = useToaster();
  const onSubmit = async () => {
    // setIsLoading(true);

    const authData = window.btoa(formValue.userName + ':' + formValue.password);
    await fetch('https://gitlab-oslc-api-dev.koneksys.com/rest/v2/auth/login', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
        Authorization: 'Basic ' + authData,
      },
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        if ('access_token' in data) {
          authCtx.login(data.access_token);
          console.log(data.access_token);
          // manage redirect user
          if (location.state) navigate(location.state.from.pathname);
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
      });
    //   .finally(() => setIsLoading(false));
  };
  return (
    <div className={style.main}>
      <FlexboxGrid justify="center" align="middle">
        <FlexboxGrid.Item as={Col} colspan={16} md={14} lg={12} xl={10} xxl={8}>
          <Panel
            header={
              <h3 style={{ textAlign: 'center' }}>
                <span>Login</span>
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
              // model={model}
            >
              <Form.Group controlId="name">
                <Form.ControlLabel>Username</Form.ControlLabel>
                <Form.Control name="userName" />
              </Form.Group>

              <Form.Group controlId="password">
                <Form.ControlLabel>Password</Form.ControlLabel>
                <Form.Control name="password" type="password" autoComplete="off" />
              </Form.Group>

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

export default GitlabLogin;
