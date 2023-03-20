import {
  Button,
  ComposedModal,
  ModalBody,
  ModalHeader,
  ProgressBar,
  Stack,
  TextInput,
  Theme,
} from '@carbon/react';
import React, { useState, useContext, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import Swal from 'sweetalert2';
import {
  fetchCreateUser,
  fetchDeleteUser,
  fetchUsers,
} from '../../../Redux/slices/usersSlice';
import AuthContext from '../../../Store/Auth-Context';
import UseTable from '../UseTable';
import styles from './Users.module.scss';

const { errText, formContainer, modalBtnCon, modalBody, mhContainer, flNameContainer } =
  styles;

const lmApiUrl = process.env.REACT_APP_LM_REST_API_URL;

// demo data
const headerData = [
  {
    header: 'ID',
    key: 'id',
  },
  {
    header: 'User Name',
    key: 'username',
  },
  {
    header: 'Email',
    key: 'email',
  },
  {
    header: 'Link',
    key: 'link',
  },
];

const Users = () => {
  const { allUsers, usersLoading, isUserCreated } = useSelector((state) => state.users);
  const [isAddModal, setIsAddModal] = useState(false);
  const [editData, setEditData] = useState({});
  const [currPage, setCurrPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const {
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm();
  const authCtx = useContext(AuthContext);
  const dispatch = useDispatch();

  // handle open add user modal
  const handleAddNew = () => {
    setIsAddModal(true);
  };
  const addModalClose = () => {
    setIsAddModal(false);
    reset();
  };

  // create user form submit
  const handleAddUser = (data) => {
    setIsAddModal(false);
    data.enabled = true;
    console.log(data);
    const postUrl = `${lmApiUrl}/user`;
    dispatch(
      fetchCreateUser({
        url: postUrl,
        token: authCtx.token,
        bodyData: data,
        reset,
      }),
    );
  };

  // Pagination
  const handlePagination = (values) => {
    console.log(values);
    setPageSize(values.pageSize);
    setCurrPage(values.page);
  };

  // console.log(allUsers);
  useEffect(() => {
    const getUrl = `${lmApiUrl}/user?page=${currPage}&per_page=${pageSize}`;
    dispatch(fetchUsers({ url: getUrl, token: authCtx.token }));
  }, [isUserCreated]);

  // handle delete user
  const handleDelete = (data) => {
    const id = data[0]?.id;
    if (data.length === 1) {
      const deleteUrl = `${lmApiUrl}/user?user_id=${Number(id)}`;
      dispatch(fetchDeleteUser({ url: deleteUrl, token: authCtx.token }));
    } else if (data.length > 1) {
      Swal.fire({
        title: 'Sorry!!',
        icon: 'info',
        text: 'You can not delete more than 1 user at the same time',
      });
    }
  };
  // handle Edit user
  const handleEdit = (data) => {
    if (data.length === 1) {
      setIsAddModal(true);
      const d = data[0];
      setEditData({ ...d, title: 'Edit A User' });
    } else if (data.length > 1) {
      Swal.fire({
        title: 'Sorry!!',
        icon: 'info',
        text: 'You can not edit more than 1 user at the same time',
      });
    }
  };

  console.log('Edit data: ', editData);

  // send props in the batch action table
  const tableProps = {
    title: 'Users',
    rowData: allUsers?.items?.length ? allUsers?.items : [],
    headerData,
    handleEdit,
    handleDelete,
    handleAddNew,
    handlePagination,
    totalItems: allUsers?.total_items,
    totalPages: allUsers?.total_pages,
    page: allUsers?.page,
  };

  return (
    <div>
      {/* -- add User Modal -- */}
      <Theme theme="g10">
        <ComposedModal open={isAddModal} onClose={addModalClose}>
          <div className={mhContainer}>
            <h4>Add New User</h4>
            <ModalHeader onClick={addModalClose} />
          </div>

          <ModalBody id={modalBody}>
            <form onSubmit={handleSubmit(handleAddUser)} className={formContainer}>
              <Stack gap={7}>
                {/* first name  */}
                <div className={flNameContainer}>
                  <div>
                    <TextInput
                      type="text"
                      id="first_name"
                      labelText="First Name"
                      placeholder="Please enter first name"
                      {...register('first_name', { required: true })}
                    />
                    <p className={errText}>{errors.first_name && 'Invalid First Name'}</p>
                  </div>

                  {/* last name  */}
                  <div>
                    <TextInput
                      type="text"
                      id="last_name"
                      labelText="Last Name"
                      placeholder="Please enter last name"
                      {...register('last_name', { required: true })}
                    />
                    <p className={errText}>{errors.last_name && 'Invalid Last Name'}</p>
                  </div>
                </div>

                {/* username  */}
                <span>
                  <TextInput
                    type="text"
                    id="userName"
                    labelText="Username"
                    placeholder="Please enter username"
                    {...register('username', { required: true })}
                  />
                  <p className={errText}>{errors.username && 'Invalid Username'}</p>
                </span>

                {/* email  */}
                <span>
                  <TextInput
                    type="email"
                    id="email"
                    labelText="Email"
                    placeholder="Please enter email"
                    {...register('email', { required: true })}
                  />
                  <p className={errText}>{errors.email && 'Invalid Email'}</p>
                </span>

                <div className={modalBtnCon}>
                  <Button kind="secondary" size="md" onClick={addModalClose}>
                    Cancel
                  </Button>
                  <Button kind="primary" size="md" type="submit">
                    Create
                  </Button>
                </div>
              </Stack>
            </form>
          </ModalBody>
        </ComposedModal>
      </Theme>

      {usersLoading && <ProgressBar label="" />}
      <UseTable props={tableProps} />
    </div>
  );
};

export default Users;
