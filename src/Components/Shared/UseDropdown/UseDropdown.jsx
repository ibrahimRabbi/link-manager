import { Dropdown } from '@carbon/react';
import React from 'react';

const UseDropdown = ({ items, style, label, id, onChange, selectedValue}) => {
  return (
    <Dropdown style={style}
      items={items}
      label={label}
      id={id}
      initialSelectedItem={selectedValue}
      onChange={(e) => onChange(e)}
    />
  );
};

export default UseDropdown;