import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { HiRefresh } from 'react-icons/hi';
import defaultLogo from './logo.png';
import SuccessStatus from '@rsuite/icons/CheckRound';
import FailedStatus from '@rsuite/icons/WarningRound';
import InfoStatus from '@rsuite/icons/InfoRound';

import {
  Table,
  Pagination,
  FlexboxGrid,
  Button,
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
    authorizeModal,
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

  // Action cell
  // Action table cell control
  const renderMenu = ({ onClose, left, top, className }, ref) => {
    const handleSelect = (eventKey) => {
      if (eventKey === 1) {
        handleEdit(actionData);
      } else if (eventKey === 2) {
        handleDelete(actionData);
      } else if (eventKey === 3) {
        authorizeModal(actionData);
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

          {authorizeModal && (
            <Dropdown.Item eventKey={3}>
              <p>Authorize App</p>
            </Dropdown.Item>
          )}
        </Dropdown.Menu>
      </Popover>
    );
  };

  // dynamic cell for the image
  const DynamicCell = ({
    rowData,
    dataKey,
    iconKey,
    statusKey,
    pipelinerunkey,
    ...props
  }) => {
    const logo = rowData[iconKey] ? rowData[iconKey] : defaultLogo;
    return (
      <Cell {...props}>
        {/* display logo  */}
        {iconKey && (
          <img
            height={25}
            src={logo}
            alt=""
            style={{
              backgroundColor: rowData[iconKey] ? '' : 'white',
              borderRadius: rowData[iconKey] ? '' : '50%',
              padding: '1px',
            }}
          />
        )}

        {/* display row data  */}
        {dataKey && <p style={{ marginLeft: '5px' }}>{rowData[dataKey]}</p>}

        {/* display status data  */}
        {statusKey && (
          <div
            onClick={() => (authorizeModal ? authorizeModal(rowData) : null)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              cursor: 'pointer',
            }}
          >
            <h5>
              {rowData[statusKey]?.toLowerCase() === 'valid' ? (
                <SuccessStatus color="#378f17" />
              ) : rowData[statusKey]?.toLowerCase() === 'invalid' ? (
                <FailedStatus color="#de1655" />
              ) : rowData[statusKey]?.toLowerCase() === 'suspect' ? (
                <InfoStatus color="#25b3f5" />
              ) : (
                <InfoStatus color="#25b3f5" />
              )}
            </h5>

            <p style={{ marginTop: '2px' }}>{rowData[statusKey]}</p>
          </div>
        )}
        {pipelinerunkey && (
          <div
            onClick={() => (authorizeModal ? authorizeModal(rowData) : null)}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              cursor: 'pointer',
            }}
          >
            <h5>
              {rowData?.status === true ? (
                <SuccessStatus color="#378f17" />
              ) : (
                rowData?.status === false && <FailedStatus color="#de1655" />
              )}
            </h5>

            <p style={{ marginTop: '2px' }}>{rowData[statusKey]}</p>
          </div>
        )}
      </Cell>
    );
  };

  return (
    <div style={{ paddingBottom: '30px' }}>
      <FlexboxGrid
        justify="space-between"
        style={{
          backgroundColor: isDark == 'dark' ? darkBgColor : lightBgColor,
          marginTop: '20px',
          padding: '10px',
        }}
      >
        <FlexboxGrid.Item>
          <Button appearance="primary" onClick={() => handleAddNew()} color="blue">
            Add New
          </Button>
        </FlexboxGrid.Item>

        <FlexboxGrid.Item>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <InputGroup size="lg" inside style={{ width: '400px' }}>
              <Input
                placeholder={'Search...'}
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
        {headerData?.map((header, i) => (
          <Column
            key={i}
            width={header?.width ? header?.width : 70}
            flexGrow={header?.width || header?.header === 'ID' ? 0 : 1}
            fullText
            align="left"
          >
            <HeaderCell>
              <h6>{header?.header}</h6>
            </HeaderCell>
            <DynamicCell
              style={{
                fontSize: '17px',
                display: 'flex',
                alignItems: 'center',
              }}
              dataKey={header?.key}
              iconKey={header?.iconKey}
              statusKey={header?.statusKey}
              pipelinerunkey={header?.pipelinerunkey}
            />
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
        total={totalItems ? totalItems : 0}
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
