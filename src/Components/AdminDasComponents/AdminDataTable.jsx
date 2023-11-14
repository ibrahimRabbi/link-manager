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
  InputGroup,
  Input,
  Whisper,
  Tooltip,
} from 'rsuite';
import { IconButton, ButtonToolbar } from 'rsuite';
import SearchIcon from '@rsuite/icons/Search';
import CloseIcon from '@rsuite/icons/Close';
import { handleRefreshData } from '../../Redux/slices/navSlice';
import { darkBgColor, lightBgColor } from '../../App';
import { MdDelete, MdEdit, MdLock } from 'react-icons/md';
import { BiShowAlt } from 'react-icons/bi';
import { PiEyeBold } from 'react-icons/pi';
import { MdOutlineContentCopy } from 'react-icons/md';
const { Column, HeaderCell, Cell } = Table;

const getSourceTargetIcon = (iconKey) => {
  // Define your icon mappings here
  const iconMappings = {
    jira: '/jira_logo.png',
    gitlab: '/gitlab_logo.png',
    glide: '/glide_logo.png',
    valispace: '/valispace_logo.png',
    codebeamer: '/codebeamer_logo.png',
    dng: '/dng_logo.png',
    bitbucket: '/bitbucket_logo.png',
    default: '/default_logo.png',
  };

  // Get the icon from the mapping or use a default icon if not found
  return iconMappings[iconKey] || '/default_logo.png';
};

const AdminDataTable = ({ props }) => {
  const {
    title,
    rowData,
    headerData,
    handlePagination,
    handleChangeLimit,
    handleAddNew,
    handleCopy,
    handleEdit,
    handleDelete,
    handleViewAccess,
    handleScriptView,
    authorizeModal,
    totalItems,
    pageSize,
  } = props;
  const { isDark, refreshData } = useSelector((state) => state.nav);
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

  const getStatusLabel = (status) => {
    // prettier-ignore
    switch (status) {
    case 1:
      return 'Authenticated';
    case 2:
      return 'Suspect';
    default:
      return 'Not Authenticated';
    }
  };

  // Action cell
  // Action table cell control
  const ActionMenu = ({ rowData }) => {
    const editSelected = () => {
      handleEdit(rowData);
    };
    const viewAccess = () => {
      handleViewAccess(rowData);
    };

    const deleteSelected = () => {
      handleDelete(rowData);
    };

    const authorizeModalSelected = () => {
      authorizeModal(rowData);
    };

    const viewScript = () => {
      handleScriptView(rowData);
    };

    const copySecret = () => {
      handleCopy(rowData);
    };

    return (
      <ButtonToolbar>
        {handleScriptView && (
          <IconButton
            size="sm"
            title="View Script"
            icon={<PiEyeBold />}
            onClick={viewScript}
          />
        )}
        {handleCopy && (
          <IconButton
            size="sm"
            title="Copy Value"
            icon={<MdOutlineContentCopy />}
            onClick={copySecret}
          />
        )}
        {handleEdit && (
          <IconButton size="sm" title="Edit" icon={<MdEdit />} onClick={editSelected} />
        )}
        {handleViewAccess && (
          <IconButton size="sm" title="View" icon={<BiShowAlt />} onClick={viewAccess} />
        )}
        {handleDelete && (
          <IconButton
            size="sm"
            title="Delete"
            icon={<MdDelete />}
            onClick={deleteSelected}
          />
        )}
        {authorizeModal && (
          <IconButton
            size="sm"
            title="Authorize App"
            icon={<MdLock />}
            onClick={authorizeModalSelected}
          />
        )}
      </ButtonToolbar>
    );
  };

  // dynamic cell for the image
  const DynamicCell = ({
    rowData,
    dataKey,
    iconKey,
    statusKey,
    pipelinerunkey,
    buttonKey,
    syncStatus,
    sourceIcon,
    targetIcon,
    syncTime,
    ...props
  }) => {
    const logo = rowData[iconKey] ? rowData[iconKey] : defaultLogo;
    const sourceLogo = sourceIcon && getSourceTargetIcon(rowData[sourceIcon]);
    const targetLogo = targetIcon && getSourceTargetIcon(rowData[targetIcon]);
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
        {sourceIcon && (
          <img
            height={25}
            src={sourceLogo}
            alt=""
            style={{
              backgroundColor: sourceIcon ? '' : 'white',
              borderRadius: sourceIcon ? '' : '50%',
              padding: '1px',
            }}
          />
        )}
        {targetIcon && (
          <img
            height={25}
            src={targetLogo}
            alt=""
            style={{
              backgroundColor: targetIcon ? '' : 'white',
              borderRadius: targetIcon ? '' : '50%',
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
              <Whisper
                placement="top"
                controlId="control-id-click"
                trigger="hover"
                speaker={<Tooltip>{getStatusLabel(rowData[statusKey])}</Tooltip>}
              >
                {rowData[statusKey] === 1 ? (
                  <SuccessStatus color="#378f17" />
                ) : rowData[statusKey] === 0 ? (
                  <FailedStatus color="#de1655" />
                ) : rowData[statusKey] === 2 ? (
                  <InfoStatus color="#25b3f5" />
                ) : (
                  <InfoStatus color="#25b3f5" />
                )}
              </Whisper>
            </h5>
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
        {syncTime && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
            }}
          >
            <p>
              {new Date(rowData[syncTime]).toLocaleString('en-US', {
                hour12: true,
              })}
            </p>
          </div>
        )}

        {syncStatus && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <h5>
              {rowData?.migrated === true ? (
                <SuccessStatus color="#378f17" />
              ) : (
                rowData?.migrated === false && <FailedStatus color="#de1655" />
              )}
            </h5>
          </div>
        )}
        {buttonKey && (
          <div>
            {rowData?.active === false && (
              <Button appearance="primary" size="xs">
                Migrate now
              </Button>
            )}
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
          {handleAddNew && title === 'Synchronization' ? (
            <Button appearance="primary" onClick={() => handleAddNew()} color="blue">
              Create New Sync
            </Button>
          ) : (
            <Button appearance="primary" onClick={() => handleAddNew()} color="blue">
              Add New
            </Button>
          )}
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
              sourceIcon={header?.source_icon}
              targetIcon={header?.target_icon}
              statusKey={header?.statusKey}
              pipelinerunkey={header?.pipelinerunkey}
              buttonKey={header?.buttonKey}
              syncStatus={header?.syncStatus}
              syncTime={header?.syncTime}
            />
          </Column>
        ))}

        {/* -- action --  */}

        <Column width={140} align="left">
          <HeaderCell>
            <h5>Action</h5>
          </HeaderCell>
          <Cell
            style={{
              display: 'flex',
              alignItems: 'center',
            }}
          >
            {(rowData) => <ActionMenu rowData={rowData} />}
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
