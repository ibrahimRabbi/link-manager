import React from 'react';
import { Dropdown } from '@carbon/react';

const UseDropdown = ({ items, style, label, id, onChange }) => {
    return (
        <Dropdown style={style}
            items={items}
            label={items?.length === 1 ? items[0] : label}
            id={id}
            onChange={(e) => onChange(e)}
        />
    );
};

export default UseDropdown;