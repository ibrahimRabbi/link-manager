import React, { useEffect, useState } from 'react';
import { Table, Checkbox, Pagination, FlexboxGrid, Button, Stack, Divider } from 'rsuite';
const { Column, HeaderCell, Cell } = Table;

const CheckCell = ({ rowData, onChange, checkedKeys, dataKey, ...props }) => (
  <Cell {...props} style={{ padding: 0 }}>
    <div style={{ lineHeight: '46px' }}>
      <Checkbox
        value={rowData[dataKey]}
        inline
        onChange={onChange}
        checked={checkedKeys.some((item) => item === rowData[dataKey])}
      />
    </div>
  </Cell>
);

const AdminDataTable = ({ props }) => {
  const {
    rowData,
    headerData,
    handlePagination,
    handleChangeLimit,
    handleAddNew,
    totalItems,
    pageSize,
  } = props;

  const [page, setPage] = useState(1);

  useEffect(() => {
    handlePagination(page);
  }, [page]);

  const [checkedKeys, setCheckedKeys] = useState([]);
  let checked = false;
  let indeterminate = false;

  if (checkedKeys.length === rowData.length) {
    checked = true;
  } else if (checkedKeys.length === 0) {
    checked = false;
  } else if (checkedKeys.length > 0 && checkedKeys.length < rowData.length) {
    indeterminate = true;
  }

  const handleCheckAll = (value, checked) => {
    const keys = checked ? rowData?.map((item) => item.id) : [];
    setCheckedKeys(keys);
  };
  const handleCheck = (value, checked) => {
    const keys = checked
      ? [...checkedKeys, value]
      : checkedKeys.filter((item) => item !== value);
    setCheckedKeys(keys);
  };

  useEffect(() => {
    const selectedData = checkedKeys?.reduce((acc, curr) => {
      if (curr) {
        const selected = rowData?.find((v) => v.id == curr);
        acc.push(selected);
      }
      return acc;
    }, []);

    console.log('selected ', selectedData);
  }, [checkedKeys]);

  return (
    <div style={{ marginTop: '20px', padding: '5px 0' }}>
      <FlexboxGrid justify="end">
        {checkedKeys.length > 0 ? (
          <Stack divider={<Divider vertical />}>
            <Button appearance="primary" color="blue">
              Edit
            </Button>
            <Button appearance="primary" color="blue">
              Delete
            </Button>
            <Button appearance="default" color="blue">
              Cancel
            </Button>
          </Stack>
        ) : (
          <>
            <Button appearance="primary" onClick={() => handleAddNew()} color="blue">
              Add New
            </Button>
          </>
        )}
      </FlexboxGrid>

      <Table autoHeight bordered headerHeight={50} data={rowData} id="admin-table">
        <Column width={50} align="center">
          <HeaderCell style={{ padding: 0 }}>
            <div style={{ lineHeight: '40px' }}>
              <Checkbox
                inline
                checked={checked}
                indeterminate={indeterminate}
                onChange={handleCheckAll}
              />
            </div>
          </HeaderCell>
          <CheckCell dataKey="id" checkedKeys={checkedKeys} onChange={handleCheck} />
        </Column>

        {headerData?.map((header, i) => (
          <Column key={i} width={header?.width || 150} fullText>
            <HeaderCell>{header?.header}</HeaderCell>
            <Cell dataKey={header?.key}></Cell>
          </Column>
        ))}
      </Table>

      <Pagination
        prev
        next
        first
        last
        ellipsis
        boundaryLinks
        maxButtons={2}
        size="lg"
        layout={['-', 'total', '|', 'limit', 'pager']}
        total={totalItems}
        limitOptions={[5, 10, 25, 50, 100]}
        limit={pageSize}
        activePage={page}
        onChangePage={setPage}
        onChangeLimit={(v) => handleChangeLimit(v)}
      />
    </div>
  );
};

export default AdminDataTable;
