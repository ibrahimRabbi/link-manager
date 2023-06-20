import React, { useEffect, useState } from 'react';
import { Table } from 'rsuite';
import FileDownloadIcon from '@rsuite/icons/FileDownload';
import { handleCurrPageTitle } from '../../Redux/slices/navSlice';
import { useDispatch } from 'react-redux';

const { Column, HeaderCell, Cell } = Table;
const ExtensionFile = () => {
  const [selectedData, setSelectedData] = useState([]);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(handleCurrPageTitle('Extension'));
  }, []);
  const data = [
    {
      id: 1,
      extension: 'GITLAB WBE',
    },
  ];
  const handleDownload = () => {
    console.log(selectedData);
    const link = document.createElement('a');
    link.href = '/default-logo.png';
    link.download = 'default-logo.png';
    link.click();
  };
  return (
    <div style={{ padding: '30px' }}>
      <Table
        autoHeight
        bordered
        headerHeight={50}
        height={400}
        data={data}
        onRowClick={(rowData) => {
          setSelectedData(rowData);
        }}
      >
        <Column width={150} align="center" fixed>
          <HeaderCell>
            <h5>EXT No</h5>
          </HeaderCell>
          <Cell
            style={{
              fontSize: '17px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            dataKey="id"
          />
        </Column>

        <Column width={700} align="center" headerHeight={50}>
          <HeaderCell>
            <h5>Extension Name</h5>
          </HeaderCell>
          <Cell
            style={{
              fontSize: '17px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            dataKey="extension"
          />
        </Column>

        <Column width={300} align="center" headerHeight={50}>
          <HeaderCell>
            <h5>Download</h5>
          </HeaderCell>
          <Cell>
            <span
              className="download-link"
              style={{
                fontSize: '17px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
              }}
              onClick={handleDownload}
            >
              <FileDownloadIcon />
            </span>
          </Cell>
        </Column>
      </Table>
    </div>
  );
};

export default ExtensionFile;
