import React, { useContext, useRef, useState } from 'react';
import styles from './Login.module.scss';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { handleCurrPageTitle } from '../../Redux/slices/navSlice';
import {
  Button,
  Divider,
  FlexboxGrid,
  Col,
  Form,
  Message,
  Nav,
  Schema,
  Tag,
  toaster,
} from 'rsuite';
import TextField from '../AdminDasComponents/TextField';
import { useMutation, useQuery } from '@tanstack/react-query';
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
  new_password_confirm: StringType()
    .addRule(confirmRule, confirmMessage)
    .isRequired(requiredMessage),
});

const UserProfile = () => {
  const { isDark } = useSelector((state) => state.nav);
  const [formError, setFormError] = useState({});
  const [passwordError, setPasswordError] = useState({});
  const [navKey, setNavKey] = useState('user');
  const dispatch = useDispatch();
  const profileRef = useRef();
  const passwordRef = useRef();
  const authCtx = useContext(AuthContext);
  const userInfo = jwt_decode(authCtx?.token);

  const { data: userData, refetch: refetchUserData } = useQuery(
    ['userProfile'],
    async () => {
      const res = await fetchAPIRequest({
        urlPath: `user/${authCtx.user_id}`,
        token: authCtx.token,
        method: 'GET',
        showNotification: showNotification,
      });
      return res;
    },
  );

  const [userFormValue, setUserFormValue] = useState({
    first_name: userInfo?.given_name ? userInfo.given_name : '',
    last_name: userInfo?.family_name ? userInfo.family_name : '',
    username: userInfo?.preferred_username ? userInfo.preferred_username : '',
    email: userInfo?.email ? userInfo.email : '',
  });
  const [passwordFormValue, setPasswordFormValue] = useState({
    new_password: '',
    new_password_confirm: '',
  });

  useEffect(() => {
    setUserFormValue({
      ...userFormValue,
      first_name: userData?.data ? userData.data.first_name : userInfo?.given_name,
      last_name: userData?.data ? userData.data.last_name : userInfo?.family_name,
      username: userData?.data ? userData.data.username : userInfo?.preferred_username,
      email: userData?.data ? userData.data.email : userInfo.email,
      projects: userData?.data ? userData.data.projects : [],
    });
  }, [userData]);

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
  //prettier-ignore
  const { isLoading: updateUserLoading, mutate: updateUserMutate } = useMutation(() => {
    let organization_id = '';
    if (Array.isArray(authCtx?.organization_id)) {
      organization_id = authCtx?.organization_id[0];
    } else {
      organization_id = authCtx?.organization_id;
    }
    fetchAPIRequest({
      urlPath: `user/${authCtx?.user_id}`,
      token: authCtx.token,
      method: 'PUT',
      body: {
        ...userFormValue,
        organization_id: organization_id,
        enabled: true,
      },
      showNotification: showNotification,
    }),
    {
      onSuccess: (value) => {
        refetchUserData();
        showNotification(value?.status, value?.message);
      },
    };
  });

  // update password using react query
  const { isLoading: updatePasswordLoading, mutate: updatePasswordMutate } = useMutation(
    () =>
      fetchAPIRequest({
        urlPath: `user/update_password?user_id=${authCtx?.user_id}`,
        token: authCtx.token,
        method: 'POST',
        body: passwordFormValue,
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
    // submit user info
    if (navKey === 'user') {
      if (!profileRef.current.check()) {
        return;
      }
      updateUserMutate();
      // submit update password
    } else if (navKey === 'password') {
      if (!passwordRef.current.check()) {
        return;
      }
      updatePasswordMutate();
    }
  };

  const activeColor = isDark === 'dark' ? '#34c3ff' : '#2196f3';
  return (
    <div className="mainContainer">
      {(updateUserLoading || updatePasswordLoading) && <UseLoader />}

      <div className={`container ${profileMainContainer}`}>
        {/* --- Left Section ---  */}
        <div className={leftContainer}>
          <div className={imageContainer}>
            <img
              src={window.location.origin + '/default_avatar.png'}
              alt={userInfo?.preferred_username}
            />
            <h5>
              {userData?.data
                ? userData?.data?.first_name + ' ' + userData?.data?.last_name
                : userInfo?.name}
            </h5>
            <Tag color={'orange'}>
              <p>{authCtx?.user ? authCtx?.user?.role : 'User role'}</p>
            </Tag>
          </div>

          <h4>Details</h4>
          <Divider style={{ marginTop: '0' }} />
          <p className={infoStyle}>
            <span>First Name: </span>
            {userData?.data ? userData?.data?.first_name : userInfo?.given_name}
          </p>
          <p className={infoStyle}>
            <span>Last Name: </span>
            {userData?.data ? userData?.data?.last_name : userInfo?.family_name}
          </p>
          <p className={infoStyle}>
            <span>Username: </span>
            {userData?.data ? userData?.data?.username : userInfo?.preferred_username}
          </p>
          <p className={infoStyle}>
            <span>Email: </span>
            {userData?.data ? userData?.data?.email : userInfo?.email}
          </p>
          <p className={infoStyle}>
            <span>Status: </span>active
          </p>
        </div>

        {/* --- Right Section ---  */}
        <div className={rightContainer}>
          <Nav appearance="subtle" onSelect={(e) => setNavKey(e)} className={navBarStyle}>
            <Nav.Item
              eventKey="user"
              active={navKey === 'user'}
              style={{
                color: navKey === 'user' ? activeColor : '',
              }}
            >
              <h5>Edit Profile Details</h5>
            </Nav.Item>
            <Nav.Item
              active={navKey === 'password'}
              eventKey="password"
              style={{ color: navKey === 'password' ? activeColor : '' }}
            >
              <h5>Change Password</h5>
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
              data-cy="profile-form"
            >
              <FlexboxGrid justify="space-between">
                <FlexboxGrid.Item
                  as={Col}
                  colspan={24}
                  md={12}
                  style={{ marginBottom: '25px' }}
                >
                  <TextField
                    name="first_name"
                    label="First Name"
                    reqText="First name is required"
                    error={formError.first_name}
                  />
                </FlexboxGrid.Item>

                <FlexboxGrid.Item
                  as={Col}
                  colspan={24}
                  md={12}
                  style={{ marginBottom: '25px' }}
                >
                  <TextField
                    name="last_name"
                    label="Last Name"
                    reqText="Last name is required"
                    error={formError.last_name}
                  />
                </FlexboxGrid.Item>

                <FlexboxGrid.Item colspan={24} style={{ marginBottom: '25px' }}>
                  <TextField name="username" label="Username" disabled />
                </FlexboxGrid.Item>

                <FlexboxGrid.Item colspan={24} style={{ marginBottom: '25px' }}>
                  <TextField
                    name="email"
                    label="Email"
                    type="email"
                    error={formError.email}
                  />
                </FlexboxGrid.Item>
              </FlexboxGrid>

              <Button
                className={saveButton}
                appearance="primary"
                color="blue"
                type="submit"
                data-cy="profile-save"
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
              onChange={setPasswordFormValue}
              onCheck={setPasswordError}
              formValue={passwordFormValue}
              model={passwordModel}
            >
              <FlexboxGrid justify="space-between">
                <FlexboxGrid.Item
                  as={Col}
                  colspan={24}
                  md={12}
                  style={{ marginBottom: '25px' }}
                >
                  <PasswordField
                    name="new_password"
                    label="New Password"
                    type="password"
                    error={passwordError.new_password}
                    reqText="New password is required"
                  />
                </FlexboxGrid.Item>

                <FlexboxGrid.Item
                  as={Col}
                  colspan={24}
                  md={12}
                  style={{ marginBottom: '25px' }}
                >
                  <PasswordField
                    name="new_password_confirm"
                    label="Confirm Password"
                    error={passwordError.new_password_confirm}
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
