/* eslint-disable max-len */
import React, { useContext, useState } from 'react';
import { Button, ButtonToolbar, Loader, Placeholder } from 'rsuite';
import CryptoJS from 'crypto-js';
import SelectionAuthContext from '../../../Store/SelectionAuthContext';

const ButtonGroup = ({
  selectedCodes,
  projectId,
  branchId,
  multipleSelected,
  singleSelected,
}) => {
  const [loading, setLoading] = useState(false);
  const authCtx = useContext(SelectionAuthContext);
  const handleSelect = async () => {
    setLoading(true);
    const propsToRemove = [
      'children',
      'isFolder',
      'label',
      'value',
      'expand',
      'visible',
      'refKey',
    ];
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
      const initialOslcResponse = 'oslc-response:{ "oslc:results": [';
      let oslcResponse = '';
      const finalresponse = ']}';
      let resultsPart = value;

      // Extract the contents of the square brackets
      if (Array.isArray(resultsPart)) {
        resultsPart = resultsPart[0];
      }
      const url = resultsPart['rdf:resource'];
      const subStr = '/component/';
      const index = url.indexOf(subStr);
      let resourceType = '';
      let resourceId = '';
      if (index !== -1) {
        const result = url.substring(index + subStr.length);
        const values = result.split('/');
        resourceType = values[4];
        let path = resultsPart['koatl:apiPath'];
        path = path.replaceAll(' ', '%2520');
        path = path.replaceAll('/', '%252F');
        await fetch(
          `https://gitlab-oslc-api-dev.koneksys.com/rest/v2/provider/${projectId}/file/${path}?branch_name=${branchId}`,
          {
            headers: {
              Authorization: `Bearer ${authCtx.token}`,
            },
          },
        )
          .then((response) => response.json())
          .then((data) => {
            // Assign the decoded data to fileCode
            const res = data.split('-');
            resourceId = res[0];
          });
      }

      resultsPart['rdf:type'] += 'BlockOfCodeSelection';
      resultsPart['oslc:content'] = hexString;
      resultsPart[
        'oslc:contentLine'
      ] = `L${selectedCodes.startLineNumber}-L${selectedCodes.endLineNumber}`;
      resultsPart['oslc:providerId'] = projectId;
      resultsPart['oslc:resourceType'] = resourceType;
      resultsPart['oslc:resourceId'] = resourceId;
      resultsPart[
        'oslc:selectedLines'
      ] = `${selectedCodes.startLineNumber}-${selectedCodes.endLineNumber}`;
      resultsPart['oslc:branchName'] = branchId;
      resultsPart['oslc:api'] = 'gitlab';
      resultsPart = JSON.stringify(resultsPart);
      oslcResponse += `${resultsPart}`;

      oslcResponse = oslcResponse.replace(/^\[|\]$/g, '');
      oslcResponse = initialOslcResponse + oslcResponse + finalresponse;
      setLoading(false);
      console.log(oslcResponse);
      respondWithPostMessage(oslcResponse);
    } else if (value.length > 1) {
      const initialOslcResponse = 'oslc-response:{ "oslc:results": [';
      let oslcResponse = '';
      const finalresponse = ']}';

      for (let i = 0; i < value.length; i++) {
        let resultsPart = value[i];
        // Extract the contents of the square brackets
        if (Array.isArray(resultsPart)) {
          resultsPart = resultsPart[0];
        }
        const url = resultsPart['rdf:resource'];
        const subStr = '/component/';
        const index = url.indexOf(subStr);
        let resourceId = '';
        if (index !== -1) {
          let path = resultsPart['koatl:apiPath'];
          path = path.replaceAll(' ', '%2520');
          path = path.replaceAll('/', '%252F');
          await fetch(
            `https://gitlab-oslc-api-dev.koneksys.com/rest/v2/provider/${projectId}/file/${path}?branch_name=${branchId}`,
            {
              headers: {
                Authorization: `Bearer ${authCtx.token}`,
              },
            },
          )
            .then((response) => response.json())
            .then((data) => {
              // Assign the decoded data to fileCode
              const res = data.split('-');
              resourceId = res[0];
            });
        }
        resultsPart['oslc:content'] = '';
        resultsPart['oslc:contentLine'] = '';
        resultsPart['oslc:providerId'] = projectId;
        resultsPart['oslc:resourceType'] = 'RepositoryFileBlockOfCodeSelection';
        resultsPart['oslc:resourceId'] = resourceId;
        resultsPart['oslc:selectedLines'] = '';
        resultsPart['oslc:branchName'] = branchId;
        resultsPart['oslc:api'] = 'gitlab';
        resultsPart = JSON.stringify(resultsPart);
        oslcResponse += `${resultsPart}`;

        if (i < value.length - 1) {
          oslcResponse += ', ';
        }
      }

      oslcResponse = oslcResponse.replace(/^\[|\]$/g, '');
      oslcResponse = initialOslcResponse + oslcResponse + finalresponse;
      setLoading(false);
      console.log(oslcResponse);
      respondWithPostMessage(oslcResponse);
    } else {
      const initialOslcResponse = 'oslc-response:{ "oslc:results": [';
      let oslcResponse = '';
      const finalresponse = ']}';
      let resultsPart = value;

      // Extract the contents of the square brackets
      if (Array.isArray(resultsPart)) {
        resultsPart = resultsPart[0];
      }
      const url = resultsPart['rdf:resource'];
      const subStr = '/component/';
      const index = url.indexOf(subStr);
      let resourceType = '';
      let resourceId = '';
      if (index !== -1) {
        const result = url.substring(index + subStr.length);
        const values = result.split('/');
        resourceType = values[4];
        let path = resultsPart['koatl:apiPath'];
        path = path.replaceAll(' ', '%2520');
        path = path.replaceAll('/', '%252F');
        await fetch(
          `https://gitlab-oslc-api-dev.koneksys.com/rest/v2/provider/${projectId}/file/${path}?branch_name=${branchId}`,
          {
            headers: {
              Authorization: `Bearer ${authCtx.token}`,
            },
          },
        )
          .then((response) => response.json())
          .then((data) => {
            // Assign the decoded data to fileCode
            const res = data.split('-');
            resourceId = res[0];
          });
      }
      resultsPart['oslc:content'] = '';
      resultsPart['oslc:contentLine'] = '';
      resultsPart['oslc:providerId'] = projectId;
      resultsPart['oslc:resourceType'] = resourceType;
      resultsPart['oslc:resourceId'] = resourceId;
      resultsPart['oslc:selectedLines'] = '';
      resultsPart['oslc:branchName'] = branchId;
      resultsPart['oslc:api'] = 'gitlab';
      resultsPart = JSON.stringify(resultsPart);
      oslcResponse += `${resultsPart}`;

      oslcResponse = oslcResponse.replace(/^\[|\]$/g, '');
      oslcResponse = initialOslcResponse + oslcResponse + finalresponse;
      setLoading(false);
      console.log(oslcResponse);
      respondWithPostMessage(oslcResponse);
    }
  };

  // Function to send cancel response
  function sendCancelResponse() {
    const oslcResponse = 'oslc-response:{ "oslc:results": [ ]}';
    console.log(oslcResponse);
    if (window.location.hash === '#oslc-core-windowName-1.0') {
      // Window Name protocol in use
      respondWithWindowName(oslcResponse);
    } else if (window.location.hash === '#oslc-core-postMessage-1.0') {
      // Post Message protocol in use
      respondWithPostMessage(oslcResponse);
    }
  }

  // Function to respond with Window Name protocol
  function respondWithWindowName(response) {
    const returnURL = window.name;
    window.name = response;
    window.location.href = returnURL;
  }

  // Function to respond with Post Message protocol
  function respondWithPostMessage(response) {
    if (window.parent != null) {
      window.parent.postMessage(response, '*');
    } else {
      window.postMessage(response, '*');
    }
  }

  // Function to handle cancel
  function cancel() {
    sendCancelResponse();
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
