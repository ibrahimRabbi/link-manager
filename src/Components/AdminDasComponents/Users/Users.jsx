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
  fetchUpdateUser,
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
    header: 'First Name',
    key: 'first_name',
  },
  {
    header: 'Last Name',
    key: 'last_name',
  },
  {
    header: 'Email',
    key: 'email',
  },
];

const Users = () => {
  const { allUsers, usersLoading, isUserCreated, isUserDeleted } = useSelector(
    (state) => state.users,
  );
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
    setEditData({});
    setIsAddModal(false);
    reset();
  };

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
    }
  };

  // Pagination
  const handlePagination = (values) => {
    setPageSize(values.pageSize);
    setCurrPage(values.page);
  };

  // console.log(allUsers);
  useEffect(() => {
    const getUrl = `${lmApiUrl}/user?page=${currPage}&per_page=${pageSize}`;
    dispatch(fetchUsers({ url: getUrl, token: authCtx.token }));
  }, [isUserCreated, isUserDeleted, pageSize, currPage]);

  // handle delete user
  const handleDelete = (data) => {
    // const id = data[0]?.id;
    const idList = data?.map((v) => v.id);
    Swal.fire({
      title: 'Are you sure',
      icon: 'info',
      text: 'Do you want to delete the users!!',
      cancelButtonColor: 'red',
      showCancelButton: true,
      confirmButtonText: 'Delete',
      confirmButtonColor: '#3085d6',
      reverseButtons: true,
    }).then((value) => {
      if (value.isConfirmed) {
        const deleteUrl = `${lmApiUrl}/user?id_list=${idList}`;
        dispatch(fetchDeleteUser({ url: deleteUrl, token: authCtx.token }));
      }
    });
  };

  // handle Edit user
  const handleEdit = (data) => {
    if (data.length === 1) {
      setIsAddModal(true);
      const data1 = data[0];
      setEditData(data1);
    } else if (data.length > 1) {
      Swal.fire({
        title: 'Sorry!!',
        icon: 'info',
        text: 'You can not edit more than 1 user at the same time',
      });
    }
  };

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
    pageSize,
    page: allUsers?.page,
  };

  return (
    <div>
      {/* -- add User Modal -- */}
      <Theme theme="g10">
        <ComposedModal open={isAddModal} onClose={addModalClose}>
          <div className={mhContainer}>
            <h4>{editData?.email ? 'Edit User' : 'Add New User'}</h4>
            <ModalHeader onClick={addModalClose} />
          </div>

          <ModalBody id={modalBody}>
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
          </ModalBody>
        </ComposedModal>
      </Theme>

      {usersLoading && <ProgressBar label="" />}
      <UseTable props={tableProps} />
    </div>
  );
};

export default Users;
