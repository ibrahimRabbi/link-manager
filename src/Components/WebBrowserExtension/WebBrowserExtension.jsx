import React, { useEffect } from 'react';
import { Table } from 'rsuite';
import FileDownloadIcon from '@rsuite/icons/FileDownload';
import { handleCurrPageTitle } from '../../Redux/slices/navSlice';
import { useDispatch } from 'react-redux';

const { Column, HeaderCell, Cell } = Table;

const WebBrowserExtension = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(handleCurrPageTitle('Extension'));
  }, []);

  const data = [
    {
      id: 1,
      extension: 'Jira WBE',
      link: '/wbe/jira-wbe.zip',
    },
    {
      id: 2,
      extension: 'Glide WBE',
      link: '/wbe/glide-wbe.zip',
    },
    {
      id: 3,
      extension: 'Valispace WBE',
      link: '/wbe/valispace-wbe.zip',
    },
  ];

  const handleDownload = (rowData) => {
    console.log(rowData);
    const link = document.createElement('a');
    link.href = rowData.link;
    link.download = rowData.extension + '.zip';
    link.click();
  };

  return (
    <div style={{ padding: '30px' }}>
      <Table autoHeight bordered headerHeight={50} height={400} data={data}>
        <Column width={600} align="center" headerHeight={50}>
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

        <Column width={500} align="center" headerHeight={50}>
          <HeaderCell>
            <h5>Download</h5>
          </HeaderCell>
          <Cell>
            {(rowData) => (
              <span
                className="download-link"
                style={{
                  fontSize: '17px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                }}
              >
                <FileDownloadIcon onClick={() => handleDownload(rowData)} />
              </span>
            )}
          </Cell>
        </Column>
      </Table>
    </div>
  );
};

export default WebBrowserExtension;
