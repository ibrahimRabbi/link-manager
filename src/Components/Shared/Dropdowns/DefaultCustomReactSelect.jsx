import React, { forwardRef } from 'react';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Select, { components } from 'react-select';
import { handleStoreDropdownItems } from '../../../Redux/slices/associationSlice';
import { useState } from 'react';

const DefaultCustomReactSelect = forwardRef((props, ref) => {
  const {
    options,
    placeholder,
    onChange,
    customSelectLabel,
    isLoading,
    disabled,
    value,
    ...rest
  } = props;
  const { isDark } = useSelector((state) => state.nav);
  const [data, setData] = useState([]);
  const dispatch = useDispatch();

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
        item,
      }));
      setData(item1Data);
    } else {
      const itemData = options?.map((item) => ({
        label: item.name,
        value: item.id,
        item,
      }));
      setData(itemData);
    }
  };

  // react select menu items style
  const customOption = (props) => {
    return (
      <components.Option {...props}>
        <div className="react-select-display-icon-container">
          {props.data?.icon && (
            <img src={props.data?.icon} style={{ height: 20 }} alt={props.data?.label} />
          )}

          <p>{props.data?.label}</p>
        </div>
      </components.Option>
    );
  };

  // react select main input container style
  const customSingleValue = (props) => {
    return (
      <components.SingleValue {...props}>
        <div className="react-select-display-icon-container">
          {props.data?.icon && (
            <img src={props.data?.icon} style={{ height: 20 }} alt={props.data?.label} />
          )}

          <p style={{ color: isDark === 'dark' ? '#34c3ff' : '#1675e0' }}>
            {props.data?.label}
          </p>
        </div>
      </components.SingleValue>
    );
  };
  return (
    <Select
      ref={ref}
      {...rest}
      value={data?.find((v) => v?.value === value)}
      className={isDark === 'dark' ? 'reactSelectContainer' : ''}
      classNamePrefix={isDark === 'dark' ? 'reactSelect' : ''}
      options={data}
      placeholder={<p>{placeholder}</p>}
      onChange={(v) => {
        onChange(v?.value || null);
      }}
      isDisabled={disabled}
      isLoading={isLoading}
      isMulti={false}
      isClearable={true}
      isSearchable={true}
      menuPlacement="auto"
      name={name}
      components={{
        SingleValue: customSingleValue,
        Option: customOption,
      }}
    />
  );
});

DefaultCustomReactSelect.displayName = 'DefaultCustomReactSelect';

export default DefaultCustomReactSelect;
