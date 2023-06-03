import React, { useState } from 'react';
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

const UseSelectPicker = ({ items, onChange, placeholder, className }) => {
  const [selectItems, setSelectItems] = useState([]);

  const data = items?.map((item) => ({
    label: item?.name,
    value: item?.name,
    data: item,
  }));

  const updateData = () => {
    if (selectItems.length === 0) {
      setSelectItems(data);
    }
  };

  const renderMenu = (menu) => {
    if (selectItems.length === 0) {
      return <FixedLoader />;
    }
    return menu;
  };

  // handle selected item
  const handleSelect = (value) => {
    const selectedItem = items?.find((v) => v?.name === value);
    onChange(selectedItem);
  };

  return (
    <SelectPicker
      placeholder={<p>{placeholder}</p>}
      data={selectItems}
      searchable={selectItems?.length > 9 || selectItems?.length === 0 ? true : false}
      menuMaxHeight={250}
      size="md"
      block
      onChange={(v) => handleSelect(v)}
      onOpen={updateData}
      onSearch={updateData}
      renderMenu={renderMenu}
      className={`${className} selectPicker`}
      renderMenuItem={(label, item) => {
        return (
          <div className="selectPickerMenu">
            {item?.data?.icon ? (
              <img src={item.data.icon} height={20} alt={item.data.altValue} />
            ) : (
              ''
            )}
            <p style={{ fontSize: '17px' }}>{label}</p>
          </div>
        );
      }}
      renderMenuGroup={(label, item) => {
        return (
          <div className="selectPickerMenu">
            {item?.data?.icon ? (
              <img src={item.data.icon} height={20} alt={item.data.altValue} />
            ) : (
              ''
            )}
            <p>{label}</p>
          </div>
        );
      }}
      renderValue={(value, item) => {
        return (
          <div className="selectPickerMenu">
            {item?.data?.icon ? (
              <img src={item.data.icon} height={20} alt={item.data.altValue} />
            ) : (
              ''
            )}
            <p>{value}</p>
          </div>
        );
      }}
    />
  );
};

export default UseSelectPicker;
