import {
  Button,
  Col,
  FlexboxGrid,
  Form,
  Loader,
  Message,
  Panel,
  Schema,
  toaster,
} from 'rsuite';
import TextField from '../../TextField.jsx';
import PasswordField from '../../PasswordField.jsx';
import React, { useContext, useRef, useState } from 'react';
import style from './ExternalLogin.scss?inline';
import { useQuery } from '@tanstack/react-query';
import fetchAPIRequest from '../../../../apiRequests/apiRequest.js';
import AuthContext from '../../../../Store/Auth-Context.jsx';
const { StringType } = Schema.Types;
const lmApiUrl = import.meta.env.VITE_LM_REST_API_URL;

const model = Schema.Model({
  username: StringType().isRequired('Username is required.'),
  password: StringType().isRequired('Password is required.'),
});

const ExternalLogin = (props) => {
  let loginUrl = '';
  const loginFormRef = useRef();
  const authCtx = useContext(AuthContext);

  const { titleSpan, main, title, appImage } = style;
  const { appData, onDataStatus } = props;

  const [isLoading, setIsLoading] = useState(false);
  const [setFormError] = useState({});

  const [formValue, setFormValue] = useState({
    username: '',
    password: '',
  });

  const showNotification = (type, res) => {
    console.log('showNotification', type, res);
  };

  const { data: selectedExtLoginApplication } = useQuery(
    ['selectedExtLoginApplication'],
    () =>
      fetchAPIRequest({
        // eslint-disable-next-line max-len
        urlPath: `application?name=${appData?.name}&organization_id=${appData?.organization_id}`,
        token: authCtx.token,
        method: 'GET',
        showNotification: showNotification,
      }),
  );
  if (selectedExtLoginApplication) {
    if (appData?.type === 'glideyoke') {
      // eslint-disable-next-line max-len
      loginUrl = `${lmApiUrl}/third_party/glideyoke/auth/login?application_id=${appData?.application_id}`;
    }
  }

  const convertToUppercase = (str) => {
    return str.replace(/^./, (match) => match.toUpperCase());
  };

  const onSubmit = async () => {
    setIsLoading(true);

    try {
      const authData = window.btoa(formValue.username + ':' + formValue.password);
      const response = await fetch(loginUrl, {
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
          Authorization: `Bearer ${authCtx.token}`,
          'X-Auth-GlideYoke': 'Basic ' + authData,
        },
      });
      const data = await response.json();
      if (data?.status === 'success') {
        onDataStatus(data);
      }
    } catch (err) {
      const message = (
        <Message closable showIcon type="error">
          Something went wrong when connecting to the server. ({err.message})
        </Message>
      );
      toaster.push(message, { placement: 'bottomCenter', duration: 5000 });
    } finally {
      setIsLoading(false);
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
        <FlexboxGrid.Item as={Col} colspan={24} md={14} lg={16} xl={18} xxl={20}>
          <Panel
            header={
              <h3 className={title}>
                {appData?.type === 'glideyoke' && (
                  <img
                    src={'/glide_logo.png'}
                    alt="Application logo"
                    className={appImage}
                  />
                )}
                <br />
                <span className={titleSpan}>
                  Log in to {convertToUppercase(appData?.type)} application
                </span>
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
                name="username"
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

export default ExternalLogin;
