import React, { useEffect } from 'react';
import { Table } from 'rsuite';
import FileDownloadIcon from '@rsuite/icons/FileDownload';
import { handleCurrPageTitle } from '../../Redux/slices/navSlice';
import { useDispatch } from 'react-redux';

const { Column, HeaderCell, Cell } = Table;

const WebBrowserExtension = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(handleCurrPageTitle('Link Manager Extension'));
  }, []);

  const data = [
    {
      id: 1,
      filename: 'gitlab-wbe.zip',
      link: '/wbe/gitlab-wbe.zip',
    },
    {
      id: 2,
      filename: 'jira-wbe.zip',
      link: '/wbe/jira-wbe.zip',
    },
    {
      id: 3,
      filename: 'glide-wbe.zip',
      link: '/wbe/glide-wbe.zip',
    },
    {
      id: 4,
      filename: 'valispace-wbe.zip',
      link: '/wbe/valispace-wbe.zip',
    },
  ];

  const handleDownload = (rowData) => {
    const link = document.createElement('a');
    link.href = rowData.link;
    link.download = rowData.filename;
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
            dataKey="filename"
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
