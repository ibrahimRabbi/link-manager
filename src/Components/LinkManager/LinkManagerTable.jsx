import React, { useMemo, useState } from 'react';
import { FaChevronRight } from 'react-icons/fa';
import { CgMoreVertical } from 'react-icons/cg';
import SuccessStatus from '@rsuite/icons/CheckRound';
import FailedStatus from '@rsuite/icons/WarningRound';
import InfoStatus from '@rsuite/icons/InfoRound';
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getExpandedRowModel,
  flexRender,
} from '@tanstack/react-table';

import { Dropdown, IconButton, Input, Popover, Whisper } from 'rsuite';
import cssStyles from './LinkManager.module.scss';
import { useSelector } from 'react-redux';
import CustomFilterSelect from './CustomFilterSelect';
// eslint-disable-next-line max-len
import ExternalPreview from '../AdminDasComponents/ExternalAppIntegrations/ExternalPreview/ExternalPreview.jsx';
// eslint-disable-next-line max-len
import { showOslcData } from '../AdminDasComponents/ExternalAppIntegrations/ExternalPreview/ExternalPreviewConfig.jsx';
import { getIcon } from './ResourceTypeIcon.jsx';
// eslint-disable-next-line max-len
import {
  BASIC_AUTH_APPLICATION_TYPES,
  MICROSERVICES_APPLICATION_TYPES,
  OAUTH2_APPLICATION_TYPES,
} from '../../App.jsx';
// eslint-disable-next-line max-len
import ExternalAppModal from '../AdminDasComponents/ExternalAppIntegrations/ExternalAppModal/ExternalAppModal.jsx';
const {
  table_row_dark,
  table_row_light,
  statusCellStyle,
  checkBox,
  uiPreviewStyle,
  toggleExpand,
  emptyExpand,
  statusIcon,
  statusHeader,
  headerCheckBox,
  headerExpand,
  headerCell,
  dataCell,
  actionDataCell,
  tableStyle,
  filterContainer,
  filterInput,
  emptyTableContent,
  iconRotate,
  allIconRotate,
  statusFilterClass,
} = cssStyles;

// OSLC API URLs
const jiraURL = `${import.meta.env.VITE_JIRA_DIALOG_URL}`;
const gitlabURL = `${import.meta.env.VITE_GITLAB_DIALOG_URL}`;
const glideURL = `${import.meta.env.VITE_GLIDE_DIALOG_URL}`;
const valispaceURL = `${import.meta.env.VITE_VALISPACE_DIALOG_URL}`;
const codebeamerURL = `${import.meta.env.VITE_CODEBEAMER_DIALOG_URL}`;

const LinkManagerTable = ({ props }) => {
  const { data, handleDeleteLink, setSelectedRowData } = props;
  const { isDark } = useSelector((state) => state.nav);
  const [showExternalAuthWindow, setShowExternalAuthWindow] = useState(false);
  const [externalAuthData, setExternalAuthData] = useState({});

  // Action table cell control
  const renderMenu = ({ onClose, left, top, className }, ref) => {
    const handleSelect = (key) => {
      if (key === 1) {
        //
      } else if (key === 2) {
        handleDeleteLink();
      }
      onClose();
    };
    return (
      <Popover ref={ref} className={className} style={{ left, top }} full>
        <Dropdown.Menu onSelect={handleSelect} style={{ fontSize: '17px' }}>
          <Dropdown.Item eventKey={1}>Edit</Dropdown.Item>
          <Dropdown.Item eventKey={2}>Delete</Dropdown.Item>
        </Dropdown.Menu>
      </Popover>
    );
  };

  const getExtLoginData = (data) => {
    console.log('External Login Data: ', data);
  };

  const closeExternalAuthWindow = () => {
    setShowExternalAuthWindow(false);
  };

  // target cell
  const targetCell = (row) => {
    const rowData = row?.original;
    // OSLC API URL Receiving conditionally
    const oslcObj = { URL: '' };
    if (
      rowData?.provider?.toLowerCase() === 'jira' ||
      rowData?.provider?.toLowerCase() === 'jira-projects'
    ) {
      oslcObj['URL'] = jiraURL;
    } else if (rowData?.provider?.toLowerCase() === 'gitlab') {
      oslcObj['URL'] = gitlabURL;
    } else if (rowData?.provider?.toLowerCase() === 'glide') {
      oslcObj['URL'] = glideURL;
    } else if (rowData?.provider?.toLowerCase() === 'valispace') {
      oslcObj['URL'] = valispaceURL;
    } else if (rowData?.provider?.toLowerCase() === 'codebeamer') {
      oslcObj['URL'] = codebeamerURL;
    }

    const speaker = (rowData, native = false) => {
      if (rowData && native) {
        return (
          <Popover close={12}>
            <ExternalPreview
              nodeData={rowData}
              showExternalAuth={setShowExternalAuthWindow}
              externalLoginAuthData={setExternalAuthData}
            />
          </Popover>
        );
      } else {
        const updatedRowData = showOslcData(rowData);
        return (
          <Popover>
            <ExternalPreview
              nodeData={updatedRowData}
              externalAuth={setShowExternalAuthWindow}
              authData={setExternalAuthData}
            />
          </Popover>
        );
      }
    };
    return (
      <div className={uiPreviewStyle}>
        <Whisper
          trigger="hover"
          enterable
          placement="auto"
          speaker={rowData?.api ? speaker(rowData, true) : speaker(rowData)}
          delayOpen={550}
          delayClose={550}
        >
          <a
            href={rowData?.api ? rowData?.web_url : rowData?.id}
            target="_blank"
            rel="noopener noreferrer"
          >
            {rowData?.selected_lines
              ? rowData?.name?.length > 15
                ? rowData?.name?.slice(0, 15 - 1) +
                  '...' +
                  ' [' +
                  rowData?.selected_lines +
                  ']'
                : rowData?.name + ' [' + rowData?.selected_lines + ']'
              : rowData?.name?.slice(0, 30) + '....'}
          </a>
        </Whisper>
      </div>
    );
  };
  const resource = (row) => {
    const rowData = row?.original;

    let appIcon = '';
    let resourceType = '';
    if (rowData?.resource_type) {
      appIcon = getIcon(rowData?.api, rowData?.resource_type);
      resourceType = rowData?.resource_type ? rowData.resource_type : '';
    }
    if (rowData?.web_application_resource_type) {
      appIcon = getIcon(rowData?.api, rowData?.web_application_resource_type);
      resourceType = rowData?.web_application_resource_type
        ? rowData.web_application_resource_type
        : '';
    }
    return (
      <div style={{ display: 'flex', alignItems: 'center', marginLeft: '10px' }}>
        <p style={{ marginRight: '5px' }}>{appIcon}</p>
        <div style={{ fontSize: '17px' }}>{resourceType}</div>
      </div>
    );
  };

  // Status cell
  const expandCell = (row, getValue) => {
    return (
      <div
        style={{
          paddingLeft: `${row.depth * 20}px`,
          marginLeft: '10px',
        }}
      >
        <div className={statusCellStyle}>
          <IndeterminateCheckbox
            className={checkBox}
            checked={row.getIsSelected()}
            indeterminate={row.getIsSomeSelected()}
            onChange={row.getToggleSelectedHandler()}
          />
          {row.getCanExpand() ? (
            <h5
              onClick={row.getToggleExpandedHandler()}
              className={`${toggleExpand} ${row.getIsExpanded() ? iconRotate : ''}`}
            >
              <FaChevronRight style={{ marginBottom: '' }} size={17} />
            </h5>
          ) : (
            <h5 className={emptyExpand} />
          )}{' '}
          <p>{getValue()}</p>
        </div>
      </div>
    );
  };

  const statusCell = (info) => {
    const status = info.getValue();
    return (
      <div className={dataCell}>
        <h5 className={statusIcon}>
          {status?.toLowerCase() === 'active' || status === 'valid' ? (
            <SuccessStatus color="#378f17" />
          ) : status?.toLowerCase() === 'invalid' ? (
            <FailedStatus color="#de1655" />
          ) : status?.toLowerCase() === 'suspect' ? (
            <InfoStatus color="#ffcc00" />
          ) : (
            <InfoStatus color="#ffcc00" />
          )}
        </h5>
      </div>
    );
  };

  // Table columns
  const columns = useMemo(
    () => [
      {
        accessorKey: 'link_type',
        header: ({ table }) => {
          const isExpand = table.getIsAllRowsExpanded();
          return (
            <div className={statusHeader}>
              <IndeterminateCheckbox
                className={headerCheckBox}
                checked={table.getIsAllRowsSelected()}
                indeterminate={table.getIsSomeRowsSelected()}
                onChange={table.getToggleAllRowsSelectedHandler()}
              />{' '}
              <h5
                className={`${headerExpand} ${isExpand ? allIconRotate : ''}
                  `}
                onClick={table.getToggleAllRowsExpandedHandler()}
              >
                <FaChevronRight size={17} />
              </h5>
              <h6>Link Type</h6>
            </div>
          );
        },
        cell: ({ row, getValue }) => expandCell(row, getValue),
        footer: (props) => props.column.id,
      },
      {
        accessorKey: 'resource_type',
        header: () => (
          <div className={headerCell}>
            <h6>Resource Type</h6>
          </div>
        ),
        cell: ({ row }) => resource(row),
        footer: (props) => props.column.id,
      },
      // Link type cell
      {
        accessorKey: 'name',
        header: () => (
          <div className={headerCell}>
            <h6>Target</h6>
          </div>
        ),
        cell: ({ row }) => targetCell(row),
        footer: (props) => props.column.id,
      },
      // status cell
      {
        accessorKey: 'status',
        header: () => (
          <div className={headerCell}>
            <h6>Status</h6>
          </div>
        ),
        cell: (info) => statusCell(info),
        footer: (props) => props.column.id,
      },
      // Action cell
      {
        accessorKey: 'id',
        header: () => (
          <div className={headerCell}>
            <h6>Actions</h6>
          </div>
        ),
        cell: ({ row }) => {
          const rowData = row?.original;
          return (
            <div className={actionDataCell}>
              <Whisper placement="auto" trigger="click" speaker={renderMenu}>
                <IconButton
                  appearance="subtle"
                  icon={<CgMoreVertical />}
                  onClick={() => setSelectedRowData(rowData)}
                />
              </Whisper>
            </div>
          );
        },
        footer: (props) => props.column.id,
      },
    ],
    [],
  );

  const [expanded, setExpanded] = useState({});

  const table = useReactTable({
    data,
    columns,
    state: {
      expanded,
    },
    onExpandedChange: setExpanded,
    getSubRows: (row) => (row.children ? row?.children[0] : []),
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
  });

  return (
    <div>
      <table className={tableStyle}>
        <thead
          style={{
            position: 'sticky',
            zIndex: '10',
            top: '0',
            background: isDark === 'dark' ? '#0f131a' : 'white',
          }}
        >
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                const action = header.id.includes('id');
                const status = header.id.includes('status');
                return (
                  <th
                    key={header.id}
                    colSpan={header.colSpan}
                    style={{
                      width: status ? '100px' : action ? '100px' : '',
                    }}
                  >
                    {header.isPlaceholder ? null : (
                      <div style={{ fontWeight: 'normal' }}>
                        {flexRender(header.column.columnDef.header, header.getContext())}

                        {header.column.getCanFilter() ? (
                          <div className={filterContainer}>
                            {data[0] && (
                              <Filter
                                column={header.column}
                                table={table}
                                isAction={header.index === 4 ? true : false}
                                isStatusFilter={header.index === 3 ? true : false}
                              />
                            )}
                          </div>
                        ) : null}
                      </div>
                    )}
                  </th>
                );
              })}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr
              key={row.id}
              className={isDark === 'dark' ? table_row_dark : table_row_light}
            >
              {row.getVisibleCells().map((cell) => {
                const status = cell.id?.includes('status');
                const action = cell.id?.includes('id');
                return (
                  <td
                    key={cell.id}
                    style={{
                      width: status ? '100px' : action ? '100px' : '',
                    }}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
      <div />

      {!table.getRowModel().rows[0] && <p className={emptyTableContent}>No Data Found</p>}
      {showExternalAuthWindow && (
        <ExternalAppModal
          formValue={{
            ...externalAuthData,
            type: externalAuthData?.api,
            rdf_type: externalAuthData?.type,
          }}
          isOauth2={OAUTH2_APPLICATION_TYPES?.includes(externalAuthData?.api)}
          isBasic={(
            BASIC_AUTH_APPLICATION_TYPES + MICROSERVICES_APPLICATION_TYPES
          ).includes(externalAuthData?.api)}
          onDataStatus={getExtLoginData}
          integrated={true}
          openedModal={showExternalAuthWindow}
          closeModal={closeExternalAuthWindow}
        />
      )}
    </div>
  );
};

function Filter({ column, table, isAction, isStatusFilter }) {
  const firstValue = table.getPreFilteredRowModel().flatRows[0]?.getValue(column.id);
  const columnFilterValue = column.getFilterValue();

  const statusFilterItems = [
    {
      icon: <SuccessStatus color="#378f17" />,
      label: 'Valid',
      value: 'valid',
    },
    {
      icon: <FailedStatus color="#de1655" />,
      label: 'Invalid',
      value: 'invalid',
    },
    {
      icon: <InfoStatus color="#ffcc00" />,
      label: 'Suspect',
      value: 'suspect',
    },
  ];

  return typeof firstValue === 'number' ? null : (
    <>
      {!isStatusFilter && (
        <Input
          type="text"
          value={columnFilterValue ?? ''}
          onChange={(value) => column.setFilterValue(value)}
          placeholder={'Search...'}
          size="sm"
          style={{ visibility: isAction ? 'hidden' : 'visible' }}
          className={filterInput}
        />
      )}

      {isStatusFilter && (
        <CustomFilterSelect
          className={statusFilterClass}
          items={statusFilterItems}
          placeholder="Search by status"
          onChange={(value) => {
            if (value) column.setFilterValue(value);
            else {
              column.setFilterValue('');
            }
          }}
        />
      )}
    </>
  );
}

function IndeterminateCheckbox({ indeterminate, className = '', ...rest }) {
  const ref = React.useRef(null);

  React.useEffect(() => {
    if (typeof indeterminate === 'boolean') {
      ref.current.indeterminate = !rest.checked && indeterminate;
    }
  }, [ref, indeterminate]);

  return (
    <input
      type="checkbox"
      ref={ref}
      className={className + ' cursor-pointer'}
      {...rest}
    />
  );
}

export default LinkManagerTable;
