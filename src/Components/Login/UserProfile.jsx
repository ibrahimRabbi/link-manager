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
import { useQuery } from '@tanstack/react-query';
import AuthContext from '../../Store/Auth-Context';
import fetchAPIRequest from '../../apiRequests/apiRequest';

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

const UserProfile = () => {
  const [formError, setFormError] = useState({});
  const [navKey, setNavKey] = useState('user');
  const [formValue, setFormValue] = useState({
    first_name: 'Mario',
    last_name: 'Jim\u00e9nez',
    user_name: 'mario',
    email: 'isccarrasco@icloud.com',
    current_pass: '',
    new_pass: '',
    confirm_pass: '',
  });
  const dispatch = useDispatch();
  const profileRef = useRef();
  const authCtx = useContext(AuthContext);
  const loggedInUserId = 1;
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

  // get data using react-query
  const { data: currentUser } = useQuery(['user'], () =>
    fetchAPIRequest({
      urlPath: `user/${loggedInUserId}`,
      token: authCtx.token,
      method: 'GET',
      showNotification: showNotification,
    }),
  );

  console.log(currentUser);
  // form validation schema modal
  const model = Schema.Model({
    first_name:
      navKey === 'user'
        ? StringType().isRequired('This field is required')
        : StringType(),
    last_name:
      navKey === 'user'
        ? StringType().isRequired('This field is required')
        : StringType(),
    user_name:
      navKey === 'user'
        ? StringType().isRequired('This field is required')
        : StringType(),
    email:
      navKey === 'user'
        ? StringType().isRequired('This field is required')
        : StringType(),
    current_pass:
      navKey === 'password'
        ? StringType().isRequired('This field is required')
        : StringType(),
    new_pass:
      navKey === 'password'
        ? StringType().isRequired('This field is required')
        : StringType(),
    confirm_pass:
      navKey === 'password'
        ? StringType().isRequired('This field is required')
        : StringType(),
  });

  // handle same user info or password
  const handleUpdateProfile = () => {
    if (!profileRef.current.check()) {
      console.log(formError);
      return;
    } else if (navKey === 'user') {
      const userData = {
        first_name: formValue.first_name,
        last_name: formValue.last_name,
        user_name: formValue.user_name,
        email: formValue.email,
      };
      console.log(userData);
    } else if (navKey === 'password') {
      const passwordData = {
        current_pass: formValue.current_pass,
        new_pass: formValue.new_pass,
        confirm_pass: formValue.confirm_pass,
      };
      console.log(passwordData);
    }
  };

  return (
    <div className="mainContainer">
      <div className={`container ${profileMainContainer}`}>
        {/* --- Left Section ---  */}
        <div className={leftContainer}>
          <div className={imageContainer}>
            <img src="./default_avatar.jpg" alt="avatar" />
            <h5>Mario Jiménez</h5>
            <Tag color={'orange'}>
              <p>Admin</p>
            </Tag>
          </div>

          <h4>Details</h4>
          <Divider style={{ marginTop: '0' }} />
          <p className={infoStyle}>
            <span>First Name: </span>Mario
          </p>
          <p className={infoStyle}>
            <span>Last Name: </span>Jiménez
          </p>
          <p className={infoStyle}>
            <span>Username: </span>mario
          </p>
          <p className={infoStyle}>
            <span>Email: </span>isccarrasco@icloud.com
          </p>
          <p className={infoStyle}>
            <span>Status: </span>active
          </p>
        </div>

        {/* --- Right Section ---  */}
        <div className={rightContainer}>
          <Nav appearance="subtle" onSelect={(e) => setNavKey(e)} className={navBarStyle}>
            <Nav.Item active={navKey === 'user'} eventKey="user">
              <h5>Update User</h5>
            </Nav.Item>
            <Nav.Item active={navKey === 'password'} eventKey="password">
              <h5>Update Password</h5>
            </Nav.Item>
          </Nav>

          <Form
            fluid
            ref={profileRef}
            onChange={setFormValue}
            onCheck={setFormError}
            formValue={formValue}
            model={model}
          >
            {navKey === 'user' && (
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
                  <TextField name="user_name" label="Username" />
                </FlexboxGrid.Item>

                <FlexboxGrid.Item colspan={24} style={{ marginBottom: '30px' }}>
                  <TextField name="email" label="Email" />
                </FlexboxGrid.Item>
              </FlexboxGrid>
            )}
            {navKey === 'password' && (
              <FlexboxGrid justify="space-between">
                <FlexboxGrid.Item colspan={24} style={{ marginBottom: '30px' }}>
                  <TextField
                    name="current_pass"
                    label="Current Password"
                    reqText="Current password is required"
                  />
                </FlexboxGrid.Item>
                <FlexboxGrid.Item colspan={11} style={{ marginBottom: '30px' }}>
                  <TextField
                    name="new_pass"
                    label="New Password"
                    reqText="New password is required"
                  />
                </FlexboxGrid.Item>

                <FlexboxGrid.Item colspan={11} style={{ marginBottom: '30px' }}>
                  <TextField
                    name="confirm_pass"
                    label="Confirm Password"
                    reqText="Confirm password is required"
                  />
                </FlexboxGrid.Item>
              </FlexboxGrid>
            )}

            <Button
              className={saveButton}
              appearance="primary"
              color="blue"
              onClick={handleUpdateProfile}
            >
              Save
            </Button>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
