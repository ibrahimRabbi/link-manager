/* eslint-disable max-len */
import React, { useState } from 'react';
import { Button, ButtonToolbar, Loader } from 'rsuite';

const ButtonGroup = ({
  selectedCodes,
  multipleSelected,
  singleSelected,
  handleSaveLink,
  branchName,
  cancelLinkHandler,
  checkedValues,
}) => {
  const [loading, setLoading] = useState(false);
  const handleSelect = () => {
    setLoading(true);
    const propsToRemove = ['children', 'is_folder', 'visible', 'id', 'value', 'refKey'];
    let value;
    let parent;
    if (singleSelected !== '') {
      value = JSON.parse(JSON.stringify(singleSelected));
      parent = { ...singleSelected };
      for (const prop of propsToRemove) {
        delete parent[prop];
        delete parent?.extended_properties?.content_hash;
        delete parent?.extended_properties?.selected_lines;
      }
    } else {
      value = JSON.parse(JSON.stringify(multipleSelected));
    }

    if (Array.isArray(value)) {
      for (const obj of value) {
        obj.extended_properties.branch_name = branchName;
        for (const prop in obj) {
          if (propsToRemove.includes(prop)) {
            delete obj[prop];
          }
        }
      }
    } else {
      value.extended_properties.branch_name = branchName;
      for (const prop in value) {
        if (propsToRemove.includes(prop)) {
          delete value[prop];
        }
      }
    }
    if (selectedCodes.code !== '' && multipleSelected.length < 1) {
      const selecteCode = selectedCodes.code;
      const hexString = window.btoa(selecteCode);
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
      resultsPart.extended_properties.selected_lines = `${selectedCodes?.startLineNumber}-${selectedCodes?.endLineNumber}`;
      resultsPart.type =
        'http://open-services.net/ns/scm#RepositoryFileBlockOfCodeSelection';
      resultsPart.parent_properties = parent;
      resultsPart.resourceTypes = 'Block of code';
      resultsPart = JSON.stringify(resultsPart);
      Response += `${resultsPart}`;

      Response = Response.replace(/^\[|\]$/g, '');
      Response = initialResponse + Response + finalresponse;
      setLoading(false);
      handleSaveLink(Response);
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
        resultsPart.web_application_resource_type =
          value?.extended_properties?.web_application_resource_type;
        resultsPart.type = value?.type;
        resultsPart = JSON.stringify(resultsPart);
        Response += `${resultsPart}`;

        if (i < value.length - 1) {
          Response += ', ';
        }
      }

      Response = initialResponse + Response + finalResponse;
      setLoading(false);
      handleSaveLink(Response);
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
      resultsPart.web_application_resource_type =
        value?.extended_properties?.web_application_resource_type;
      resultsPart.type = value?.type;
      resultsPart = JSON.stringify(resultsPart);
      Response += `${resultsPart}`;

      Response = Response.replace(/^\[|\]$/g, '');
      Response = initialResponse + Response + finalresponse;
      setLoading(false);
      handleSaveLink(Response);
    }
  };

  // Function to handle cancel
  function cancel() {
    cancelLinkHandler();
  }
  return (
    <div>
      {loading && (
        <div style={{ marginTop: '50px' }}>
          <Loader backdrop center size="md" vertical style={{ zIndex: '10' }} />
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
          disabled={checkedValues?.length > 0 ? false : true}
          onClick={handleSelect}
        >
          OK
        </Button>
      </ButtonToolbar>
    </div>
  );
};

export default ButtonGroup;
