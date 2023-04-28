import React, { useState } from 'react';
import MoreIcon from '@rsuite/icons/legacy/More';
import { Table, Pagination, Whisper, IconButton, Popover, Dropdown } from 'rsuite';
const { Column, HeaderCell, Cell } = Table;
import styles from './UseDataTable.module.scss';
import { useEffect } from 'react';
import { AiFillCheckCircle } from 'react-icons/ai';
import { useSelector } from 'react-redux';
import { darkColor, lightBgColor } from '../../../App';
const { tableContainerDiv, validIcon, statusIcon } = styles;

const LinksDataTable = ({ props }) => {
  const { handlePagination, handleChangeLimit, totalItems, pageSize } = props;
  const { isDark } = useSelector((state) => state.nav);
  const [page, setPage] = useState(1);
  const [actionData, setActionData] = useState({});

  useEffect(() => {
    handlePagination(page);
  }, [page]);

  // Action table cell control
  const renderMenu = ({ onClose, left, top, className }, ref) => {
    const handleSelect = () => {
      onClose();
    };
    console.log('action', actionData);
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

  const StatusCell = ({ ...props }) => {
    return (
      <Cell {...props} style={{ fontSize: '17px' }}>
        {' '}
        <AiFillCheckCircle className={`${statusIcon} ${validIcon}`} /> Valid
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
            }/resources/${rowData?.Type}/${
              rowData?.resource_id
            }/smallPreview?branch_name=${rowData?.branch_name}&file_content=${
              rowData?.content
            }&file_lines=${lines ? lines[1] + lines[2] : ''}&file_path=${
              rowData?.koatl_path
            }`
          }
          width="400"
          height="250"
        ></iframe>
      </Popover>
    );

    return (
      <Cell {...props} style={{ cursor: 'pointer', fontSize: '17px' }}>
        <Whisper
          enterable
          placement="auto"
          speaker={speaker}
          delayOpen={700}
          delayClose={700}
        >
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
        </Whisper>
      </Cell>
    );
  };

  return (
    <div className={tableContainerDiv}>
      <Table data={props?.rowData} autoHeight bordered headerHeight={50}>
        <Column width={150} fullText>
          <HeaderCell>
            <h5>Status</h5>
          </HeaderCell>
          <StatusCell dataKey={''} />
        </Column>

        <Column width={250} fullText>
          <HeaderCell>
            <h5>Link Type</h5>
          </HeaderCell>
          <Cell style={{ fontSize: '17px' }} dataKey="link_type" />
        </Column>

        <Column width={300} flexGrow={1} fullText>
          <HeaderCell>
            <h5>Target</h5>
          </HeaderCell>
          <NameCell dataKey="name" />
        </Column>

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
        style={{ backgroundColor: isDark == 'dark' ? darkColor : lightBgColor }}
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

export default LinksDataTable;
