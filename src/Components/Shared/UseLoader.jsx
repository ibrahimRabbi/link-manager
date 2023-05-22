import React from 'react';
import { FlexboxGrid } from 'rsuite';
import SpinnerIcon from '@rsuite/icons/legacy/Spinner';

const UseLoader = () => {
  return (
    <FlexboxGrid justify="center" style={{ margin: '5px 0' }}>
      <SpinnerIcon style={{ fontSize: '35px' }} />
    </FlexboxGrid>
  );
};

export default UseLoader;
