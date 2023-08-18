import React, { useContext, useRef, useState } from 'react';
import styles from './Login.module.scss';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { handleCurrPageTitle } from '../../Redux/slices/navSlice';
import {
  Button,
  Divider,
  FlexboxGrid,
  Form,
  Message,
  Nav,
  Schema,
  Tag,
  toaster,
} from 'rsuite';
import TextField from '../AdminDasComponents/TextField';
import { useMutation } from '@tanstack/react-query';
import AuthContext from '../../Store/Auth-Context';
import fetchAPIRequest from '../../apiRequests/apiRequest';
import UseLoader from '../Shared/UseLoader';
import PasswordField from '../AdminDasComponents/PasswordField';
import jwt_decode from 'jwt-decode';

const {
  profileMainContainer,
  leftContainer,
  imageContainer,
  infoStyle,

  //------------//
  rightContainer,
  navBarStyle,
  saveButton,
} = styles;

/** Model Schema */
const { StringType } = Schema.Types;
const passwordRule = (value) => {
  return value.length >= 5;
};
const confirmRule = (value, data) => {
  if (value !== data.new_password) return false;
  return true;
};
const ruleMessage = 'Password should include at least 5 characters';
const requiredMessage = 'This field is required';
const confirmMessage = 'The two passwords do not match';
const userModel = Schema.Model({
  first_name: StringType().isRequired(requiredMessage),
  last_name: StringType().isRequired(requiredMessage),
  username: StringType().isRequired(requiredMessage),
  email: StringType().isRequired(requiredMessage),
});
const passwordModel = Schema.Model({
  new_password: StringType()
    .addRule(passwordRule, ruleMessage)
    .isRequired(requiredMessage),
  confirm_password: StringType()
    .addRule(confirmRule, confirmMessage)
    .isRequired(requiredMessage),
});

const UserProfile = () => {
  const [formError, setFormError] = useState({});
  const [passwordError, setPasswordError] = useState({});
  const [navKey, setNavKey] = useState('user');
  const dispatch = useDispatch();
  const profileRef = useRef();
  const passwordRef = useRef();
  const authCtx = useContext(AuthContext);
  const userInfo = jwt_decode(authCtx?.token);
  const [userFormValue, setUserFormValue] = useState({
    first_name: userInfo?.given_name ? userInfo?.given_name : '',
    last_name: userInfo?.family_name ? userInfo?.family_name : '',
    username: userInfo?.preferred_username ? userInfo?.preferred_username : '',
    email: userInfo?.email ? userInfo?.email : '',
  });
  const [passwordValue, setPasswordValue] = useState({
    new_password: '',
    confirm_password: '',
  });

  useEffect(() => {
    dispatch(handleCurrPageTitle('Profile'));
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

  // update user info using react query
  const { isLoading: updateUserLoading, mutate: updateUserMutate } = useMutation(
    () =>
      fetchAPIRequest({
        urlPath: `user/${authCtx?.user_id}`,
        token: authCtx.token,
        method: 'PUT',
        body: userFormValue,
        showNotification: showNotification,
      }),
    {
      onSuccess: (value) => {
        showNotification(value?.status, value?.message);
      },
    },
  );

  const passwordData = {
    new_password: passwordValue.new_password,
    confirm_password: passwordValue.confirm_password,
  };
  // update password using react query
  const { isLoading: updatePasswordLoading, mutate: updatePasswordMutate } = useMutation(
    () =>
      fetchAPIRequest({
        urlPath: `user/password/${authCtx?.user_id}`,
        token: authCtx.token,
        method: 'PUT',
        body: passwordData,
        showNotification: showNotification,
      }),
    {
      onSuccess: (value) => {
        showNotification(value?.status, value?.message);
      },
    },
  );

  // handle same user info or password
  const handleUpdateProfile = () => {
    if (navKey === 'user') {
      if (!profileRef.current.check()) {
        console.log(formError);
        return;
      }
      updateUserMutate();
      console.log(userFormValue);
    } else if (navKey === 'password') {
      if (!passwordRef.current.check()) {
        console.log(passwordError);
        return;
      }
      updatePasswordMutate();
      console.log(passwordData);
    }
  };

  return (
    <div className="mainContainer">
      {(updateUserLoading || updatePasswordLoading) && <UseLoader />}

      <div className={`container ${profileMainContainer}`}>
        {/* --- Left Section ---  */}
        <div className={leftContainer}>
          <div className={imageContainer}>
            <img src="./default_avatar.jpg" alt="avatar" />
            <h5>{userInfo?.name ? userInfo?.name : 'First Name Last Name'}</h5>
            <Tag color={'orange'}>
              <p>User Role</p>
            </Tag>
          </div>

          <h4>Details</h4>
          <Divider style={{ marginTop: '0' }} />
          <p className={infoStyle}>
            <span>First Name: </span>
            {userInfo?.given_name}
          </p>
          <p className={infoStyle}>
            <span>Last Name: </span>
            {userInfo?.family_name}
          </p>
          <p className={infoStyle}>
            <span>Username: </span>
            {userInfo?.preferred_username}
          </p>
          <p className={infoStyle}>
            <span>Email: </span>
            {userInfo?.email}
          </p>
          <p className={infoStyle}>
            <span>Status: </span>active
          </p>
        </div>

        {/* --- Right Section ---  */}
        <div className={rightContainer}>
          <Nav appearance="subtle" onSelect={(e) => setNavKey(e)} className={navBarStyle}>
            <Nav.Item active={navKey === 'user'} eventKey="user">
              <h5>Update user info</h5>
            </Nav.Item>
            <Nav.Item active={navKey === 'password'} eventKey="password">
              <h5>Change password</h5>
            </Nav.Item>
          </Nav>

          {/* --- User form --- */}
          {navKey === 'user' && (
            <Form
              fluid
              ref={profileRef}
              onChange={setUserFormValue}
              onCheck={setFormError}
              formValue={userFormValue}
              model={userModel}
            >
              <FlexboxGrid justify="space-between">
                <FlexboxGrid.Item colspan={11} style={{ marginBottom: '30px' }}>
                  <TextField
                    name="first_name"
                    label="First Name"
                    reqText="First name is required"
                  />
                </FlexboxGrid.Item>

                <FlexboxGrid.Item colspan={11} style={{ marginBottom: '30px' }}>
                  <TextField
                    name="last_name"
                    label="Last Name"
                    reqText="Last name is required"
                  />
                </FlexboxGrid.Item>

                <FlexboxGrid.Item colspan={24} style={{ marginBottom: '30px' }}>
                  <TextField name="username" label="Username" />
                </FlexboxGrid.Item>

                <FlexboxGrid.Item colspan={24} style={{ marginBottom: '30px' }}>
                  <TextField name="email" label="Email" type="email" />
                </FlexboxGrid.Item>
              </FlexboxGrid>

              <Button
                className={saveButton}
                appearance="primary"
                color="blue"
                type="submit"
                onClick={handleUpdateProfile}
              >
                Save
              </Button>
            </Form>
          )}

          {/* --- Password form --- */}
          {navKey === 'password' && (
            <Form
              fluid
              ref={passwordRef}
              onChange={setPasswordValue}
              onCheck={setPasswordError}
              formValue={passwordValue}
              model={passwordModel}
            >
              <FlexboxGrid justify="space-between">
                <FlexboxGrid.Item colspan={11} style={{ marginBottom: '30px' }}>
                  <PasswordField
                    name="new_password"
                    label="New Password"
                    type="password"
                    reqText="New password is required"
                  />
                </FlexboxGrid.Item>

                <FlexboxGrid.Item colspan={11} style={{ marginBottom: '30px' }}>
                  <PasswordField
                    name="confirm_password"
                    label="Confirm Password"
                    type="password"
                    reqText="Confirm password is required"
                  />
                </FlexboxGrid.Item>
              </FlexboxGrid>

              <Button
                className={saveButton}
                appearance="primary"
                color="blue"
                type="submit"
                onClick={handleUpdateProfile}
              >
                Save
              </Button>
            </Form>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
