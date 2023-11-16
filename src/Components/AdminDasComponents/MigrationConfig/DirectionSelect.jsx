import React from 'react';
import { useState } from 'react';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import Select, { components } from 'react-select';

const DirectionSelect = (props) => {
  const { name, items, onChange, value, placeholder, isLoading, disabled, isMulti } =
    props;

  const [selectOptions, setSelectOptions] = useState([]);
  const [selectedValue, setSelectedValue] = useState(null);
  const { isDark } = useSelector((state) => state.nav);

  // map dropdown items
  useEffect(() => {
    if (items?.length > 0) {
      const newItems = items?.map((item) => ({
        ...item,
        label: item?.name,
        value: item?.value,
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
      isMulti={isMulti}
      isClearable={true}
      isSearchable={true}
      menuPlacement="bottom"
      name={name}
      components={{
        SingleValue: customSingleValue,
        Option: customOption,
      }}
      value={
        // eslint-disable-next-line max-len
        value
          ? isMulti
            ? value
            : selectOptions?.find((v) => v?.value === value)
          : selectedValue
      }
    />
  );
};

export default DirectionSelect;
