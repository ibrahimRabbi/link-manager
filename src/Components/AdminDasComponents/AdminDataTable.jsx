import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { HiRefresh } from 'react-icons/hi';
import {
  Table,
  Pagination,
  FlexboxGrid,
  Button,
  // Checkbox,
  // Stack,
  // Divider,
  Whisper,
  IconButton,
  Dropdown,
  Popover,
  InputGroup,
  Input,
} from 'rsuite';
import SearchIcon from '@rsuite/icons/Search';
import CloseIcon from '@rsuite/icons/Close';
import MoreIcon from '@rsuite/icons/legacy/More';
import { handleRefreshData } from '../../Redux/slices/navSlice';
import { darkBgColor, lightBgColor } from '../../App';

const { Column, HeaderCell, Cell } = Table;

const AdminDataTable = ({ props }) => {
  const {
    rowData,
    headerData,
    handlePagination,
    handleChangeLimit,
    handleAddNew,
    handleEdit,
    handleDelete,
    totalItems,
    pageSize,
  } = props;
  const { isDark, refreshData } = useSelector((state) => state.nav);
  const [actionData, setActionData] = useState({});
  const [tableFilterValue, setTableFilterValue] = useState('');
  const [displayTableData, setDisplayTableData] = useState([]);
  const [page, setPage] = useState(1);
  const dispatch = useDispatch();

  useEffect(() => {
    handlePagination(page);
  }, [page]);

  // filter table
  useEffect(() => {
    if (tableFilterValue) {
      const filteredData = rowData?.filter((row) => {
        return Object.values(row)
          ?.toString()
          ?.toLowerCase()
          .includes(tableFilterValue?.toLowerCase());
      });
      setDisplayTableData(filteredData);
    }
  }, [tableFilterValue]);

  // // handle check oll rows
  // const CheckCell = ({ rowData, onChange, checkedKeys, dataKey, ...props }) => (
  //   <Cell {...props} style={{ padding: 0 }}>
  //     <div style={{ lineHeight: '46px' }}>
  //       <Checkbox
  //         value={rowData[dataKey]}
  //         inline
  //         onChange={onChange}
  //         checked={checkedKeys.some((item) => item === rowData[dataKey])}
  //       />
  //     </div>
  //   </Cell>
  // );

  // // handle check rows
  // const [checkedKeys, setCheckedKeys] = useState([]);
  // let checked = false;
  // let indeterminate = false;

  // if (checkedKeys.length === rowData.length) {
  //   checked = true;
  // } else if (checkedKeys.length === 0) {
  //   checked = false;
  // } else if (checkedKeys.length > 0 && checkedKeys.length < rowData.length) {
  //   indeterminate = true;
  // }

  // const handleCheckAll = (value, checked) => {
  //   const keys = checked ? rowData?.map((item) => item.id) : [];
  //   setCheckedKeys(keys);
  // };
  // const handleCheck = (value, checked) => {
  //   const keys = checked
  //     ? [...checkedKeys, value]
  //     : checkedKeys.filter((item) => item !== value);
  //   setCheckedKeys(keys);
  // };

  // const [selectedData, setSelectedData] = useState([]);
  // useEffect(() => {
  //   const selectedRows = checkedKeys?.reduce((acc, curr) => {
  //     if (curr) {
  //       const selected = rowData?.find((v) => v.id == curr);
  //       acc.push(selected);
  //     }
  //     return acc;
  //   }, []);
  //   console.log(selectedRows);
  //   setSelectedData(selectedRows);
  // }, [checkedKeys]);

  // Action cell
  // Action table cell control
  const renderMenu = ({ onClose, left, top, className }, ref) => {
    const handleSelect = (eventKey) => {
      if (eventKey === 1) {
        handleEdit(actionData);
      } else if (eventKey === 2) {
        handleDelete(actionData);
      }
      onClose();
      setActionData({});
    };

    return (
      <Popover ref={ref} className={className} style={{ left, top }} full>
        <Dropdown.Menu onSelect={handleSelect}>
          <Dropdown.Item eventKey={1}>
            <p>Edit</p>
          </Dropdown.Item>

          <Dropdown.Item eventKey={2}>
            <p>Delete</p>
          </Dropdown.Item>
        </Dropdown.Menu>
      </Popover>
    );
  };

  return (
    <div>
      <FlexboxGrid
        justify="space-between"
        style={{
          backgroundColor: isDark == 'dark' ? darkBgColor : lightBgColor,
          marginTop: '20px',
          padding: '10px',
        }}
      >
        <FlexboxGrid.Item>
          {/* {checkedKeys.length > 0 ? (
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
            <> */}
          <Button appearance="primary" onClick={() => handleAddNew()} color="blue">
            Add New
          </Button>
          {/* </>
          )} */}
        </FlexboxGrid.Item>

        <FlexboxGrid.Item>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <InputGroup size="lg" inside style={{ width: '400px' }}>
              <Input
                placeholder={'Search Table Item'}
                value={tableFilterValue}
                onChange={(v) => setTableFilterValue(v)}
              />
              {tableFilterValue ? (
                <InputGroup.Button onClick={() => setTableFilterValue('')}>
                  <CloseIcon />
                </InputGroup.Button>
              ) : (
                <InputGroup.Button>
                  <SearchIcon />
                </InputGroup.Button>
              )}
            </InputGroup>

            <Button
              appearance="default"
              onClick={() => dispatch(handleRefreshData(!refreshData))}
              color="blue"
            >
              <HiRefresh size={25} />
            </Button>
          </div>
        </FlexboxGrid.Item>
      </FlexboxGrid>

      <Table
        autoHeight
        bordered
        headerHeight={50}
        data={tableFilterValue === '' ? rowData : displayTableData}
        id="admin-table"
      >
        {/* --- check rows cell --- */}

        {/* <Column width={50} align="center">
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
        </Column> */}

        {headerData?.map((header, i) => (
          <Column key={i} width={70} flexGrow={header?.header === 'ID' ? 0 : 1} fullText>
            <HeaderCell>
              <h5>{header?.header}</h5>
            </HeaderCell>
            <Cell style={{ fontSize: '17px' }} dataKey={header?.key}></Cell>
          </Column>
        ))}

        {/* -- action --  */}

        <Column width={100} align="center">
          <HeaderCell>
            <h5>Action</h5>
          </HeaderCell>
          <Cell className="link-group">
            {(rowData) => (
              <Whisper placement="auto" trigger="click" speaker={renderMenu}>
                <IconButton
                  appearance="subtle"
                  icon={<MoreIcon />}
                  onClick={() => setActionData(rowData)}
                />
              </Whisper>
            )}
          </Cell>
        </Column>
      </Table>

      <Pagination
        style={{ backgroundColor: isDark == 'dark' ? darkBgColor : lightBgColor }}
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