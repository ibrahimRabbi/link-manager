import { Dropdown } from '@carbon/react';
import React from 'react';

const UseDropdown = ({ items, className, title, label, id, onChange, selectedValue }) => {
  return (
    <Dropdown
      items={items}
      label={label}
      id={id}
      titleText={title && <p>{title}</p>}
      className={className}
      initialSelectedItem={selectedValue}
      onChange={(e) => onChange(e)}
    />
  );
};

export default UseDropdown;
