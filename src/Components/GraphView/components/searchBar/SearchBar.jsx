import React from 'react';
import styled from 'styled-components';
import Select from 'react-select';

const StyledSelect = styled(Select)`
  flex: 1;
`;

const SearchBar = (props) => {
  return (
    <div
      style={{
        height: '60px',
        display: 'flex',
        alignItems: 'center',
        padding: '0 10px',
        backgroundColor: '#f0f0f0',
        boxSizing: 'border-box',
        borderBottom: 'solid 1px #ddd',
      }}
    >
      <StyledSelect
        value={props.selectedOptions}
        onChange={props.handleSelectChange}
        options={props.selectOptions}
        isMulti
        placeholder="Please search or select nodes!"
        name="nodes"
        className="basic-multi-select"
        classNamePrefix="select"
      />
    </div>
  );
};

export { SearchBar };
