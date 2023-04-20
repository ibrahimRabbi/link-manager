import React from 'react';
import { SelectPicker } from 'rsuite';

const CustomSelect = React.forwardRef((props, ref) => {
  const { options, onChange, ...rest } = props;

  const data = options?.map((item) => ({
    label: item.name,
    value: item.id,
  }));

  return (
    <SelectPicker block ref={ref} {...rest} data={data} onChange={(v) => onChange(v)} />
  );
});

CustomSelect.displayName = 'CustomSelect';

export default CustomSelect;
