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

  const addGitlabCodeProperties = (gitlabApiData, hexString, selectedCodes, parent) => {
    let gitlabFileData = Array.isArray(gitlabApiData) ? gitlabApiData[0] : gitlabApiData;
    const webResourceType = hexString
      ? 'Block of code'
      : gitlabFileData.web_application_resource_type;
    const type = hexString
      ? 'http://open-services.net/ns/scm#RepositoryFileBlockOfCodeSelection'
      : gitlabFileData.type;
    gitlabFileData = addUrlWithBranchName(gitlabFileData);
    gitlabFileData = {
      ...gitlabFileData,
      extended_properties: {
        ...gitlabFileData.extended_properties,
        content_hash: hexString ? hexString : null,
        selected_lines: selectedCodes
          ? `${selectedCodes.startLineNumber}-${selectedCodes.endLineNumber}`
          : null,
      },
      type: type,
      parent_properties: parent,
      web_application_resource_type: webResourceType,
    };
    // Attach parent if it exists
    if (parent) {
      parent = addUrlWithBranchName(parent);
      gitlabFileData = {
        ...gitlabFileData,
        parent_properties: parent,
      };
    }
    return gitlabFileData;
  };

  const addUrlWithBranchName = (gitlabFileData) => {
    return {
      ...gitlabFileData,
      web_url: gitlabFileData.web_url.replace(
        gitlabFileData.extended_properties.commit_id,
        gitlabFileData.extended_properties.branch_name,
      ),
    };
  };

  const handleSelect = () => {
    setLoading(true);
    const propsToRemove = ['children', 'is_folder', 'visible', 'id', 'value', 'refKey'];
    let value;
    let parent;
    if (singleSelected !== '') {
      value = JSON.parse(JSON.stringify(singleSelected));
      parent = {
        ...singleSelected,
        api_url: singleSelected.link,
        extended_properties: {
          ...singleSelected.extended_properties,
          branch_name: branchName,
          content_hash: '',
          selected_lines: null,
        },
      };

      for (const prop of propsToRemove) {
        delete parent[prop];
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
      let resultsPart = addGitlabCodeProperties(value, hexString, selectedCodes, parent);
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
        let resultsPart = addGitlabCodeProperties(value[i], null, null, null);
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
      let resultsPart = addGitlabCodeProperties(value, null, null, null);
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
