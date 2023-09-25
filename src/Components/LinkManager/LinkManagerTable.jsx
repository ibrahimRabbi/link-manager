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
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faSquareCheck,
  faListCheck,
  faFileCircleCheck,
  faBug,
  faArrowUp,
  faPlus,
  faRocket,
  faFileLines,
  faCodeCompare,
  faVials,
  faFlask,
  faVialVirus,
  faVialCircleCheck,
  faCube,
  faCode,
} from '@fortawesome/free-solid-svg-icons';
import { Dropdown, IconButton, Input, Popover, Whisper } from 'rsuite';
import cssStyles from './LinkManager.module.scss';
import { useSelector } from 'react-redux';
import CustomFilterSelect from './CustomFilterSelect';
// eslint-disable-next-line max-len
import ExternalPreview from '../AdminDasComponents/ExternalAppIntegrations/ExternalPreview/ExternalPreview.jsx';
// eslint-disable-next-line max-len
import { showOslcData } from '../AdminDasComponents/ExternalAppIntegrations/ExternalPreview/ExternalPreviewConfig.jsx';
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

const gitlabIcon = {
  Source_code: (
    <FontAwesomeIcon icon={faFileLines} style={{ color: '#fc722e', fontSize: '20px' }} />
  ),
  Block_code: (
    <FontAwesomeIcon icon={faCode} style={{ color: '#fc7238', fontSize: '20px' }} />
  ),
};
const jiraIcon = {
  Task: (
    <FontAwesomeIcon
      icon={faSquareCheck}
      style={{ color: '#2185ff', fontSize: '20px' }}
    />
  ),
  subT: (
    <FontAwesomeIcon
      icon={faSquareCheck}
      style={{ color: '#2185ff', fontSize: '20px' }}
    />
  ),
  Epic: (
    <FontAwesomeIcon icon={faListCheck} style={{ color: '#2185ff', fontSize: '20px' }} />
  ),
  UserStory: (
    <FontAwesomeIcon
      icon={faFileCircleCheck}
      style={{ color: '#2185ff', fontSize: '20px' }}
    />
  ),
  Issues: <FontAwesomeIcon icon={faBug} style={{ color: '#e5493a', fontSize: '20px' }} />,
  Improvement: (
    <FontAwesomeIcon icon={faArrowUp} style={{ color: '#2185ff', fontSize: '20px' }} />
  ),
  New_feature: (
    <FontAwesomeIcon icon={faPlus} style={{ color: '#2185ff', fontSize: '20px' }} />
  ),
};
const codebeamerIcon = {
  Releases: (
    <FontAwesomeIcon icon={faRocket} style={{ color: '#20a99d', fontSize: '20px' }} />
  ),
  Documents: (
    <FontAwesomeIcon icon={faFileLines} style={{ color: '#20a99c', fontSize: '20px' }} />
  ),
  requirement_specification: (
    <FontAwesomeIcon
      icon={faFileCircleCheck}
      style={{ color: '#20a99c', fontSize: '20px' }}
    />
  ),
  Hardware_tasks: (
    <FontAwesomeIcon
      icon={faSquareCheck}
      style={{ color: '#20a99d', fontSize: '20px' }}
    />
  ),
  Software_tasks: (
    <FontAwesomeIcon
      icon={faSquareCheck}
      style={{ color: '#20a99d', fontSize: '20px' }}
    />
  ),
  Change_requests: (
    <FontAwesomeIcon
      icon={faCodeCompare}
      style={{ color: '#20a99d', fontSize: '20px' }}
    />
  ),
  Risks: <FontAwesomeIcon icon={faBug} style={{ color: '#e5493a', fontSize: '20px' }} />,
  Test_cases: (
    <FontAwesomeIcon icon={faVials} style={{ color: '#20a99e', fontSize: '20px' }} />
  ),
  Test_sets: (
    <FontAwesomeIcon icon={faFlask} style={{ color: '#20a99d', fontSize: '20px' }} />
  ),
  Test_configuration: (
    <FontAwesomeIcon icon={faVialVirus} style={{ color: '#20a99d', fontSize: '20px' }} />
  ),
  Bugs: <FontAwesomeIcon icon={faBug} style={{ color: '#e5493a', fontSize: '20px' }} />,
  Epics: (
    <FontAwesomeIcon icon={faListCheck} style={{ color: '#20a99c', fontSize: '20px' }} />
  ),
  Test_Configurations: (
    <FontAwesomeIcon icon={faVialVirus} style={{ color: '#20a99d', fontSize: '20px' }} />
  ),
  Timekeeping: (
    <FontAwesomeIcon
      icon={faSquareCheck}
      style={{ color: '#20a99c', fontSize: '20px' }}
    />
  ),
  User_Stories: (
    <FontAwesomeIcon
      icon={faFileCircleCheck}
      style={{ color: '#20a99c', fontSize: '20px' }}
    />
  ),
  Test_Runs: (
    <FontAwesomeIcon
      icon={faVialCircleCheck}
      style={{ color: '#20a99d', fontSize: '20px' }}
    />
  ),
};
const glideYokeIcon = {
  Physical_parts: (
    <FontAwesomeIcon icon={faCube} style={{ color: '#8b8d92', fontSize: '20px' }} />
  ),
  Issues: <FontAwesomeIcon icon={faBug} style={{ color: '#e5493a', fontSize: '20px' }} />,
  Document: (
    <FontAwesomeIcon icon={faFileLines} style={{ color: '#8b8d92', fontSize: '20px' }} />
  ),
  Change_requests: (
    <FontAwesomeIcon
      icon={faCodeCompare}
      style={{ color: '#8b8d92', fontSize: '20px' }}
    />
  ),
};
const dngIcon = {
  Requirement: (
    <FontAwesomeIcon
      icon={faFileCircleCheck}
      style={{ color: '#367aa0', fontSize: '20px' }}
    />
  ),
  Requirement_collection: (
    <FontAwesomeIcon icon={faListCheck} style={{ color: '#367ba1', fontSize: '20px' }} />
  ),
};
const valispaceIcon = {
  Requirement: (
    <FontAwesomeIcon
      icon={faFileCircleCheck}
      style={{ color: '#f1b96d', fontSize: '20px' }}
    />
  ),
};

// OSLC API URLs
const jiraURL = `${import.meta.env.VITE_JIRA_DIALOG_URL}`;
const gitlabURL = `${import.meta.env.VITE_GITLAB_DIALOG_URL}`;
const glideURL = `${import.meta.env.VITE_GLIDE_DIALOG_URL}`;
const valispaceURL = `${import.meta.env.VITE_VALISPACE_DIALOG_URL}`;
const codebeamerURL = `${import.meta.env.VITE_CODEBEAMER_DIALOG_URL}`;

const LinkManagerTable = ({ props }) => {
  const { data, handleDeleteLink, setSelectedRowData } = props;
  const { isDark } = useSelector((state) => state.nav);
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
          <Popover>
            <ExternalPreview nodeData={rowData} />
          </Popover>
        );
      } else {
        const updatedRowData = showOslcData(rowData);
        return (
          <Popover>
            <ExternalPreview nodeData={updatedRowData} />
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
    if (rowData?.resource_type) {
      if (rowData?.api === 'gitlab') {
        if (rowData?.resource_type === 'Source Code File')
          appIcon = gitlabIcon.Source_code;
        else if (rowData?.resource_type === 'Block of code')
          appIcon = gitlabIcon.Block_code;
      } else if (rowData?.api === 'jira') {
        if (rowData?.resource_type === 'Tasks') appIcon = jiraIcon.Task;
        else if (rowData?.resource_type === 'Epics') appIcon = jiraIcon.Epic;
        else if (rowData?.resource_type === 'User Stories') appIcon = jiraIcon.UserStory;
        else if (rowData?.resource_type === 'Bugs') appIcon = jiraIcon.Issues;
        else if (rowData?.resource_type === 'Improvements')
          appIcon = jiraIcon.Improvement;
        else if (rowData?.resource_type === 'New Features')
          appIcon = jiraIcon.New_feature;
        else appIcon = jiraIcon.subT;
      } else if (rowData?.api === 'codebeamer') {
        if (rowData?.resource_type === 'Releases') appIcon = codebeamerIcon.Releases;
        else if (rowData?.resource_type === 'Documents')
          appIcon = codebeamerIcon.Documents;
        else if (rowData?.resource_type === 'Change Requests')
          appIcon = codebeamerIcon.Change_requests;
        else if (rowData?.resource_type === 'Hardware Tasks')
          appIcon = codebeamerIcon.Hardware_tasks;
        else if (rowData?.resource_type === 'Software Tasks')
          appIcon = codebeamerIcon.Software_tasks;
        else if (rowData?.resource_type === 'Risk') appIcon = codebeamerIcon.Risks;
        else if (rowData?.resource_type === 'Test Cases')
          appIcon = codebeamerIcon.Test_cases;
        else if (rowData?.resource_type === 'Test Sets')
          appIcon = codebeamerIcon.Test_sets;
        else if (rowData?.resource_type === 'Test Configuration')
          appIcon = codebeamerIcon.Test_configuration;
        else if (rowData?.resource_type === 'Test Runs')
          appIcon = codebeamerIcon.Test_Runs;
        else if (rowData?.resource_type === 'Bugs') appIcon = codebeamerIcon.Bugs;
        else if (rowData?.resource_type === 'Public DOcuments')
          appIcon = codebeamerIcon.Documents;
        else if (rowData?.resource_type === 'Accounts')
          appIcon = codebeamerIcon.Documents;
        else if (rowData?.resource_type === 'Opportunities')
          appIcon = codebeamerIcon.Documents;
        else if (rowData?.resource_type === 'Prospects')
          appIcon = codebeamerIcon.Documents;
        else if (rowData?.resource_type === 'Leads') appIcon = codebeamerIcon.Documents;
        else if (rowData?.resource_type === 'Activities')
          appIcon = codebeamerIcon.Documents;
        else if (rowData?.resource_type === 'Epics') appIcon = codebeamerIcon.Epics;
        else if (rowData?.resource_type === 'Test Configurations')
          appIcon = codebeamerIcon.Test_Configurations;
        else if (rowData?.resource_type === 'Backlog Items')
          appIcon = codebeamerIcon.Timekeeping;
        else if (rowData?.resource_type === 'Timekeeping')
          appIcon = codebeamerIcon.Timekeeping;
        else if (rowData?.resource_type === 'Tasks') appIcon = codebeamerIcon.Timekeeping;
        else if (rowData?.resource_type === 'User Stories')
          appIcon = codebeamerIcon.User_Stories;
        else appIcon = codebeamerIcon.requirement_specification;
      } else if (rowData?.api === 'dng') {
        if (rowData?.resource_type === 'Requirements') appIcon = dngIcon.Requirement;
        else appIcon = dngIcon.Requirement_collection;
      } else if (rowData?.api === 'valispace') {
        appIcon = valispaceIcon.Requirement;
      } else {
        if (rowData?.api === 'glideyoke') {
          if (rowData?.resource_type === 'Documents') appIcon = glideYokeIcon.Document;
          else if (rowData?.resource_type === 'Physical Parts')
            appIcon = glideYokeIcon.Physical_parts;
          else if (rowData?.resource_type === 'Change Requests')
            appIcon = glideYokeIcon.Change_requests;
          else appIcon = glideYokeIcon.Issues;
        }
      }
    }
    return (
      <div style={{ display: 'flex', alignItems: 'center', marginLeft: '10px' }}>
        <p style={{ marginRight: '5px' }}>{appIcon}</p>
        <div style={{ fontSize: '17px' }}>{rowData?.resource_type}</div>
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
    getSubRows: (row) => row.children,
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
