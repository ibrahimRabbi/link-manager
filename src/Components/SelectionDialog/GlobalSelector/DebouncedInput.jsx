import React from 'react';
import { Input } from 'rsuite';

function DebouncedInput({ value: initialValue, onChange, debounce = 1000, ...props }) {
  const [value, setValue] = React.useState(initialValue);

  React.useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  React.useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(value);
    }, debounce);

    return () => clearTimeout(timeout);
  }, [value]);

  return (
    <Input
      className="filterStyle"
      {...props}
      value={value}
      size="sm"
      onChange={(e) => setValue(e.target.value)}
    />
  );
}

export default DebouncedInput;
