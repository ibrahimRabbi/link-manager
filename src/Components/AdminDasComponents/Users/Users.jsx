// import { ComposedModal, ModalBody, ModalHeader,
// ProgressBar, Theme } from '@carbon/react';
import React, { useState, useContext, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Swal from 'sweetalert2';
import { fetchDeleteUser, fetchUsers } from '../../../Redux/slices/usersSlice';
import AuthContext from '../../../Store/Auth-Context';
// import AddUser from './AddUser';
// import styles from './Users.module.scss';
import { handleCurrPageTitle } from '../../../Redux/slices/navSlice';
import AdminDataTable from '../AdminDataTable';
import { FlexboxGrid, Loader } from 'rsuite';

// const { modalBody, mhContainer } = styles;
// import UseTable from '../UseTable';

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
  // const [isAddModal, setIsAddModal] = useState(false);
  // const [editData, setEditData] = useState({});
  const [currPage, setCurrPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const authCtx = useContext(AuthContext);
  const dispatch = useDispatch();

  // handle open add user modal
  const handleAddNew = () => {
    // setIsAddModal(true);
  };
  // const addModalClose = () => {
  //   setEditData({});
  //   setIsAddModal(false);
  // };

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
      // setIsAddModal(true);
      // const data1 = data[0];
      // setEditData(data1);
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
    handleChangeLimit,
    totalItems: allUsers?.total_items,
    totalPages: allUsers?.total_pages,
    pageSize,
    page: allUsers?.page,
    inpPlaceholder: 'Search User',
  };

  return (
    <div>
      {/* <Theme theme="g10">
        <ComposedModal open={isAddModal} onClose={addModalClose}>
          <div className={mhContainer}>
            <h4>{editData?.email ? 'Edit User' : 'Add New User'}</h4>
            <ModalHeader onClick={addModalClose} />
          </div>

          <ModalBody id={modalBody}>
            <AddUser
              editData={editData}
              setIsAddModal={setIsAddModal}
              addModalClose={addModalClose}
            />
          </ModalBody>
        </ComposedModal>
      </Theme> */}

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
