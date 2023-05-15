import React, { useState, useContext, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchPipelines,
  fetchCreatePipeline,
  //   fetchDeletePipeline,
  //   fetchUpdatePipeline,
} from '../../../Redux/slices/pipelineSlice';
import AuthContext from '../../../Store/Auth-Context';
import {
  handleCurrPageTitle,
  handleIsAddNewModal,
  handleIsAdminEditing,
} from '../../../Redux/slices/navSlice';
import AddNewModal from '../AddNewModal';
import AdminDataTable from '../AdminDataTable';
import { FlexboxGrid, Form, Uploader, Toggle, Loader, Schema } from 'rsuite';
import TextField from '../TextField';
import { useRef } from 'react';
import SelectField from '../SelectField.jsx';
import CustomSelect from '../CustomSelect.jsx';

const lmApiUrl = process.env.REACT_APP_LM_REST_API_URL;

// demo data
const headerData = [
  {
    header: 'ID',
    key: 'id',
  },
  {
    header: 'Script Path',
    key: 'script_path',
  },
  {
    header: 'Polling Period',
    key: 'polling_period',
  },
];

const { ObjectType, BooleanType, NumberType } = Schema.Types;

const model = Schema.Model({
  event_id: NumberType().isRequired('Event is required.'),
  script_path: ObjectType().isRequired('Please upload a file.'),
  is_polling: BooleanType().isRequired('This field is required.'),
  polling_period: NumberType().isRequired('This field is required.'),
});

const Pipelines = () => {
  // eslint-disable-next-line max-len
  const {
    allPipelines,
    isPipelineLoading /*, isPipelineUpdated, isPipelineCreated, isPipelineDeleted*/,
  } = useSelector((state) => state.pipelines);
  const { refreshData, isAdminEditing } = useSelector((state) => state.nav);

  const [currPage, setCurrPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [formError, setFormError] = useState({});
  const [editData, setEditData] = useState({});
  const [formValue, setFormValue] = useState({
    event_id: '',
    script_path: '',
    is_polling: false,
    polling_period: 0,
  });

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
      console.log('putUrl', putUrl);
      //       dispatch(
      //         fetchUpdatePipeline({
      //           url: putUrl,
      //           token: authCtx.token,
      //           bodyData: formValue,
      //         }),
      //       );
    } else {
      const postUrl = `${lmApiUrl}/pipelines`;
      dispatch(
        fetchCreatePipeline({
          url: postUrl,
          token: authCtx.token,
          bodyData: formValue,
          message: 'pipeline',
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
      event_id: '',
      script_path: '',
      is_polling: '',
      polling_period: '',
    });
  };

  useEffect(() => {
    dispatch(handleCurrPageTitle('Pipelines'));

    const getUrl = `${lmApiUrl}/pipelines?page=${currPage}&per_page=${pageSize}`;
    dispatch(fetchPipelines({ url: getUrl, token: authCtx.token }));
    // eslint-disable-next-line max-len
  }, [
    /*isPipelineCreated, isPipelineUpdated, isPipelineDeleted,*/ pageSize,
    currPage,
    refreshData,
  ]);

  //   // handle delete pipeline
  //   const handleDelete = (data) => {
  //     Swal.fire({
  //       title: 'Are you sure',
  //       icon: 'info',
  //       text: 'Do you want to delete the Pipeline!!',
  //       cancelButtonColor: 'red',
  //       showCancelButton: true,
  //       confirmButtonText: 'Delete',
  //       confirmButtonColor: '#3085d6',
  //       reverseButtons: true,
  //     }).then((value) => {
  //       if (value.isConfirmed) {
  //         const deleteUrl = `${lmApiUrl}/pipelines/pipeline/${data?.id}`;
  //         dispatch(fetchDeletePipeline({ url: deleteUrl, token: authCtx.token }));
  //       }
  //     });
  //  };

  //   // handle Edit Pipeline
  //   const handleEdit = (data) => {
  //     setEditData(data);
  //     dispatch(handleIsAdminEditing(true));
  //     setFormValue({
  //       name: data?.name,
  //       trigger_endpoint: data?.trigger_endpoint,
  //       description: data?.description,
  //     });
  //     dispatch(handleIsAddNewModal(true));
  //   };
  //
  // send props in the batch action table
  const tableProps = {
    title: 'Pipelines',
    rowData: allPipelines?.items?.length ? allPipelines?.items : [],
    headerData,
    //     handleEdit,
    //     handleDelete,
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
                  accepter={CustomSelect}
                  apiURL={`${lmApiUrl}/pipelines/event`}
                  error={formError.event_id}
                  reqText="Event is required"
                />
              </FlexboxGrid.Item>

              {/*<Uploader*/}
              {/*  autoUpload={false}*/}
              {/*  listType="picture-text"*/}
              {/*  name="script_path"*/}
              {/*/>*/}

              <FlexboxGrid.Item colspan={24}>
                <TextField
                  name="script_path"
                  label="Script Path"
                  reqText="Path is required"
                  autoUpload={false}
                  accepter={Uploader}
                />
              </FlexboxGrid.Item>

              <FlexboxGrid.Item colspan={24}>
                <TextField
                  name="is_polling"
                  label="Is Polling"
                  reqText="Path is required"
                  accepter={Toggle}
                />
              </FlexboxGrid.Item>

              <FlexboxGrid.Item colspan={24}>
                <TextField
                  name="polling_period"
                  label="Polling Period"
                  reqText="Polling Period is required"
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
      <AdminDataTable props={tableProps} />
    </div>
  );
};

export default Pipelines;
