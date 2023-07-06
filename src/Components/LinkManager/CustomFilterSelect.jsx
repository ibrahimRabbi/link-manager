import React from 'react';
import { SelectPicker } from 'rsuite';
import styles from './LinkManager.module.scss';
const { dropdownContent } = styles;

const CustomFilterSelect = ({ items, onChange, placeholder, className }) => {
  const data = items?.map((item) => ({
    label: item?.label,
    value: item?.value,
    data: item,
  }));

  return (
    <SelectPicker
      placeholder={<p>{placeholder}</p>}
      data={data}
      searchable={false}
      menuMaxHeight={250}
      size="md"
      block
      onChange={(v) => onChange(v)}
      className={`${className} selectPicker`}
      renderMenuItem={(label, item) => {
        return (
          <div className={dropdownContent}>
            {item?.data?.icon ? item?.data?.icon : ''}

            {!item?.data?.icon ? <p style={{ fontSize: '17px' }}>{label}</p> : ''}
          </div>
        );
      }}
      renderMenuGroup={(label, item) => {
        return (
          <div className={dropdownContent}>
            {item?.data?.icon ? item?.data?.icon : ''}

            {!item?.data?.icon ? <p style={{ fontSize: '17px' }}>{label}</p> : ''}
          </div>
        );
      }}
      renderValue={(value, item) => {
        return (
          <div className={dropdownContent}>
            {item?.data?.icon ? item?.data?.icon : ''}

            {!item?.data?.icon ? <p style={{ fontSize: '17px' }}>{item?.label}</p> : ''}
          </div>
        );
      }}
    />
  );
};

export default CustomFilterSelect;
