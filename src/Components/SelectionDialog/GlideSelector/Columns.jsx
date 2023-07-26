import React from 'react';
import { createColumnHelper } from '@tanstack/react-table';

function IndeterminateCheckbox({ indeterminate, ...rest }) {
  const ref = React.useRef(null);

  React.useEffect(() => {
    if (typeof indeterminate === 'boolean') {
      ref.current.indeterminate = !rest.checked && indeterminate;
    }
  }, [ref, indeterminate]);

  return <input type="checkbox" ref={ref} {...rest} />;
}
const columnHelper = createColumnHelper();
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
  columnHelper.accessor('id', {
    header: 'Id',
  }),
  {
    accessorFn: (row) => `${row?.name}`,
    header: 'Name',
  },
  {
    accessorKey: 'description',
    header: 'Description',
  },
];
