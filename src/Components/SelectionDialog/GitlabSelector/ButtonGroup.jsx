/* eslint-disable max-len */
import React, { useState } from 'react';
import { Button, ButtonToolbar, Loader, Placeholder } from 'rsuite';
import CryptoJS from 'crypto-js';

const ButtonGroup = ({
  selectedCodes,
  multipleSelected,
  singleSelected,
  dialogResponse,
}) => {
  const [loading, setLoading] = useState(false);
  const handleSelect = () => {
    setLoading(true);
    const propsToRemove = ['children', 'is_folder', 'visible', 'id'];
    let value;
    if (singleSelected !== '') {
      value = JSON.parse(JSON.stringify(singleSelected));
    } else {
      value = JSON.parse(JSON.stringify(multipleSelected));
    }
    if (Array.isArray(value)) {
      for (const obj of value) {
        for (const prop in obj) {
          if (propsToRemove.includes(prop)) {
            delete obj[prop];
          }
        }
      }
    } else {
      for (const prop in value) {
        if (propsToRemove.includes(prop)) {
          delete value[prop];
        }
      }
    }
    if (selectedCodes.code !== '' && multipleSelected.length < 1) {
      const selecteCode = selectedCodes.code;
      const encoder = new TextEncoder();
      const data = encoder.encode(selecteCode);
      const hash = CryptoJS.SHA256(data);
      const hexString = hash.toString(CryptoJS.enc.Hex);
      const initialResponse = '[';
      let Response = '';
      const finalresponse = ']';
      let resultsPart = value;

      // Extract the contents of the square brackets
      if (Array.isArray(resultsPart)) {
        resultsPart = resultsPart[0];
      }
      resultsPart.description = '';
      resultsPart.extended_properties.content_hash = hexString;
      resultsPart.extended_properties.selected_lines = `${selectedCodes.startLineNumber}-${selectedCodes.endLineNumber}`;
      resultsPart.type = 'RepositoryFileBlockOfCodeSelection';
      resultsPart = JSON.stringify(resultsPart);
      Response += `${resultsPart}`;

      Response = Response.replace(/^\[|\]$/g, '');
      Response = initialResponse + Response + finalresponse;
      setLoading(false);
      dialogResponse(Response);
    } else if (value.length > 1) {
      const initialResponse = '[';
      let Response = '';
      const finalResponse = ']';

      for (let i = 0; i < value.length; i++) {
        let resultsPart = value[i];
        // Extract the contents of the square brackets
        if (Array.isArray(resultsPart)) {
          resultsPart = resultsPart[0];
        }
        resultsPart.extended_properties.content_hash = null;
        resultsPart.extended_properties.selected_lines = null;
        resultsPart = JSON.stringify(resultsPart);
        Response += `${resultsPart}`;

        if (i < value.length - 1) {
          Response += ', ';
        }
      }

      Response = initialResponse + Response + finalResponse;
      setLoading(false);
      dialogResponse(Response);
    } else {
      const initialResponse = '[';
      let Response = '';
      const finalresponse = ']';
      let resultsPart = value;

      // Extract the contents of the square brackets
      if (Array.isArray(resultsPart)) {
        resultsPart = resultsPart[0];
      }
      resultsPart.description = '';
      resultsPart.extended_properties.content_hash = null;
      resultsPart.extended_properties.selected_lines = null;
      resultsPart = JSON.stringify(resultsPart);
      Response += `${resultsPart}`;

      Response = Response.replace(/^\[|\]$/g, '');
      Response = initialResponse + Response + finalresponse;
      setLoading(false);
      dialogResponse(Response);
    }
  };

  // Function to handle cancel
  function cancel() {
    dialogResponse('');
  }
  return (
    <div>
      {loading && (
        <div>
          <Placeholder.Paragraph rows={8} />
          <Loader backdrop content="loading..." vertical />
        </div>
      )}
      <ButtonToolbar>
        <Button appearance="ghost" onClick={cancel}>
          Cancel
        </Button>
        <Button
          appearance="primary"
          size="md"
          style={{ width: '65px' }}
          onClick={handleSelect}
        >
          OK
        </Button>
      </ButtonToolbar>
    </div>
  );
};

export default ButtonGroup;
