import React, { useState, useContext, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Swal from 'sweetalert2';
import AuthContext from '../../../Store/Auth-Context';
import {
  handleCurrPageTitle,
  handleIsAdminEditing,
} from '../../../Redux/slices/navSlice';
import AdminDataTable from '../AdminDataTable';
import { Message, Modal, toaster } from 'rsuite';
import AddUser from './AddUser';
import UseLoader from '../../Shared/UseLoader';
import { useMutation, useQuery } from '@tanstack/react-query';
import fetchAPIRequest from '../../../apiRequests/apiRequest';

// demo data
const headerData = [
  {
    header: 'ID',
    key: 'id',
  },
  {
    header: 'Users Name',
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
  const { refreshData, isAdminEditing } = useSelector((state) => state.nav);
  const [isAddModal, setIsAddModal] = useState(false);
  const [createUpdateLoading, setCreateUpdateLoading] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [createSuccess, setCreateSuccess] = useState(false);
  const [editData, setEditData] = useState({});
  const [deleteData, setDeleteData] = useState({});
  const [currPage, setCurrPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [formValue, setFormValue] = React.useState({
    first_name: '',
    last_name: '',
    username: '',
    email: '',
  });
  const [notificationType, setNotificationType] = React.useState('');
  const [notificationMessage, setNotificationMessage] = React.useState('');
  const showNotification = (type, message) => {
    if ((type && message) || (notificationType && notificationMessage)) {
      const messages = (
        <Message closable showIcon type={type || notificationType}>
          {message || notificationMessage}
        </Message>
      );
      toaster.push(messages, { placement: 'bottomCenter', duration: 5000 });
    }
  };
  const authCtx = useContext(AuthContext);
  const dispatch = useDispatch();

  // get data using react-query
  const {
    data: allUsers,
    isLoading,
    refetch: refetchUsers,
  } = useQuery(['user'], () =>
    fetchAPIRequest({
      urlPath: `user?page=${currPage}&per_page=${pageSize}`,
      token: authCtx.token,
      method: 'GET',
      showNotification: showNotification,
    }),
  );

  // Delete data using react query
  const {
    isLoading: deleteLoading,
    isSuccess: deleteSuccess,
    mutate: deleteMutate,
  } = useMutation(
    () =>
      fetchAPIRequest({
        urlPath: `user/${deleteData?.id}`,
        token: authCtx.token,
        method: 'DELETE',
        showNotification: showNotification,
      }),
    {
      onSuccess: () => {
        setDeleteData({});
      },
    },
  );

  const handleClose = () => {
    setIsAddModal(false);
    handleResetForm();
  };

  // handle open add user modal
  const handleAddNew = () => {
    dispatch(handleIsAdminEditing(false));
    setIsAddModal(true);
  };

  // reset form
  const handleResetForm = () => {
    setTimeout(() => {
      setEditData({});
      if (isAdminEditing) dispatch(handleIsAdminEditing(false));
      setFormValue({
        first_name: '',
        last_name: '',
        username: '',
        email: '',
      });
    }, 500);
  };

  // Pagination
  const handlePagination = (value) => {
    setCurrPage(value);
  };

  const handleChangeLimit = (dataKey) => {
    setCurrPage(1);
    setPageSize(dataKey);
  };

  // get all users
  useEffect(() => {
    dispatch(handleCurrPageTitle('Users'));
    refetchUsers();
  }, [createSuccess, updateSuccess, deleteSuccess, pageSize, currPage, refreshData]);

  // handle delete user
  const handleDelete = (data) => {
    setDeleteData(data);
    Swal.fire({
      title: 'Are you sure',
      icon: 'info',
      text: 'Are you sure you want to delete this user?',
      cancelButtonColor: 'red',
      showCancelButton: true,
      confirmButtonText: 'Delete',
      confirmButtonColor: '#3085d6',
      reverseButtons: true,
    }).then((value) => {
      if (value.isConfirmed) {
        deleteMutate();
      }
    });
  };

  // handle Edit user
  const handleEdit = (data) => {
    setEditData(data);
    setFormValue({
      first_name: data?.first_name,
      last_name: data?.last_name,
      username: data?.username,
      email: data?.email,
    });
    dispatch(handleIsAdminEditing(true));
    setIsAddModal(true);
  };

  // send props in the batch action table
  const tableProps = {
    title: 'Users',
    rowData: allUsers ? allUsers?.items : [],
    headerData,
    handleEdit,
    handleDelete,
    handleAddNew,
    handlePagination,
    handleChangeLimit,
    totalItems: allUsers?.total_items,
    totalPages: allUsers?.total_pages,
    pageSize,
    page: allUsers?.page,
    inpPlaceholder: 'Search User',
  };

  return (
    <div>
      <Modal backdrop={'true'} keyboard={false} open={isAddModal} onClose={handleClose}>
        <Modal.Header>
          <Modal.Title className="adminModalTitle">
            {isAdminEditing ? 'Edit User' : 'Add New User'}
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <AddUser
            formValue={formValue}
            setFormValue={setFormValue}
            editData={editData}
            handleClose={handleClose}
            setCreateUpdateLoading={setCreateUpdateLoading}
            setUpdateSuccess={setUpdateSuccess}
            setCreateSuccess={setCreateSuccess}
            setNotificationType={setNotificationType}
            setNotificationMessage={setNotificationMessage}
            isUserSection={true}
          />
        </Modal.Body>
        <Modal.Footer></Modal.Footer>
      </Modal>

      {(isLoading || createUpdateLoading || deleteLoading) && <UseLoader />}
      <AdminDataTable props={tableProps} />
    </div>
  );
};

export default Users;
