import React from 'react';
import DebouncedInput from './DebouncedInput';

function Filter({ column, table, setFilterIn }) {
  const firstValue = table.getPreFilteredRowModel().flatRows[0]?.getValue(column.id);
  const columnFilterValue = column.getFilterValue();
  return typeof firstValue === 'number' ? null : (
    <>
      <DebouncedInput
        type="text"
        value={columnFilterValue ?? ''}
        onChange={(value) => {
          column.setFilterValue(value);
          setFilterIn(value);
        }}
        placeholder={'Search... '}
        list={column.id + 'list'}
      />
    </>
  );
}

export default Filter;
