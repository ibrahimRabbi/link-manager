import { Button, Divider, FlexboxGrid } from 'rsuite';
import UsersTable from './UsersTable/UsersTable.jsx';
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styles from './UserPermissions.module.scss';
const UserPermissions = (props) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { descriptionSection, summarySectionEdit } = styles;
  const { identifier } = props;
  return (
    <div>
      <FlexboxGrid>
        <FlexboxGrid.Item colspan={15}>
          <h2>Project permissions</h2>
        </FlexboxGrid.Item>
        <FlexboxGrid.Item colspan={24}>
          <Divider style={{ margin: '5px 0' }} />
        </FlexboxGrid.Item>
        <FlexboxGrid.Item colspan={12} className={descriptionSection}>
          <p>
            Project permissions allow you to extend the access to other TraceLynx users.
          </p>
        </FlexboxGrid.Item>
        <FlexboxGrid.Item colspan={23}>
          <UsersTable identifier={identifier} />
        </FlexboxGrid.Item>

        <FlexboxGrid.Item colspan={24} className={summarySectionEdit}></FlexboxGrid.Item>
        <FlexboxGrid.Item colspan={21}></FlexboxGrid.Item>
        <FlexboxGrid.Item colspan={3}>
          <Button
            appearance="primary"
            onClick={() => {
              const link = location.pathname.replace('/user-permissions', '');
              navigate(link);
            }}
          >
            Back
          </Button>
        </FlexboxGrid.Item>
      </FlexboxGrid>
    </div>
  );
};

export default UserPermissions;
