import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import {
  Table,
  Checkbox,
  Pagination,
  FlexboxGrid,
  Button,
  Stack,
  Divider,
  // InputGroup, Input
} from 'rsuite';
// import SearchIcon from '@rsuite/icons/Search';
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
  const { isDark } = useSelector((state) => state.nav);
  const {
    rowData,
    headerData,
    handlePagination,
    handleChangeLimit,
    handleAddNew,
    handleDelete,
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

  const [selectedData, setSelectedData] = useState([]);
  useEffect(() => {
    const selectedRows = checkedKeys?.reduce((acc, curr) => {
      if (curr) {
        const selected = rowData?.find((v) => v.id == curr);
        acc.push(selected);
      }
      return acc;
    }, []);
    setSelectedData(selectedRows);
  }, [checkedKeys]);

  // // filter table
  // const [tableFilterValue, setTableFilterValue]=useState('');
  // const handleFilterTableData=(v)=>{
  //   setTableFilterValue(v);
  // };

  return (
    <div>
      <FlexboxGrid
        justify="space-between"
        style={{
          backgroundColor: isDark == 'dark' ? '#1a1d24' : 'white',
          marginTop: '20px',
          padding: '10px 10px 20px',
        }}
      >
        <FlexboxGrid.Item>
          {checkedKeys.length > 0 ? (
            <Stack divider={<Divider vertical />}>
              <Button
                onClick={() => handleDelete(selectedData)}
                appearance="primary"
                color="blue"
              >
                Delete
              </Button>
              <Button appearance="subtle" onClick={() => setCheckedKeys([])}>
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
        </FlexboxGrid.Item>

        <FlexboxGrid.Item>
          {/* <InputGroup size='lg' inside style={{}}>
            <Input placeholder={'Search Table Item'} 
              value={tableFilterValue}
              onChange={handleFilterTableData}
            />
            <InputGroup.Button>
              <SearchIcon />
            </InputGroup.Button>
          </InputGroup> */}
        </FlexboxGrid.Item>
      </FlexboxGrid>

      <Table autoHeight bordered headerHeight={50} data={rowData} id="admin-table">
        <Column width={50} align="center">
          <HeaderCell style={{ padding: 0 }}>
            <div style={{ lineHeight: '48px' }}>
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
          <Column key={i} width={70} flexGrow={header?.header === 'ID' ? 0 : 1} fullText>
            <HeaderCell>
              <h5>{header?.header}</h5>
            </HeaderCell>
            <Cell style={{ fontSize: '17px' }} dataKey={header?.key}></Cell>
          </Column>
        ))}
      </Table>

      <Pagination
        style={{ backgroundColor: isDark == 'dark' ? '#1a1d24' : 'white' }}
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
