import React, { useState, useEffect } from 'react';
import { SelectPicker } from 'rsuite';
import SpinnerIcon from '@rsuite/icons/legacy/Spinner';

const FixedLoader = () => (
  <h5
    style={{
      display: 'flex',
      justifyContent: 'center',
      position: 'absolute',
      bottom: '0',
      background: '#fff',
      width: '100%',
      padding: '4px 0',
    }}
  >
    <SpinnerIcon spin style={{ fontSize: '35px' }} />
  </h5>
);

const UseSelectPicker = ({ items, onChange, placeholder, className, disabled }) => {
  const [selectItems, setSelectItems] = useState([]);
  const [selectedValue, setSelectedValue] = useState(null);

  useEffect(() => {
    if (items.length > 0) {
      setSelectItems(
        items.map((item) => ({ label: item.name, value: item.name, data: item })),
      );
    } else {
      setSelectItems([]);
      setSelectedValue(null); // Reset the selected value
    }
  }, [items]);

  const handleSelect = (value) => {
    const selectedItem = items.find((v) => v.name === value);
    onChange(selectedItem);
  };

  const renderMenu = (menu) => {
    if (selectItems.length === 0) {
      return <FixedLoader />;
    }
    return menu;
  };

  const renderValue = (value, item) => {
    if (value) {
      return (
        <div className="selectPickerMenu">
          {item?.data?.icon ? (
            <img src={item.data.icon} height={20} alt={item.data.altValue} />
          ) : null}
          <p style={{ margin: 0 }}>{value}</p>
        </div>
      );
    }
    return <p style={{ margin: 0, color: '#999' }}>{placeholder}</p>;
  };

  return (
    <SelectPicker
      placeholder={<p>{placeholder}</p>}
      data={selectItems}
      searchable={selectItems.length > 9 || selectItems.length === 0}
      menuMaxHeight={250}
      size="md"
      block
      value={selectedValue}
      disabled={disabled}
      onChange={(v) => {
        setSelectedValue(v);
        handleSelect(v);
      }}
      renderMenu={renderMenu}
      className={`${className} selectPicker`}
      renderMenuItem={(label, item) => (
        <div className="selectPickerMenu">
          {item?.data?.icon ? (
            <img src={item.data.icon} height={20} alt={item.data.altValue} />
          ) : null}
          <p style={{ fontSize: '17px', margin: 0 }}>{label}</p>
        </div>
      )}
      renderMenuGroup={(label, item) => (
        <div className="selectPickerMenu">
          {item?.data?.icon ? (
            <img src={item.data.icon} height={20} alt={item.data.altValue} />
          ) : null}
          <p style={{ margin: 0 }}>{label}</p>
        </div>
      )}
      renderValue={renderValue}
    />
  );
};

export default UseSelectPicker;
