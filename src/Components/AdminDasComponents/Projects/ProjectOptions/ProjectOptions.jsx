import React, { useContext, useEffect, useState } from 'react';
import { ButtonGroup, Whisper, Popover, Dropdown, IconButton } from 'rsuite';
import ArrowDownIcon from '@rsuite/icons/ArrowDown';
import AuthContext from '../../../../Store/Auth-Context.jsx';
// eslint-disable-next-line max-len
import { verifyAdminPermissions } from '../../../../RoleVerification/RoleVerification.jsx';

const ProjectOptions = (props) => {
  const { handleEdit, handleDelete } = props;
  const availableOptions = ['Edit'];
  const adminAvailableOptions = ['Delete'];
  const authCtx = useContext(AuthContext);

  const [isAdmin, setIsAdmin] = useState(false);

  const verifyUserPermissions = () => {
    if (verifyAdminPermissions(authCtx)) {
      setIsAdmin(true);
    }
  };

  const setDropdownItems = (item, index) => {
    let dropdownItem;
    if (item === 'Edit') {
      dropdownItem = (
        <Dropdown.Item key={index} eventKey={index} onClick={handleEdit}>
          {item}
        </Dropdown.Item>
      );
    } else if (item === 'Delete') {
      dropdownItem = (
        <Dropdown.Item key={index} eventKey={index} onClick={handleDelete}>
          {item}
        </Dropdown.Item>
      );
    } else {
      dropdownItem = (
        <Dropdown.Item key={index} eventKey={index}>
          {item}
        </Dropdown.Item>
      );
    }
    return dropdownItem;
  };

  useEffect(() => {
    verifyUserPermissions();
  }, []);

  return (
    <>
      <ButtonGroup>
        <Whisper
          placement="bottomEnd"
          trigger="click"
          speaker={({ left, top, className }, ref) => {
            return (
              <Popover ref={ref} className={className} style={{ left, top }} full>
                <Dropdown.Menu>
                  {availableOptions.map((item, index) => setDropdownItems(item, index))}
                  {/* eslint-disable-next-line max-len */}
                  {isAdmin &&
                    adminAvailableOptions.map((item, index) =>
                      setDropdownItems(item, index),
                    )}
                </Dropdown.Menu>
              </Popover>
            );
          }}
        >
          <IconButton appearance="primary" icon={<ArrowDownIcon />} />
        </Whisper>
      </ButtonGroup>
    </>
  );
};

export default ProjectOptions;
