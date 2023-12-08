import React, { useState, useContext } from 'react';
import { Message, toaster } from 'rsuite';
import { useQuery } from '@tanstack/react-query';
import AdminDataTable from '../../../AdminDataTable.jsx';
import AuthContext from '../../../../../Store/Auth-Context.jsx';
import fetchAPIRequest from '../../../../../apiRequests/apiRequest.js';

// demo data
const headerData = [
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
  {
    header: 'Username',
    key: 'username',
  },
];

const UsersTable = () => {
  const [currPage, setCurrPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [notificationType, setNotificationType] = React.useState('');
  const [notificationMessage, setNotificationMessage] = React.useState('');
  const authCtx = useContext(AuthContext);

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
  const { data: allUsers } = useQuery(['user'], () =>
    fetchAPIRequest({
      urlPath: `user?page=${currPage}&per_page=${pageSize}`,
      token: authCtx.token,
      method: 'GET',
      showNotification: showNotification,
    }),
  );
  console.log(allUsers);

  // Pagination
  const handlePagination = (value) => {
    setCurrPage(value);
  };

  const handleChangeLimit = (dataKey) => {
    setCurrPage(1);
    setPageSize(dataKey);
  };

  const handleEnableDisable = (data) => {
    console.log(data);
  };

  // send props in the batch action table
  const tableProps = {
    title: 'Users',
    rowData: allUsers ? allUsers?.items : [],
    headerData,
    handlePagination,
    handleChangeLimit,
    handleEnableDisable,
    totalItems: allUsers?.total_items,
    totalPages: allUsers?.total_pages,
    pageSize,
    page: allUsers?.page,
    inpPlaceholder: 'Search User',
    showAddNewButton: false,
  };

  return (
    <div>
      <AdminDataTable props={tableProps} />
    </div>
  );
};

export default UsersTable;
