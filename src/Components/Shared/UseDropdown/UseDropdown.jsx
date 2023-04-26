import { Dropdown } from '@carbon/react';
import React from 'react';

const UseDropdown = ({
  selectedTrgProject,
  items,
  className,
  title,
  label,
  id,
  onChange,
  selectedValue,
}) => {
  const trpIcon = selectedTrgProject?.icon ? selectedTrgProject?.icon : '';
  const trpAlt = selectedTrgProject?.alt_value ? selectedTrgProject?.alt_value : '';

  console.log(trpIcon, trpAlt);
  return (
    <Dropdown
      items={items}
      label={<p>{label}</p>}
      id={id}
      titleText={title && <h6>{title}</h6>}
      itemToString={(item) =>
        item ? (
          <div style={{ display: 'flex', gap: '5px' }}>
            {item.icon && <img src={item.icon} height={22} alt={item?.alt_value} />}
            <p className="dropdown-text">{item?.name}</p>
          </div>
        ) : (
          ''
        )
      }
      itemToElement={(item) =>
        item ? (
          <div style={{ display: 'flex', gap: '10px' }}>
            {item.icon && <img src={item.icon} height={22} alt={item?.alt_value} />}
            <p className="dropdown-text">{item?.name}</p>
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
