import React, { forwardRef } from 'react';
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

const DefaultCustomSelect = forwardRef((props, ref) => {
  const { options, placeholder, onChange, customSelectLabel, ...rest } = props;

  const renderMenu = (menu) => {
    if (options.length === 0) {
      return <FixedLoader />;
    }
    return menu;
  };

  // The data is filtered according to the select picker's needs
  let data = [];
  if (customSelectLabel) {
    data = options?.map((item) => ({
      label: item[customSelectLabel],
      value: JSON.stringify(item),
    }));
  } else {
    data = options?.map((item) => ({
      label: item.name,
      value: item.id,
    }));
  }

  return (
    <SelectPicker
      menuMaxHeight={250}
      size="lg"
      block
      searchable={data?.length > 9 || data?.length === 0 ? true : false}
      ref={ref}
      {...rest}
      data={data}
      onChange={(v) => onChange(v)}
      placeholder={<p style={{ fontSize: '17px' }}>{placeholder}</p>}
      renderMenu={renderMenu}
      renderMenuItem={(label) => {
        return (
          <div className="selectPickerMenu">
            <p style={{ fontSize: '17px' }}>{label}</p>
          </div>
        );
      }}
      renderMenuGroup={(label) => {
        return (
          <div className="selectPickerMenu">
            <p style={{ fontSize: '17px' }}>{label}</p>
          </div>
        );
      }}
    />
  );
});

DefaultCustomSelect.displayName = 'DefaultCustomSelect';

export default DefaultCustomSelect;
