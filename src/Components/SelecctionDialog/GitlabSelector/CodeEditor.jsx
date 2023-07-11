/* eslint-disable max-len */
import React, { useEffect, useRef, useCallback, useState, useContext } from 'react';
import Editor from '@monaco-editor/react';
import hljs from 'highlight.js';
import SelectionAuthContext from '../../../Store/SelectionAuthContext';

const CodeEditor = ({ code, fileExtension, setSelectedCodes, projectId, branchId }) => {
  const [fileCode, setFileCode] = useState('');
  const [ext, setExt] = useState('');
  const [loading, setLoading] = useState(true);
  const authCtx = useContext(SelectionAuthContext);
  const editorOptions = {
    readOnly: true,
    loading: loading,
  };
  const getLanguageFromExtension = (extension) => {
    // Remove the leading dot if present
    const language = hljs.getLanguage(extension);
    return language ? language.name : 'XML';
  };
  const editorRef = useRef(null);
  useEffect(() => {
    if (code?.value && projectId && branchId) {
      setLoading(true);
      setExt(getLanguageFromExtension(fileExtension).toLowerCase());
      let joinedFilePath = code?.value?.replaceAll('/', '%252F');
      fetch(
        `https://gitlab-oslc-api-dev.koneksys.com/rest/v2/provider/${projectId}/file/${joinedFilePath}?branch_name=${branchId}`,
        {
          headers: {
            Authorization: `Bearer ${authCtx.token}`,
          },
        },
      )
        .then((response) => response.json())
        .then((data) => {
          let fileInfo = data.split('-');
          let decode = window.atob(fileInfo[1]);
          setFileCode(decode);
          setLoading(false); // Assign the decoded data to fileCode
        });
    }
  }, [code, authCtx, projectId, branchId, fileExtension, ext]);
  const handleCursorSelectionChange = useCallback(() => {
    const editor = editorRef.current;
    if (editor) {
      const selection = editor.getSelection();

      // Process the selected code and line numbers
      const startLineNumber = selection.startLineNumber;
      const startColumn = selection.startColumn;
      const endLineNumber = selection.endLineNumber;
      const endColumn = selection.endColumn;

      // Calculate the start and end positions based on the range
      const model = editor.getModel();
      const startOffset = model.getOffsetAt({
        lineNumber: startLineNumber,
        column: startColumn,
      });
      const endOffset = model.getOffsetAt({
        lineNumber: endLineNumber,
        column: endColumn,
      });
      const startPosition = model.getPositionAt(startOffset);
      const endPosition = model.getPositionAt(endOffset);

      const selectedCodeWithLineNumbers = {
        startLineNumber: startPosition.lineNumber,
        endLineNumber: endPosition.lineNumber,
        code: editor.getModel().getValueInRange(selection),
      };
      setSelectedCodes(selectedCodeWithLineNumbers);
    }
  }, [setSelectedCodes]);

  useEffect(() => {
    const interval = setInterval(() => {
      handleCursorSelectionChange();
    }, 300);

    return () => clearInterval(interval);
  }, [handleCursorSelectionChange]);
  return (
    <div>
      <Editor
        height="360px"
        theme="light"
        language={ext}
        value={fileCode}
        options={editorOptions}
        onMount={(editor) => {
          editorRef.current = editor;
        }}
      />
    </div>
  );
};

export default CodeEditor;
