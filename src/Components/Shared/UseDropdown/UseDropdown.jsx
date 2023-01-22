import { Dropdown } from '@carbon/react';
import React from 'react';

const UseDropdown = ({ items, className, title, label, id, onChange, selectedValue }) => {
  return (
    <Dropdown
      items={items}
      label={<p>{label}</p>}
      id={id}
      titleText={title && <h6>{title}</h6>}
      itemToString={(item)=> item ? <p>{item.text}</p>: ''}
      itemToElement={(item) =>
        item ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            { item.icon && <span style={{ paddingTop: '3px' }}>{item.icon}</span>}
            <p>{item.text}</p>
          </div>
        ) : (
          ''
        )
      }
      className={className}
      initialSelectedItem={selectedValue}
      onChange={(e) => onChange(e)}
    />
  );
};

export default UseDropdown;
