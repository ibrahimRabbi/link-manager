import React, { useState, useRef } from 'react';
import {
  Form,
  Button,
  FlexboxGrid,
  Panel,
  Col,
  Schema,
  Loader,
  toaster,
  Message,
} from 'rsuite';
import PasswordField from '../AdminDasComponents/PasswordField';

import styles from './Login.module.scss';
import { useNavigate, useSearchParams } from 'react-router-dom';
const { main, title, titleSpan } = styles;

const { StringType } = Schema.Types;
const model = Schema.Model({
  password: StringType()
    .addRule((value) => {
      if (value.length < 5) {
        return false;
      }
      return true;
    }, 'Password should include at least 5 characters')
    .isRequired('Password is required.'),

  password_confirm: StringType()
    .addRule((value, data) => {
      if (value !== data.password) {
        return false;
      }
      return true;
    }, 'The two passwords do not match')
    .isRequired('Confirm password is required.'),
});

const lmApiUrl = import.meta.env.VITE_LM_REST_API_URL;

const UserVerify = () => {
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState({});
  const [formValue, setFormValue] = useState({ password: '', password_confirm: '' });
  const navigate = useNavigate();
  const passRef = useRef();
  const [searchParams] = useSearchParams();

  const email = searchParams.get('email');
  const verification_token = searchParams.get('verification_token');

  const showNotification = (type, message) => {
    if (type && message) {
      const messages = (
        <Message closable type={type}>
          <h6>{message}</h6>
        </Message>
      );
      toaster.push(messages, { placement: 'bottomCenter', duration: 10000 });
    }
  };

  // handle submit password
  const handlePasswordSubmit = async () => {
    if (!passRef.current.check()) {
      console.error('Form Error', formError);
      return;
    }
    setLoading(true);
    // eslint-disable-next-line max-len
    const postURl = `${lmApiUrl}/user/set_password?verification_token=${verification_token}&email=${email}`;
    await fetch(postURl, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify(formValue),
    })
      .then((res) => {
        if (res.ok) {
          res.json().then((data) => {
            showNotification('success', data?.message);
          });
          navigate('/login');
        } else {
          res.json().then((data) => {
            showNotification('error', data?.message);
          });
        }
      })
      .catch((error) => showNotification('error', error?.message))
      .finally(() => setLoading(false));
  };

  return (
    <div className={main}>
      <FlexboxGrid justify="center" align="middle">
        <FlexboxGrid.Item as={Col} colspan={18} md={14} lg={12} xl={10} xxl={8}>
          <Panel
            header={
              <h3 className={title}>
                Please Setup Your <br />
                <span className={titleSpan}>Password</span>
              </h3>
            }
            bordered
          >
            {loading && (
              <FlexboxGrid
                justify="center"
                style={{ position: 'absolute', left: '48%', top: '28%' }}
              >
                <Loader size="md" label="" />
              </FlexboxGrid>
            )}

            <Form
              fluid
              ref={passRef}
              onChange={setFormValue}
              onCheck={setFormError}
              formValue={formValue}
              model={model}
            >
              <PasswordField
                name="password"
                label="Password"
                reqText="Password is required"
              />

              <PasswordField
                name="password_confirm"
                label="Confirm Password"
                reqText="Confirm password is required"
              />

              <Button
                style={{ marginTop: '40px' }}
                color="blue"
                block
                type="submit"
                appearance="primary"
                onClick={handlePasswordSubmit}
              >
                Submit
              </Button>
            </Form>
          </Panel>
        </FlexboxGrid.Item>
      </FlexboxGrid>
    </div>
  );
};

export default UserVerify;
