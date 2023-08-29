/* eslint-disable indent */
import React, { useEffect, useState } from 'react';
import { Col, FlexboxGrid } from 'rsuite';
import styles from '../ExternalPreview.module.scss';

const { title, description } = styles;

const PreviewRow = (props) => {
  const {
    name,
    value,
    nodeData,
    firstLetter = false,
    functionForIcon = null,
    urlDescription = null,
    titleIcon = null,
  } = props;

  const [normalText, setNormalText] = useState('');

  function convertToPlain(rtf) {
    if (!rtf) {
      return ''; // Return an empty string if rtf is falsy
    }
    const plainText = rtf.replace(/\([^)]+\)|%|\u00a0|~|[!{[\]}\\|)]+/g, '');
    return plainText;
  }

  useEffect(() => {
    if (nodeData) {
      const plainText = convertToPlain(nodeData?.description);
      setNormalText(plainText);
    }
  }, [nodeData]);

  return (
    <FlexboxGrid justify="space-around">
      <FlexboxGrid.Item as={Col} colspan={10}>
        <p className={title}>
          {titleIcon && titleIcon}
          {name}
        </p>
      </FlexboxGrid.Item>
      <FlexboxGrid.Item as={Col} colspan={14}>
        <p
          className={description}
          style={{ fontSize: '17px' }}
          onClick={() => urlDescription && window.open(urlDescription, '_blank')}
        >
          {functionForIcon && functionForIcon(value)}
          {firstLetter
            ? value.charAt(0).toUpperCase() + value.slice(1)
            : value === 'Repositoryfileblockofcodeselection'
            ? 'Block of code'
            : normalText?.length > 160
            ? `${normalText?.slice(0, 160)}...`
            : normalText
            ? normalText?.slice(0, 160)
            : value}
        </p>
        {normalText?.length > 160 && (
          <a
            href={nodeData?.web_url}
            target="_blank"
            rel="noopener noreferrer"
            style={{ fontSize: '15px', cursor: 'pointer' }}
          >
            Show more
          </a>
        )}
      </FlexboxGrid.Item>
    </FlexboxGrid>
  );
};

export default PreviewRow;
