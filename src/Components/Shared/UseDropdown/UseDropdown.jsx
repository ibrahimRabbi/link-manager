import { Dropdown } from '@carbon/react';
import React from 'react';

const UseDropdown = ({ items, className, title, label, id, onChange, selectedValue }) => {
  return (
    <Dropdown
      items={items}
      label={<p>{label}</p>}
      id={id}
      titleText={title && <h6>{title}</h6>}
      itemToString={(item) => (item ? <p className="dropdown-text">{item.text}</p> : '')}
      itemToElement={(item) =>
        item ? (
          <div style={{ display: 'flex', gap: '10px' }}>
            {item.icon && <img src={item.icon} height={22} alt="Gitlab" />}
            <p className="dropdown-text">{item.text}</p>
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
