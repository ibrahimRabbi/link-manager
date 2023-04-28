import React from 'react';
import { SelectPicker } from 'rsuite';

const CustomSelect = React.forwardRef((props, ref) => {
  const { options, placeholder, onChange, ...rest } = props;

  const data = options?.map((item) => ({
    label: item.name,
    value: item.id,
  }));

  return (
    <SelectPicker
      block
      ref={ref}
      {...rest}
      data={data}
      onChange={(v) => onChange(v)}
      placeholder={<p style={{ fontSize: '17px' }}>{placeholder}</p>}
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

CustomSelect.displayName = 'CustomSelect';

export default CustomSelect;
