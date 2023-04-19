// import { Button, Stack, TextInput } from '@carbon/react';
import React from 'react';
// import { useForm } from 'react-hook-form';
// import { useDispatch } from 'react-redux';
// import { fetchCreateUser, fetchUpdateUser } from '../../../Redux/slices/usersSlice';
import AuthContext from '../../../Store/Auth-Context';

// import styles from './Users.module.scss';
// const { errText, formContainer, modalBtnCon, flNameContainer } = styles;

const lmApiUrl = process.env.REACT_APP_LM_REST_API_URL;
import { Form, Button, Schema, FlexboxGrid } from 'rsuite';
import TextField from '../TextField';
import { useContext } from 'react';
import { useDispatch } from 'react-redux';
import { fetchCreateUser } from '../../../Redux/slices/usersSlice';

const { StringType } = Schema.Types;

const model = Schema.Model({
  first_name: StringType().isRequired('This field is required.'),
  last_name: StringType().isRequired('This field is required.'),
  username: StringType().isRequired('This field is required.'),
  email: StringType()
    .isEmail('Please enter a valid email address.')
    .isRequired('This field is required.'),
});

const AddUser = ({ isUserSection, handleClose }) => {
  const [formError, setFormError] = React.useState({});
  const [formValue, setFormValue] = React.useState({
    first_name: '',
    last_name: '',
    username: '',
    email: '',
  });
  const userFormRef = React.useRef();
  const authCtx = useContext(AuthContext);
  const dispatch = useDispatch();

  const handleSubmit = () => {
    if (!userFormRef.current.check()) {
      console.error('Form Error', formError);
      return;
    }

    const postUrl = `${lmApiUrl}/user`;
    dispatch(
      fetchCreateUser({
        url: postUrl,
        token: authCtx.token,
        bodyData: { ...formValue, enabled: true },
      }),
    );

    // close modal
    if (handleClose) handleClose();
  };

  // console.log(formValue);
  // const {
  //   handleSubmit,
  //   register,
  //   reset,
  //   formState: { errors },
  // } = useForm();
  // const dispatch = useDispatch();

  // create user and edit user form submit
  // const handleAddUser = (data) => {
  // console.log(data);
  // console.log('form value', formValue);
  // setIsAddModal(false);
  // Update user
  // if (editData?.email) {
  //   data = {
  //     first_name: data?.first_name ? data?.first_name : editData?.first_name,
  //     last_name: data?.lsat_name ? data?.last_name : editData?.last_name,
  //     username: data?.username ? data?.username : editData?.username,
  //     email: data?.email ? data?.email : editData?.email,
  //   };
  //   const putUrl = `${lmApiUrl}/user/${editData?.id}`;
  //   dispatch(
  //     fetchUpdateUser({
  //       url: putUrl,
  //       token: authCtx.token,
  //       bodyData: data,
  //       reset,
  //     }),
  //   );
  //   console.log(data);
  // }
  // Create User
  // else {
  // data.enabled = true;
  // const postUrl = `${lmApiUrl}/user`;
  // dispatch(
  //   fetchCreateUser({
  //     url: postUrl,
  //     token: authCtx.token,
  //     bodyData: data,
  //     reset,
  //   }),
  // );
  // console.log(data);
  // }
  // };

  return (
    <div className="show-grid">
      <Form
        fluid
        ref={userFormRef}
        onChange={setFormValue}
        onCheck={setFormError}
        formValue={formValue}
        // formDefaultValue={}
        model={model}
      >
        <FlexboxGrid justify="space-between">
          <FlexboxGrid.Item colspan={11}>
            <TextField name="first_name" label="First Name" />
          </FlexboxGrid.Item>

          <FlexboxGrid.Item colspan={11}>
            <TextField name="last_name" label="Last Name" />
          </FlexboxGrid.Item>
          <FlexboxGrid.Item colspan={24} style={{ margin: '30px 0' }}>
            <TextField name="username" label="User name" />
          </FlexboxGrid.Item>
          <FlexboxGrid.Item colspan={24}>
            <TextField name="email" label="Email" />
          </FlexboxGrid.Item>
        </FlexboxGrid>

        {isUserSection ? (
          <FlexboxGrid justify="end" style={{ marginTop: '30px' }}>
            <Button
              style={{ marginRight: '15px' }}
              onClick={handleSubmit}
              appearance="primary"
              color="blue"
            >
              Ok
            </Button>

            <Button onClick={() => handleClose()} appearance="default" color="blue">
              Cancel
            </Button>
          </FlexboxGrid>
        ) : (
          <Button
            style={{ margin: '30px 0' }}
            appearance="primary"
            onClick={handleSubmit}
          >
            Submit
          </Button>
        )}
      </Form>
    </div>
  );
};

export default AddUser;
