import { FlexboxGrid } from 'rsuite';
import UsersTable from './UsersTable/UsersTable.jsx';
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const UserPermissions = () => {
  const location = useLocation();
  const navigate = useNavigate();
  return (
    <div>
      <h1>Project permissions</h1>
      <p>Project permissions allow you to extend the access to other TraceLynx users.</p>
      <FlexboxGrid>
        <FlexboxGrid.Item colspan={23}>
          <UsersTable />
        </FlexboxGrid.Item>
        <FlexboxGrid.Item colspan={23}>
          <button
            onClick={() => {
              const link = location.pathname.replace('/user-permissions', '');
              navigate(link);
            }}
          >
            Back
          </button>
        </FlexboxGrid.Item>
      </FlexboxGrid>
    </div>
  );
};

export default UserPermissions;
