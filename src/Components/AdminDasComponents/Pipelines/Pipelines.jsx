import React, { useState, useContext, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchPipelines,
  fetchCreatePipeline,
  fetchUpdatePipeline,
  fetchDeletePipeline,
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
  // Toggle,
  Loader,
  Schema,
  Message,
  toaster,
} from 'rsuite';
import TextField from '../TextField';
import { useRef } from 'react';
import SelectField from '../SelectField.jsx';
import CustomReactSelect from '../../Shared/Dropdowns/CustomReactSelect';
import AlertModal from '../../Shared/AlertModal';

const lmApiUrl = import.meta.env.VITE_LM_REST_API_URL;

// demo data
const headerData = [
  {
    header: 'ID',
    key: 'id',
  },
  {
    header: 'Script',
    key: 'filename',
  },
  // {
  //   header: 'Polling Period',
  //   key: 'polling_period',
  // },
  // {
  //   header: 'Is Polling?',
  //   key: 'is_polling',
  // },
];

const {
  ObjectType,
  StringType,
  // BooleanType,
  NumberType,
} = Schema.Types;

const Pipelines = () => {
  const {
    allPipelines,
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
    // is_polling: BooleanType().isRequired('This field is required.'),
    // polling_period: NumberType().isRequired('This field is required.'),
  });

  const [currPage, setCurrPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [formError, setFormError] = useState({});
  const [editData, setEditData] = useState({});
  const [formValue, setFormValue] = useState({
    event_id: 0,
    script_path: null,
    filename: '',
    // is_polling: false,
    // polling_period: 0,
  });
  const [open, setOpen] = useState(false);
  const [deleteData, setDeleteData] = useState({});
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
    if (!pipelineFormRef.current.check()) {
      console.error('Form Error', formError);
      return;
    } else if (isAdminEditing) {
      const putUrl = `${lmApiUrl}/pipelines/${editData?.id}`;
      dispatch(
        fetchUpdatePipeline({
          url: putUrl,
          token: authCtx.token,
          bodyData: formValue,
          showNotification: showNotification,
        }),
      );
    } else {
      const postUrl = `${lmApiUrl}/pipelines`;
      dispatch(
        fetchCreatePipeline({
          url: postUrl,
          token: authCtx.token,
          bodyData: formValue,
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
      // is_polling: false,
      // polling_period: 0,
    });
  };

  useEffect(() => {
    dispatch(handleCurrPageTitle('Pipelines'));

    const getUrl = `${lmApiUrl}/pipelines?page=${currPage}&per_page=${pageSize}`;
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

  // handle delete pipeline
  const handleDelete = (data) => {
    setDeleteData(data);
    setOpen(true);
  };
  const handleConfirmed = (value) => {
    if (value) {
      const deleteUrl = `${lmApiUrl}/pipelines/${deleteData?.id}`;
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
      // is_polling: data?.is_polling ? data?.is_polling : false,
      // polling_period: data?.polling_period,
    });
    dispatch(handleIsAddNewModal(true));
  };

  // send props in the batch action table
  const tableProps = {
    title: 'Pipelines',
    rowData: allPipelines?.items?.length ? allPipelines?.items : [],
    headerData,
    handleEdit,
    handleDelete,
    handleAddNew,
    handlePagination,
    handleChangeLimit,
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
              <FlexboxGrid.Item style={{ margin: '30px 0' }} colspan={24}>
                <SelectField
                  placeholder="Select Event"
                  name="event_id"
                  label="Event"
                  accepter={CustomReactSelect}
                  apiURL={`${lmApiUrl}/events`}
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

              {/* <FlexboxGrid.Item colspan={24}>
                <TextField
                  name="is_polling"
                  label="Is Polling"
                  reqText="Path is required"
                  accepter={Toggle}
                />
              </FlexboxGrid.Item> */}

              {/* <FlexboxGrid.Item colspan={24}>
                <TextField
                  name="polling_period"
                  label="Polling Period"
                  reqText="Polling Period is required"
                />
              </FlexboxGrid.Item> */}
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
      <AdminDataTable props={tableProps} />
    </div>
  );
};

export default Pipelines;
