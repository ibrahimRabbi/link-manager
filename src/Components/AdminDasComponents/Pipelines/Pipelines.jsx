import React, { useState, useContext, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchPipelines,
  fetchCreatePipeline,
  fetchUpdatePipeline,
  fetchDeletePipeline,
  fetchPipelineScript,
} from '../../../Redux/slices/pipelineSlice';
import AuthContext from '../../../Store/Auth-Context';
import {
  handleCurrPageTitle,
  handleIsAddNewModal,
  handleIsAdminEditing,
} from '../../../Redux/slices/navSlice';
import AddNewModal from '../AddNewModal';
import AdminDataTable from '../AdminDataTable';
import {
  FlexboxGrid,
  Form,
  Uploader,
  Loader,
  Schema,
  Message,
  toaster,
  Drawer,
} from 'rsuite';
import Editor from '@monaco-editor/react';
import TextField from '../TextField';
import { useRef } from 'react';
import SelectField from '../SelectField.jsx';
import CustomReactSelect from '../../Shared/Dropdowns/CustomReactSelect';
import AlertModal from '../../Shared/AlertModal';

const lmApiUrl = import.meta.env.VITE_LM_REST_API_URL;

// demo data
const headerData = [
  {
    header: 'Script',
    key: 'filename',
  },
  {
    header: 'Event',
    key: 'event_name',
  },
];

const { ObjectType, StringType, NumberType } = Schema.Types;

const Pipelines = () => {
  const {
    allPipelines,
    pipelineScript,
    isPipelineLoading,
    isPipelineCreated,
    isPipelineUpdated,
    isPipelineDeleted,
  } = useSelector((state) => state.pipelines);

  const { refreshData, isAdminEditing } = useSelector((state) => state.nav);

  const model = Schema.Model({
    event_id: NumberType().isRequired('Event is required.'),
    script_path: isAdminEditing
      ? ObjectType()
      : ObjectType().isRequired('Please upload a file.'),
    filename: StringType(),
  });

  const [currPage, setCurrPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [formError, setFormError] = useState({});
  const [editData, setEditData] = useState({});
  const [formValue, setFormValue] = useState({
    event_id: 0,
    script_path: null,
    filename: '',
  });
  const [open, setOpen] = useState(false);
  const [deleteData, setDeleteData] = useState({});
  const { isDark } = useSelector((state) => state.nav);
  const [openWithHeader, setOpenWithHeader] = useState(false);
  const [scriptTitle, setscriptTitle] = useState('');
  const showNotification = (type, message) => {
    if (type && message) {
      const messages = (
        <Message closable showIcon type={type}>
          {message}
        </Message>
      );
      toaster.push(messages, { placement: 'bottomCenter', duration: 5000 });
    }
  };
  const pipelineFormRef = useRef();
  const authCtx = useContext(AuthContext);
  const dispatch = useDispatch();
  const organization_id = authCtx.organization_id;
  // Pagination
  const handlePagination = (value) => {
    setCurrPage(value);
  };

  const handleChangeLimit = (dataKey) => {
    setCurrPage(1);
    setPageSize(dataKey);
  };

  // handle open add pipeline modal
  const handleAddNew = () => {
    handleResetForm();
    dispatch(handleIsAddNewModal(true));
  };

  const handleAddLinkPipeline = () => {
    const bodyData = {
      event_id: formValue.event_id,
      script_path: formValue.script_path,
      filename: formValue.filename,
    };

    if (!pipelineFormRef.current.check()) {
      return;
    } else if (isAdminEditing) {
      const putUrl = `${lmApiUrl}/${organization_id}/pipeline/${editData?.id}`;
      dispatch(
        fetchUpdatePipeline({
          url: putUrl,
          token: authCtx.token,
          bodyData: bodyData,
          showNotification: showNotification,
        }),
      );
    } else {
      const postUrl = `${lmApiUrl}/${organization_id}/pipeline`;
      dispatch(
        fetchCreatePipeline({
          url: postUrl,
          token: authCtx.token,
          bodyData: bodyData,
          message: 'pipeline',
          showNotification: showNotification,
        }),
      );
    }
    dispatch(handleIsAddNewModal(false));
    if (isAdminEditing) dispatch(handleIsAdminEditing(false));
  };

  // reset form
  const handleResetForm = () => {
    setEditData({});
    setFormValue({
      event_id: 0,
      script_path: null,
      filename: '',
    });
  };

  useEffect(() => {
    dispatch(handleCurrPageTitle('Pipeline Configuration'));
    /* eslint-disable max-len */
    const getUrl = `${lmApiUrl}/${organization_id}/pipeline?page=${currPage}&per_page=${pageSize}`;
    dispatch(
      fetchPipelines({
        url: getUrl,
        token: authCtx.token,
        authCtx: authCtx,
        showNotification: showNotification,
      }),
    );
  }, [
    isPipelineCreated,
    isPipelineUpdated,
    isPipelineDeleted,
    pageSize,
    currPage,
    refreshData,
  ]);

  /* eslint-disable indent */

  const data = !allPipelines.items
    ? []
    : allPipelines.items.map((pipeline) => {
        return {
          id: pipeline.id,
          event_name: pipeline.event.name,
          filename: pipeline.filename,
        };
      });

  // handle delete pipeline
  const handleDelete = (data) => {
    setDeleteData(data);
    setOpen(true);
  };
  const handleConfirmed = (value) => {
    if (value) {
      const deleteUrl = `${lmApiUrl}/${organization_id}/pipeline/${deleteData?.id}`;
      dispatch(
        fetchDeletePipeline({
          url: deleteUrl,
          token: authCtx.token,
          showNotification: showNotification,
        }),
      );
    }
  };

  // handle Edit Pipeline
  const handleEdit = (data) => {
    setEditData(data);
    dispatch(handleIsAdminEditing(true));
    setFormValue({
      event_id: data?.event_id,
      script_path: null,
      filename: data?.filename,
    });
    dispatch(handleIsAddNewModal(true));
  };

  const handleScriptView = (data) => {
    const getScriptUrl = `${lmApiUrl}/${organization_id}/pipeline/${data?.id}/script`;
    dispatch(
      fetchPipelineScript({
        url: getScriptUrl,
        token: authCtx.token,
        showNotification: showNotification,
      }),
      setscriptTitle(data.filename),
      setOpenWithHeader(true),
    );
  };

  // send props in the batch action table
  const tableProps = {
    title: 'Pipelines',
    rowData: data?.length ? data : [],
    headerData,
    handleEdit,
    handleDelete,
    handleAddNew,
    handlePagination,
    handleChangeLimit,
    handleScriptView,
    totalItems: allPipelines?.total_items,
    totalPages: allPipelines?.total_pages,
    pageSize,
    page: allPipelines?.page,
    inpPlaceholder: 'Search Pipelines',
  };

  return (
    <div>
      <AddNewModal
        title={isAdminEditing ? 'Edit Pipeline' : 'Add New Pipeline'}
        handleSubmit={handleAddLinkPipeline}
        handleReset={handleResetForm}
      >
        <div className="show-grid">
          <Form
            fluid
            ref={pipelineFormRef}
            onChange={setFormValue}
            onCheck={setFormError}
            formValue={formValue}
            model={model}
          >
            <FlexboxGrid justify="space-between">
              <FlexboxGrid.Item style={{ marginBottom: '25px' }} colspan={24}>
                <SelectField
                  placeholder="Select Event"
                  name="event_id"
                  label="Event"
                  accepter={CustomReactSelect}
                  apiURL={`${lmApiUrl}/${organization_id}/events`}
                  error={formError.event_id}
                  reqText="Event is required"
                />
              </FlexboxGrid.Item>

              <FlexboxGrid.Item colspan={24}>
                <TextField
                  action=""
                  name="script_path"
                  label="Script Path"
                  defaultFileList={
                    formValue.filename !== ''
                      ? [{ fileKey: formValue.script_path, name: formValue.filename }]
                      : []
                  }
                  reqText="File is required"
                  autoUpload={false}
                  accepter={Uploader}
                />
              </FlexboxGrid.Item>
            </FlexboxGrid>
          </Form>
        </div>
      </AddNewModal>

      {isPipelineLoading && (
        <Loader
          backdrop
          center
          size="md"
          vertical
          content="Loading"
          style={{ zIndex: '10' }}
        />
      )}
      {/* confirmation modal  */}
      <AlertModal
        open={open}
        setOpen={setOpen}
        content={'Do you want to delete the pipeline?'}
        handleConfirmed={handleConfirmed}
      />
      <Drawer open={openWithHeader} onClose={() => setOpenWithHeader(false)}>
        <Drawer.Header>
          <Drawer.Title>
            <p
              style={{
                marginTop: '5px',
                fontSize: '19px',
                fontWeight: 'bold',
              }}
            >
              {scriptTitle}
            </p>
          </Drawer.Title>
        </Drawer.Header>
        <Drawer.Body>
          <Editor
            height="80vh"
            defaultLanguage="python"
            defaultValue={pipelineScript}
            theme={isDark === 'dark' ? 'vs-dark' : 'light'}
          />
        </Drawer.Body>
      </Drawer>
      <AdminDataTable props={tableProps} />
    </div>
  );
};

export default Pipelines;
