import React, { useEffect, useState } from 'react';
import { ButtonGroup, Whisper, Popover, Dropdown, IconButton } from 'rsuite';
import ArrowDownIcon from '@rsuite/icons/ArrowDown';

const ProjectOptions = (props) => {
  const { handleEdit, handleDelete } = props;
  const availableOptions = ['Edit', 'Delete'];

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
