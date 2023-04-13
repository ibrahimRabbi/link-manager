import React from 'react';
import MoreIcon from '@rsuite/icons/legacy/More';
import { Table, Pagination, Whisper, IconButton, Popover, Dropdown } from 'rsuite';
const { Column, HeaderCell, Cell } = Table;
import styles from './UseDataTable.module.scss';
import { useEffect } from 'react';
const { tableContainerDiv } = styles;

// Action table cell control
const renderMenu = ({ onClose, left, top, className }, ref) => {
  const handleSelect = (eventKey) => {
    onClose();
    console.log(eventKey);
  };
  return (
    <Popover ref={ref} className={className} style={{ left, top }} full>
      <Dropdown.Menu onSelect={handleSelect}>
        <Dropdown.Item eventKey={1}>
          <p>Details</p>
        </Dropdown.Item>
        <Dropdown.Item eventKey={2}>
          <p>Edit</p>
        </Dropdown.Item>
        <Dropdown.Item eventKey={3}>
          <p>Set Status - Valid</p>
        </Dropdown.Item>
        <Dropdown.Item eventKey={4}>
          <p>Set Status - Invalid</p>
        </Dropdown.Item>
        <Dropdown.Item eventKey={5}>
          <p>Remove</p>
        </Dropdown.Item>
      </Dropdown.Menu>
    </Popover>
  );
};

const ActionCell = ({ ...props }) => {
  return (
    <Cell {...props} className="link-group">
      <Whisper placement="auto" trigger="click" speaker={renderMenu}>
        <IconButton appearance="subtle" icon={<MoreIcon />} />
      </Whisper>
    </Cell>
  );
};

// target name table cell control
const NameCell = ({ rowData, ...props }) => {
  const lines = rowData?.content_lines ? rowData?.content_lines?.split('L') : '';
  const speaker = (
    <Popover title="Preview">
      <iframe
        src={
          // eslint-disable-next-line max-len
          `https://gitlab-oslc-api-dev.koneksys.com/oslc/provider/${
            rowData?.provider_id
          }/resources/${rowData?.Type}/${rowData?.resource_id}/smallPreview?file_lines=${
            lines ? lines[1] + lines[2] : ''
          }&file_content=${rowData?.content}&file_path=${rowData?.koatl_path}`
        }
        width="400"
        height="250"
      ></iframe>
    </Popover>
  );

  return (
    <Cell {...props} style={{ cursor: 'pointer' }}>
      <Whisper enterable placement="auto" speaker={speaker}>
        <p>
          <a href={rowData?.id} target="_blank" rel="noopener noreferrer">
            {rowData?.content_lines
              ? rowData?.name.length > 15
                ? rowData?.name.slice(0, 15 - 1) +
                  '...' +
                  ' [' +
                  rowData.content_lines +
                  ']'
                : rowData?.name + ' [' + rowData.content_lines + ']'
              : rowData?.name}
          </a>
        </p>
      </Whisper>
    </Cell>
  );
};

// link type table cell control
const LinkTypeCell = ({ rowData, ...props }) => {
  return (
    <Cell {...props}>
      <p>{rowData?.link_type}</p>
    </Cell>
  );
};
// status table cell control
const StatusCell = ({ ...props }) => {
  return (
    <Cell {...props}>
      <p>Valid</p>
    </Cell>
  );
};

const LinksDataTable = ({ props }) => {
  const { rowData, handlePagination, handleChangeLimit, totalItems, pageSize } = props;
  const [page, setPage] = React.useState(1);

  useEffect(() => {
    handlePagination(page);
  }, [page]);
  return (
    <div className={tableContainerDiv}>
      <Table data={rowData} autoHeight bordered headerHeight={50}>
        <Column width={150} fullText>
          <HeaderCell>
            <h6>Status</h6>
          </HeaderCell>
          <StatusCell dataKey={''} />
        </Column>

        <Column width={250} fullText>
          <HeaderCell>
            <h6>Link Type</h6>
          </HeaderCell>
          <LinkTypeCell dataKey="link_type" />
        </Column>

        <Column width={500} fullText>
          <HeaderCell>
            <h6>Target</h6>
          </HeaderCell>
          <NameCell dataKey="name" />
        </Column>

        <Column width={100} align="center">
          <HeaderCell>
            <h6>Action</h6>
          </HeaderCell>
          <ActionCell dataKey="id" />
        </Column>
      </Table>

      <Pagination
        style={{ margin: '0', padding: '5px 10px' }}
        prev
        next
        first
        last
        ellipsis
        boundaryLinks
        maxButtons={3}
        size="xs"
        layout={['total', '-', 'limit', '|', 'pager', 'skip']}
        total={totalItems}
        limitOptions={[5, 10, 25, 50, 100]}
        limit={pageSize}
        activePage={page}
        onChangePage={setPage}
        onChangeLimit={(v) => handleChangeLimit(v)}
      />
      <div></div>
    </div>
  );
};

export default LinksDataTable;
