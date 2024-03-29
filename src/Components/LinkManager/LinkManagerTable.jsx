import React, { useMemo, useState } from 'react';
import { FaChevronRight } from 'react-icons/fa';
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

import { ButtonToolbar, IconButton, Popover, Whisper } from 'rsuite';
import cssStyles from './LinkManager.module.scss';
import { useSelector } from 'react-redux';
// eslint-disable-next-line max-len
import ExternalPreview from '../AdminDasComponents/ExternalAppIntegrations/ExternalPreview/ExternalPreview.jsx';
// eslint-disable-next-line max-len
import { showOslcData } from '../AdminDasComponents/ExternalAppIntegrations/ExternalPreview/ExternalPreviewConfig.jsx';
import { getIcon } from './ResourceTypeIcon.jsx';
import {
  BASIC_AUTH_APPLICATION_TYPES,
  MICROSERVICES_APPLICATION_TYPES,
  OAUTH2_APPLICATION_TYPES,
} from '../../App.jsx';
// eslint-disable-next-line max-len
import ExternalAppModal from '../AdminDasComponents/ExternalAppIntegrations/ExternalAppModal/ExternalAppModal.jsx';
import { addNodeLabel } from '../CytoscapeGraphView/Graph.jsx';
import { MdDelete } from 'react-icons/md';
const {
  table_head_dark,
  table_head_light,
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
  emptyTableContent,
  iconRotate,
  allIconRotate,
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
  const [isChildren, setIsChildren] = useState(false);

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
          //prettier-ignore
          speaker={
            rowData?.application_type
              ? speaker(rowData, true)
              : rowData?.api
                ? speaker(rowData, true)
                : speaker(rowData)
          }
          delayOpen={550}
          delayClose={550}
        >
          <a
            //prettier-ignore
            href={
              rowData?.application_type
                ? rowData?.web_url
                : rowData?.api
                  ? rowData?.web_url
                  : rowData?.id
            }
            target="_blank"
            rel="noopener noreferrer"
          >
            {addNodeLabel(rowData?.name, rowData?.selected_lines)}
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
      if (rowData?.application_type) {
        appIcon = getIcon(rowData?.application_type, rowData?.resource_type);
      } else {
        appIcon = getIcon(rowData?.api, rowData?.resource_type);
      }
      resourceType = rowData?.resource_type ? rowData.resource_type : '';
    }
    if (rowData?.web_application_resource_type && rowData?.application_type) {
      appIcon = getIcon(
        rowData?.application_type,
        rowData?.web_application_resource_type,
      );
      resourceType = rowData?.web_application_resource_type
        ? rowData.web_application_resource_type
        : '';
    }
    if (rowData?.web_application_resource_type && rowData?.api) {
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
                {isChildren && <FaChevronRight size={17} />}
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
              <ButtonToolbar>
                <IconButton
                  size="sm"
                  title="Delete"
                  icon={<MdDelete />}
                  onClick={() => {
                    setSelectedRowData(rowData);
                    handleDeleteLink();
                  }}
                />
              </ButtonToolbar>
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
    getSubRows: (row) => {
      if (row?.children) {
        row?.children[0];
        setIsChildren(true);
      }
      return [];
    },
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
                    className={isDark === 'dark' ? table_head_dark : table_head_light}
                    style={{
                      width: status ? '100px' : action ? '100px' : '',
                    }}
                  >
                    {header.isPlaceholder ? null : (
                      <div style={{ fontWeight: 'normal' }}>
                        {flexRender(header.column.columnDef.header, header.getContext())}
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
            type: externalAuthData?.application_type,
            rdf_type: externalAuthData?.type,
          }}
          isOauth2={OAUTH2_APPLICATION_TYPES?.includes(
            externalAuthData?.application_type,
          )}
          isBasic={(
            BASIC_AUTH_APPLICATION_TYPES + MICROSERVICES_APPLICATION_TYPES
          ).includes(externalAuthData?.application_type)}
          onDataStatus={getExtLoginData}
          integrated={true}
          openedModal={showExternalAuthWindow}
          closeModal={closeExternalAuthWindow}
        />
      )}
    </div>
  );
};

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
