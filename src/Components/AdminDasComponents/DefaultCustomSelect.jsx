import React, { forwardRef, useEffect, useState } from 'react';
import { SelectPicker } from 'rsuite';
import SpinnerIcon from '@rsuite/icons/legacy/Spinner';
import { useDispatch } from 'react-redux';
import { handleStoreDropdownItems } from '../../Redux/slices/associationSlice';

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
  const [data, setData] = useState([]);
  const dispatch = useDispatch();
  const renderMenu = (menu) => {
    if (options.length === 0) {
      return <FixedLoader />;
    }
    return menu;
  };

  // The data is filtered according to the select picker's needs
  useEffect(() => {
    getData();
  }, [options]);

  const getData = () => {
    if (customSelectLabel) {
      dispatch(handleStoreDropdownItems({ label: customSelectLabel, data: options }));
      const item1Data = options?.map((item) => ({
        label: item[customSelectLabel],
        value: item?.serviceProviderId,
      }));
      setData(item1Data);
    } else {
      const itemData = options?.map((item) => ({
        label: item.name,
        value: item.id,
      }));
      setData(itemData);
    }
  };

  return (
    <SelectPicker
      menuMaxHeight={250}
      size="lg"
      block
      searchable={data?.length > 9 || data?.length === 0 ? true : false}
      ref={ref}
      {...rest}
      data={data}
      onSelect={(v) => onChange(v)}
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
