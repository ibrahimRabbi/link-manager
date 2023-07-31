import React from 'react';
import { useState } from 'react';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import Select, { components } from 'react-select';

const UseReactSelect = (props) => {
  const { name, items, onChange, placeholder, disabled, isLoading } = props;

  const [selectOptions, setSelectOptions] = useState([]);
  const { isDark } = useSelector((state) => state.nav);
  const { SingleValue, Option } = components;

  // map dropdown items
  useEffect(() => {
    const newItems = items?.map((item) => ({
      ...item,
      label: item?.name,
      value: item?.name,
    }));
    setSelectOptions(newItems);
  }, [items]);

  // react select menu items style
  const IconOption = (props) => {
    return (
      <Option {...props}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
          }}
        >
          {props.data?.icon && (
            <img src={props.data?.icon} style={{ height: 20 }} alt={props.data?.label} />
          )}

          <p>{props.data?.label}</p>
        </div>
      </Option>
    );
  };

  // react select main input container style
  const customSingleValue = (props) => {
    return (
      <SingleValue {...props}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
          }}
        >
          {props.data?.icon && (
            <img src={props.data?.icon} style={{ height: 20 }} alt={props.data?.label} />
          )}

          <p style={{ color: isDark === 'dark' ? '#34c3ff' : '#1675e0' }}>
            {props.data?.label}
          </p>
        </div>
      </SingleValue>
    );
  };

  return (
    <Select
      className={isDark === 'dark' ? 'reactSelectContainer' : ''}
      classNamePrefix={isDark === 'dark' ? 'reactSelect' : ''}
      options={selectOptions}
      placeholder={<p>{placeholder}</p>}
      onChange={(v) => {
        onChange(v);
      }}
      captureMenuScroll={true}
      isDisabled={disabled}
      isLoading={isLoading}
      isMulti={false}
      isClearable={true}
      isSearchable={true}
      menuPlacement="auto"
      name={name}
      components={{
        SingleValue: customSingleValue,
        Option: IconOption,
      }}
    />
  );
};

export default UseReactSelect;
