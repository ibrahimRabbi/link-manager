import React from 'react';

function IndeterminateCheckbox({ indeterminate, ...rest }) {
  const ref = React.useRef(null);

  React.useEffect(() => {
    if (typeof indeterminate === 'boolean') {
      ref.current.indeterminate = !rest.checked && indeterminate;
    }
  }, [ref, indeterminate]);

  return (
    <input
      type="checkbox"
      style={{ transform: 'scale(1.4)', cursor: 'pointer' }}
      ref={ref}
      {...rest}
    />
  );
}
export const columnDefWithCheckBox = [
  {
    id: 'select',
    header: ({ table }) => (
      <IndeterminateCheckbox
        {...{
          checked: table.getIsAllRowsSelected(),
          indeterminate: table.getIsSomeRowsSelected(),
          onChange: table.getToggleAllRowsSelectedHandler(),
        }}
      />
    ),
    cell: ({ row }) => (
      <IndeterminateCheckbox
        {...{
          checked: row.getIsSelected(),
          disabled: !row.getCanSelect(),
          indeterminate: row.getIsSomeSelected(),
          onChange: row.getToggleSelectedHandler(),
        }}
      />
    ),
  },
  {
    accessorFn: (row) => `${row?.key}`,
    header: 'Key',
  },
  {
    accessorFn: (row) => `${row?.name}`,
    header: 'Name',
  },
  {
    accessorFn: (row) => `${row?.description?.slice(0, 120)}`,
    header: 'Description',
  },
];
