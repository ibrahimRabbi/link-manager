import React, { useState, useContext, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Swal from 'sweetalert2';
import AuthContext from '../../../Store/Auth-Context';
import {
  handleCurrPageTitle,
  handleIsAdminEditing,
} from '../../../Redux/slices/navSlice';
import AdminDataTable from '../AdminDataTable';
import { Modal } from 'rsuite';
import AddUser from './AddUser';
import UseLoader from '../../Shared/UseLoader';
import { fetchDeleteData, fetchGetData } from '../../../Redux/slices/useCRUDSlice';
import Notification from '../../Shared/Notification';

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
  const { crudData, isCreated, isDeleted, isUpdated, isCrudLoading } = useSelector(
    (state) => state.crud,
  );

  const { refreshData, isAdminEditing } = useSelector((state) => state.nav);
  const [isAddModal, setIsAddModal] = useState(false);
  const [editData, setEditData] = useState({});
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
    setNotificationType(type);
    setNotificationMessage(message);
  };

  const authCtx = useContext(AuthContext);
  const dispatch = useDispatch();

  const handleClose = () => {
    setIsAddModal(false);
    handleResetForm();
  };

  // handle open add user modal
  const handleAddNew = () => {
    setIsAddModal(true);
  };

  // reset form
  const handleResetForm = () => {
    setEditData({});
    setFormValue({
      first_name: '',
      last_name: '',
      username: '',
      email: '',
    });
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

    const getUrl = `${lmApiUrl}/user?page=${currPage}&per_page=${pageSize}`;
    dispatch(
      fetchGetData({
        url: getUrl,
        token: authCtx.token,
        stateName: 'allUsers',
        showNotification: showNotification,
      }),
    );
  }, [isCreated, isUpdated, isDeleted, pageSize, currPage, refreshData]);

  // handle delete user
  const handleDelete = (data) => {
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
        const deleteUrl = `${lmApiUrl}/user/${data?.id}`;
        dispatch(
          fetchDeleteData({
            url: deleteUrl,
            token: authCtx.token,
            showNotification: showNotification,
          }),
        );
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
    rowData: crudData?.allUsers?.items?.length ? crudData?.allUsers?.items : [],
    headerData,
    handleEdit,
    handleDelete,
    handleAddNew,
    handlePagination,
    handleChangeLimit,
    totalItems: crudData?.allUsers?.total_items,
    totalPages: crudData?.allUsers?.total_pages,
    pageSize,
    page: crudData?.allUsers?.page,
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
            setNotificationType={setNotificationType}
            setNotificationMessage={setNotificationMessage}
            isUserSection={true}
          />
        </Modal.Body>
        <Modal.Footer></Modal.Footer>
      </Modal>

      {isCrudLoading && <UseLoader />}
      {notificationType && notificationMessage && (
        <Notification
          type={notificationType}
          message={notificationMessage}
          setNotificationType={setNotificationType}
          setNotificationMessage={setNotificationMessage}
        />
      )}
      <AdminDataTable props={tableProps} />
    </div>
  );
};

export default Users;
