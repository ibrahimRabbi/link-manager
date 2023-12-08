import React, { useState, useContext, useEffect } from 'react';
import { Message, toaster } from 'rsuite';
import { useMutation, useQuery } from '@tanstack/react-query';
import AdminDataTable from '../../../AdminDataTable.jsx';
import AuthContext from '../../../../../Store/Auth-Context.jsx';
import fetchAPIRequest from '../../../../../apiRequests/apiRequest.js';

// demo data
const headerData = [
  {
    header: 'Full name',
    key: 'full_name',
  },
  {
    header: 'Username',
    key: 'username',
  },
  {
    header: 'Email',
    key: 'email',
  },
];

const UsersTable = (props) => {
  const authCtx = useContext(AuthContext);
  const { identifier } = props;

  const [currPage, setCurrPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [notificationType] = React.useState('');
  const [notificationMessage] = React.useState('');
  const [addedUser, setAddedUser] = useState(false);
  const [deletedUser, setDeletedUser] = useState(false);
  const [projectData, setProjectData] = useState({});
  const [projectUsers, setProjectUsers] = useState([]);
  const [formValue, setFormValue] = useState({
    name: '',
    description: '',
    organization_id: '',
    users: [],
  });

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

  const {
    // eslint-disable-next-line no-unused-vars
    data: singleProject,
    refetch: refetchSingleProject,
  } = useQuery(
    ['project'],
    () =>
      fetchAPIRequest({
        // eslint-disable-next-line max-len
        urlPath: `${authCtx.organization_id}/project/${identifier}`,
        token: authCtx.token,
        method: 'GET',
        showNotification: showNotification,
      }),
    {
      onSuccess: (singleProject) => {
        setProjectData(singleProject);
      },
    },
  );

  const { mutate: updateMutate } = useMutation(
    () =>
      fetchAPIRequest({
        urlPath: `${authCtx.organization_id}/project/${identifier}`,
        token: authCtx.token,
        method: 'PUT',
        body: formValue,
        showNotification: showNotification,
      }),
    {
      onSuccess: () => {
        refetchSingleProject();
        setAddedUser(false);
        setDeletedUser(false);
      },
    },
  );

  // get data using react-query
  const { data: allUsers } = useQuery(['user'], () =>
    fetchAPIRequest({
      urlPath: `user?page=${currPage}&per_page=${pageSize}`,
      token: authCtx.token,
      method: 'GET',
      showNotification: showNotification,
    }),
  );

  // Pagination
  const handlePagination = (value) => {
    setCurrPage(value);
  };

  const handleChangeLimit = (dataKey) => {
    setCurrPage(1);
    setPageSize(dataKey);
  };

  const handleAddToResource = (data) => {
    const newFormValue = {
      ...formValue,
      users: [...formValue.users, data],
    };
    setFormValue(newFormValue);
    setAddedUser(true);
  };

  const handleRemoveFromResource = (data) => {
    const newFormValue = {
      ...formValue,
      users: formValue.users.filter((item) => item.id !== data.id),
    };
    setFormValue(newFormValue);
    setDeletedUser(true);
  };

  // send props in the batch action table
  const tableProps = {
    title: 'Users',
    rowData: allUsers ? allUsers?.items : [],
    headerData,
    handlePagination,
    handleChangeLimit,
    handleAddToResource,
    handleRemoveFromResource,
    addToResourceLabel: 'Add to Project',
    removeFromResourceLabel: 'Remove from Project',
    registeredUsers: projectUsers,
    totalItems: allUsers?.total_items,
    totalPages: allUsers?.total_pages,
    pageSize,
    page: allUsers?.page,
    inpPlaceholder: 'Search User',
    showAddNewButton: false,
  };

  useEffect(() => {
    const registeredUsers = projectData?.users?.map((item) => item.id);
    setProjectUsers(registeredUsers);

    const newFormValue = {
      name: projectData.name,
      description: projectData.description,
      organization_id: projectData.organization_id,
      users: projectData.users,
    };
    setFormValue(newFormValue);
  }, [projectData]);

  useEffect(() => {
    if (addedUser) {
      updateMutate();
    } else if (deletedUser) {
      updateMutate();
    }
  }, [addedUser, deletedUser]);

  return (
    <div>
      <AdminDataTable props={tableProps} />
    </div>
  );
};

export default UsersTable;
