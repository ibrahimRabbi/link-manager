import { Button, Stack, TextInput } from '@carbon/react';
import React, { useContext } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { fetchCreateUser, fetchUpdateUser } from '../../../Redux/slices/usersSlice';
import AuthContext from '../../../Store/Auth-Context';
import styles from './Users.module.scss';

const { errText, formContainer, modalBtnCon, flNameContainer } = styles;

const lmApiUrl = process.env.REACT_APP_LM_REST_API_URL;

const AddUser = ({ editData, setIsAddModal, addModalClose }) => {
  const {
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm();
  const authCtx = useContext(AuthContext);
  const dispatch = useDispatch();

  // create user and edit user form submit
  const handleAddUser = (data) => {
    setIsAddModal(false);
    // Update user
    if (editData?.email) {
      data = {
        first_name: data?.first_name ? data?.first_name : editData?.first_name,
        last_name: data?.lsat_name ? data?.last_name : editData?.last_name,
        username: data?.username ? data?.username : editData?.username,
        email: data?.email ? data?.email : editData?.email,
      };
      const putUrl = `${lmApiUrl}/user/${editData?.id}`;
      dispatch(
        fetchUpdateUser({
          url: putUrl,
          token: authCtx.token,
          bodyData: data,
          reset,
        }),
      );
      console.log(data);
    }
    // Create User
    else {
      data.enabled = true;
      const postUrl = `${lmApiUrl}/user`;
      dispatch(
        fetchCreateUser({
          url: postUrl,
          token: authCtx.token,
          bodyData: data,
          reset,
        }),
      );
      console.log(data);
    }
  };

  return (
    <div>
      {/* -- add User -- */}
      <form onSubmit={handleSubmit(handleAddUser)} className={formContainer}>
        <Stack gap={7}>
          {/* first name  */}
          <div className={flNameContainer}>
            <div>
              <TextInput
                defaultValue={editData?.first_name}
                type="text"
                id="first_name"
                labelText="First Name"
                placeholder="Please enter first name"
                {...register('first_name', {
                  required: editData?.first_name ? false : true,
                })}
              />
              <p className={errText}>{errors.first_name && 'Invalid First Name'}</p>
            </div>

            {/* last name  */}
            <div>
              <TextInput
                defaultValue={editData?.last_name}
                type="text"
                id="last_name"
                labelText="Last Name"
                placeholder="Please enter last name"
                {...register('last_name', {
                  required: editData?.last_name ? false : true,
                })}
              />
              <p className={errText}>{errors.last_name && 'Invalid Last Name'}</p>
            </div>
          </div>

          {/* username  */}
          <span>
            <TextInput
              defaultValue={editData?.username}
              type="text"
              id="userName"
              labelText="Username"
              placeholder="Please enter username"
              {...register('username', {
                required: editData?.username ? false : true,
              })}
            />
            <p className={errText}>{errors.username && 'Invalid Username'}</p>
          </span>

          {/* email  */}
          <span>
            <TextInput
              defaultValue={editData?.email}
              type="email"
              id="email"
              labelText="Email"
              placeholder="Please enter email"
              {...register('email', { required: editData?.email ? false : true })}
            />
            <p className={errText}>{errors.email && 'Invalid Email'}</p>
          </span>

          <div className={modalBtnCon}>
            <Button kind="secondary" size="md" onClick={addModalClose}>
              Cancel
            </Button>
            <Button kind="primary" size="md" type="submit">
              {editData?.email ? 'Save' : 'Ok'}
            </Button>
          </div>
        </Stack>
      </form>
    </div>
  );
};

export default AddUser;
