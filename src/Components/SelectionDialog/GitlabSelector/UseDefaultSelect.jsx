import React from 'react';
import { useState } from 'react';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import Select, { components } from 'react-select';

const UseDefaultSelect = (props) => {
  const { name, items, onChange, placeholder, isLoading, disabled, value } = props;
  const [selectedValue, setSelectedValue] = useState(null);
  const [selectOptions, setSelectOptions] = useState([]);
  const { isDark } = useSelector((state) => state.nav);

  // map dropdown items
  useEffect(() => {
    if (items?.length > 0) {
      const newItems = items?.map((item) => ({
        ...item,
        label: item?.name,
        value: item?.name,
      }));
      setSelectOptions(newItems);
    } else {
      setSelectedValue(null);
      setSelectOptions([]);
    }
  }, [items]);

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

  // Determine if defaultValue should be used
  //   const resolvedDefaultValue = value ? { label: value } : null;

  return (
    <Select
      className={isDark === 'dark' ? 'reactSelectContainer' : ''}
      classNamePrefix={isDark === 'dark' ? 'reactSelect' : ''}
      options={selectOptions}
      placeholder={<p>{placeholder}</p>}
      onChange={(v) => {
        setSelectedValue(v);
        onChange(v || null);
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
      value={value ? selectOptions.find((v) => v.label === value) : selectedValue}
    />
  );
};

export default UseDefaultSelect;
