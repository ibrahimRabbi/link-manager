import { Dropdown } from '@carbon/react';
import React from 'react';

const UseDropdown = ({ items, className, label, id, onChange, selectedValue}) => {
  return (
    <Dropdown className={className}
      items={items}
      label={label}
      id={id}
      initialSelectedItem={selectedValue}
      onChange={(e) => onChange(e)}
    />
  );
};

export default UseDropdown;