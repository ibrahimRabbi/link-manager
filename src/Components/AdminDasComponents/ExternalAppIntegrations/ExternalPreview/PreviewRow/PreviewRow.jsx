import React from 'react';
import { Col, FlexboxGrid } from 'rsuite';
import styles from '../ExternalPreview.module.scss';

const { title, description } = styles;
const PreviewRow = (props) => {
  const {
    name,
    value,
    firstLetter = false,
    functionForIcon = null,
    urlDescription = null,
    titleIcon = null,
  } = props;
  return (
    <FlexboxGrid justify="space-around">
      <FlexboxGrid.Item as={Col} colspan={10}>
        <p className={title}>
          {titleIcon ? titleIcon : ''}
          {name}
        </p>
      </FlexboxGrid.Item>
      <FlexboxGrid.Item as={Col} colspan={14}>
        <p
          className={description}
          onClick={() => (urlDescription ? window.open(urlDescription, '_blank') : null)}
        >
          {functionForIcon ? functionForIcon(value) : ''}
          {firstLetter ? value.charAt(0).toUpperCase() + value.slice(1) : value}
        </p>
      </FlexboxGrid.Item>
    </FlexboxGrid>
  );
};

export default PreviewRow;
