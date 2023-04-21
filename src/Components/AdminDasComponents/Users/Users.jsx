import React, { useState, useContext, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Swal from 'sweetalert2';
import { fetchDeleteUser, fetchUsers } from '../../../Redux/slices/usersSlice';
import AuthContext from '../../../Store/Auth-Context';
import { handleCurrPageTitle } from '../../../Redux/slices/navSlice';
import AdminDataTable from '../AdminDataTable';
import { FlexboxGrid, Loader, Modal } from 'rsuite';
import AddUser from './AddUser';

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
  const { refreshData } = useSelector((state) => state.nav);
  const [isAddModal, setIsAddModal] = useState(false);
  const [editData, setEditData] = useState({});
  const [currPage, setCurrPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const authCtx = useContext(AuthContext);
  const dispatch = useDispatch();

  const handleClose = () => setIsAddModal(false);

  // handle open add user modal
  const handleAddNew = () => {
    setIsAddModal(true);
  };

  // Pagination
  const handlePagination = (value) => {
    setCurrPage(value);
  };

  const handleChangeLimit = (dataKey) => {
    setCurrPage(1);
    setPageSize(dataKey);
  };

  // console.log(allUsers);
  useEffect(() => {
    dispatch(handleCurrPageTitle('Users'));

    const getUrl = `${lmApiUrl}/user?page=${currPage}&per_page=${pageSize}`;
    dispatch(fetchUsers({ url: getUrl, token: authCtx.token }));
  }, [isUserCreated, isUserDeleted, pageSize, currPage, refreshData]);

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
        const deleteUrl = `${lmApiUrl}/user?user_id=${data?.id}`;
        dispatch(fetchDeleteUser({ url: deleteUrl, token: authCtx.token }));
      }
    });
  };

  // handle Edit user
  const handleEdit = (data) => {
    setEditData(data);
    setIsAddModal(true);
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
          <Modal.Title style={{ fontSize: '20px' }}>Add New User</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <AddUser editData={editData} handleClose={handleClose} isUserSection={true} />
        </Modal.Body>
        <Modal.Footer></Modal.Footer>
      </Modal>

      {usersLoading && (
        <FlexboxGrid justify="center">
          <Loader size="md" label="" />
        </FlexboxGrid>
      )}
      {/* <UseTable props={tableProps} /> */}
      <AdminDataTable props={tableProps} />
    </div>
  );
};

export default Users;
