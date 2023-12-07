import React, { useState, useContext, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import AuthContext from '../../../Store/Auth-Context';
import {
  handleCurrPageTitle,
  handleIsAdminEditing,
} from '../../../Redux/slices/navSlice';
import AdminDataTable from '../AdminDataTable';
import { Button, Message, Modal, toaster } from 'rsuite';
import AddUser from './AddUser';
import UseLoader from '../../Shared/UseLoader';
import { useMutation, useQuery } from '@tanstack/react-query';
import fetchAPIRequest from '../../../apiRequests/apiRequest';
import AlertModal from '../../Shared/AlertModal';
import { Mixpanel } from '../../../../Mixpanel';
import jwt_decode from 'jwt-decode';

// demo data
const headerData = [
  {
    header: 'Username',
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
    organization_id: '',
    projects: [],
  });
  const [open, setOpen] = useState(false);
  const [notificationType, setNotificationType] = React.useState('');
  const [notificationMessage, setNotificationMessage] = React.useState('');
  const [isSubmitClick, setIsSubmitClick] = React.useState(0);
  const authCtx = useContext(AuthContext);
  const dispatch = useDispatch();
  const userInfo = jwt_decode(authCtx?.token);

  const showNotification = (type, message) => {
    if (type && message) {
      const messages = (
        <Message closable showIcon type={type}>
          {message}
        </Message>
      );
      toaster.push(messages, { placement: 'bottomCenter', duration: 5000 });
    } else if (notificationMessage && notificationType) {
      const messages = (
        <Message closable showIcon type={notificationType}>
          {notificationMessage}
        </Message>
      );
      toaster.push(messages, { placement: 'bottomCenter', duration: 5000 });
    }
  };

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
        Mixpanel.track('User deleted success', {
          username: userInfo?.preferred_username,
          deleted_user_id: deleteData?.id,
        });
        setDeleteData({});
      },
    },
  );

  //Resend email via react query
  const { mutate: resendEmailMutate } = useMutation(
    (userId) =>
      fetchAPIRequest({
        urlPath: 'user/resend_verification_email',
        token: authCtx.token,
        method: 'POST',
        body: {
          user_id: userId,
        },
        showNotification: showNotification,
      }),
    {
      onSuccess: () => {
        Mixpanel.track('Verification email sent again to user', {
          username: userInfo?.preferred_username,
        });
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
      setIsSubmitClick(0);
      if (isAdminEditing) dispatch(handleIsAdminEditing(false));
      setFormValue({
        first_name: '',
        last_name: '',
        username: '',
        email: '',
        organization_id: '',
        projects: [],
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

  //option to send email verification to the user
  const handleResendEmailVerification = (data) => {
    resendEmailMutate(data.id);
  };

  // handle delete user
  const handleDelete = (data) => {
    setDeleteData(data);
    setOpen(true);
  };
  const handleConfirmed = (value) => {
    if (value) {
      deleteMutate();
    }
  };

  const handleViewAccess = async (data) => {
    setEditData(data);
    dispatch(handleIsAdminEditing(true));
    const mappedProjects = data?.projects?.reduce((accumulator, project) => {
      accumulator.push({
        ...project,
        label: project?.name,
        value: project?.id,
      });
      return accumulator;
    }, []);

    setFormValue({
      first_name: data?.first_name,
      last_name: data?.last_name,
      username: data?.username,
      email: data?.email,
      organization_id: data?.organization[0]?.id,
      projects: mappedProjects,
    });
    setIsAddModal(true);
  };

  // send props in the batch action table
  const tableProps = {
    title: 'Users',
    rowData: allUsers ? allUsers?.items : [],
    headerData,
    handleViewAccess,
    handleResendEmailVerification,
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
      <Modal
        backdrop={'true'}
        keyboard={false}
        open={isAddModal}
        onClose={handleClose}
        size="md"
      >
        <Modal.Header>
          <Modal.Title className="adminModalTitle">
            {isAdminEditing ? 'View Access' : 'Add New User'}
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
            createSuccess={createSuccess}
            updateSuccess={updateSuccess}
            setCreateSuccess={setCreateSuccess}
            setNotificationType={setNotificationType}
            setNotificationMessage={setNotificationMessage}
            isUserSection={true}
            isSubmitClick={isSubmitClick}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button
            onClick={handleClose}
            appearance="default"
            className="adminModalFooterBtn"
          >
            Cancel
          </Button>
          <Button
            onClick={() => setIsSubmitClick(isSubmitClick + 1)}
            appearance="primary"
            className="adminModalFooterBtn"
          >
            Save
          </Button>
        </Modal.Footer>
      </Modal>

      {(isLoading || createUpdateLoading || deleteLoading) && <UseLoader />}
      {/* confirmation modal  */}
      <AlertModal
        open={open}
        setOpen={setOpen}
        content={'Do you want to delete the user?'}
        handleConfirmed={handleConfirmed}
      />
      <AdminDataTable props={tableProps} />
    </div>
  );
};

export default Users;
