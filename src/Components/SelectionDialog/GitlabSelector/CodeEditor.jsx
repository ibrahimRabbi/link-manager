/* eslint-disable max-len */
import React, { useEffect, useRef, useCallback, useState, useContext } from 'react';
import Editor from '@monaco-editor/react';
import hljs from 'highlight.js';
import AuthContext from '../../../Store/Auth-Context';

const lmApiUrl = process.env.REACT_APP_LM_REST_API_URL;

const CodeEditor = ({ code, fileExtension, setSelectedCodes, projectId, commitId }) => {
  const [fileCode, setFileCode] = useState('');
  const [ext, setExt] = useState('');
  const [loading, setLoading] = useState(true);
  const authCtx = useContext(AuthContext);
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
    if (code?.value && projectId && commitId) {
      setLoading(true);
      setExt(getLanguageFromExtension(fileExtension).toLowerCase());
      let joinedFilePath = code?.value?.replaceAll('/', '%252F');
      fetch(
        `${lmApiUrl}/third_party/gitlab/container/42854970/file?path=${joinedFilePath}&branch=${commitId}&application_id=219`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${authCtx.token}`,
          },
        },
      )
        .then((response) => response.json())
        .then((data) => {
          let fileInfo = data?.content;
          let decode = window.atob(fileInfo);
          console.log(decode);
          setFileCode(decode);
          setLoading(false); // Assign the decoded data to fileCode
        });
    }
  }, [code, authCtx, projectId, commitId, fileExtension, ext]);
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
