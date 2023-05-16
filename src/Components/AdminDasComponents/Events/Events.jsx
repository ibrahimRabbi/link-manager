import React, { useState, useContext, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import AuthContext from '../../../Store/Auth-Context';
import {
  handleCurrPageTitle,
  handleIsAddNewModal,
  handleIsAdminEditing,
} from '../../../Redux/slices/navSlice';
import AddNewModal from '../AddNewModal';
import AdminDataTable from '../AdminDataTable';
import { FlexboxGrid, Form, Loader, Schema } from 'rsuite';
import TextField from '../TextField';
import { useRef } from 'react';
import TextArea from '../TextArea';
import Swal from 'sweetalert2';
import {
  fetchCreateData,
  fetchDeleteData,
  fetchGetData,
  fetchUpdateData,
} from '../../../Redux/slices/useCRUDSlice';

const lmApiUrl = process.env.REACT_APP_LM_REST_API_URL;

// demo data
const headerData = [
  {
    header: 'ID',
    key: 'id',
  },
  {
    header: 'Name',
    key: 'name',
  },
  {
    header: 'Trigger Endpoint',
    key: 'trigger_endpoint',
  },
  {
    header: 'Description',
    key: 'description',
  },
];

const { StringType } = Schema.Types;

const model = Schema.Model({
  name: StringType().isRequired('This field is required.'),
  trigger_endpoint: StringType().isRequired('This field is required.'),
  description: StringType().isRequired('This field is required.'),
});

const Events = () => {
  const { crudData, isCreated, isDeleted, isUpdated, isCrudLoading } = useSelector(
    (state) => state.crud,
  );

  const { refreshData, isAdminEditing } = useSelector((state) => state.nav);

  const [currPage, setCurrPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [formError, setFormError] = useState({});
  const [editData, setEditData] = useState({});
  const [formValue, setFormValue] = useState({
    name: '',
    trigger_endpoint: '',
    description: '',
  });

  const eventFormRef = useRef();
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

  // handle open add event modal
  const handleAddNew = () => {
    handleResetForm();
    dispatch(handleIsAddNewModal(true));
  };

  const handleAddLinkEvent = () => {
    if (!eventFormRef.current.check()) {
      console.error('Form Error', formError);
      return;
    } else if (isAdminEditing) {
      const putUrl = `${lmApiUrl}/pipelines/event/${editData?.id}`;
      dispatch(
        fetchUpdateData({
          url: putUrl,
          token: authCtx.token,
          bodyData: formValue,
        }),
      );
    } else {
      const postUrl = `${lmApiUrl}/pipelines/event`;
      dispatch(
        fetchCreateData({
          url: postUrl,
          token: authCtx.token,
          bodyData: formValue,
          message: 'event',
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
      name: '',
      trigger_endpoint: '',
      description: '',
    });
  };

  useEffect(() => {
    dispatch(handleCurrPageTitle('Events'));

    const getUrl = `${lmApiUrl}/pipelines/event?page=${currPage}&per_page=${pageSize}`;
    dispatch(
      fetchGetData({
        url: getUrl,
        token: authCtx.token,
        stateName: 'allEvents',
      }),
    );
  }, [isCreated, isUpdated, isDeleted, pageSize, currPage, refreshData]);

  // handle delete event
  const handleDelete = (data) => {
    Swal.fire({
      title: 'Are you sure',
      icon: 'info',
      text: 'Do you want to delete the Event!!',
      cancelButtonColor: 'red',
      showCancelButton: true,
      confirmButtonText: 'Delete',
      confirmButtonColor: '#3085d6',
      reverseButtons: true,
    }).then((value) => {
      if (value.isConfirmed) {
        const deleteUrl = `${lmApiUrl}/pipelines/event/${data?.id}`;
        dispatch(fetchDeleteData({ url: deleteUrl, token: authCtx.token }));
      }
    });
  };

  // handle Edit Event
  const handleEdit = (data) => {
    setEditData(data);
    dispatch(handleIsAdminEditing(true));
    setFormValue({
      name: data?.name,
      trigger_endpoint: data?.trigger_endpoint,
      description: data?.description,
    });
    dispatch(handleIsAddNewModal(true));
  };

  // send props in the batch action table
  const tableProps = {
    title: 'Events',
    rowData: crudData?.allEvents?.items?.length ? crudData?.allEvents?.items : [],
    headerData,
    handleEdit,
    handleDelete,
    handleAddNew,
    handlePagination,
    handleChangeLimit,
    totalItems: crudData?.allEvents?.total_items,
    totalPages: crudData?.allEvents?.total_pages,
    pageSize,
    page: crudData?.allEvents?.page,
    inpPlaceholder: 'Search Events',
  };

  return (
    <div>
      <AddNewModal
        title={isAdminEditing ? 'Edit Event' : 'Add New Event'}
        handleSubmit={handleAddLinkEvent}
        handleReset={handleResetForm}
      >
        <div className="show-grid">
          <Form
            fluid
            ref={eventFormRef}
            onChange={setFormValue}
            onCheck={setFormError}
            formValue={formValue}
            model={model}
          >
            <FlexboxGrid justify="space-between">
              <FlexboxGrid.Item colspan={24}>
                <TextField name="name" label="Name" reqText="Name is required" />
              </FlexboxGrid.Item>

              <FlexboxGrid.Item style={{ margin: '30px 0' }} colspan={24}>
                <TextField
                  name="trigger_endpoint"
                  label="Trigger Endpoint"
                  reqText="Trigger Endpoint is required"
                />
              </FlexboxGrid.Item>

              <FlexboxGrid.Item colspan={24} style={{ marginBottom: '10px' }}>
                <TextField
                  name="description"
                  label="Description"
                  accepter={TextArea}
                  rows={5}
                  reqText="Description is required"
                />
              </FlexboxGrid.Item>
            </FlexboxGrid>
          </Form>
        </div>
      </AddNewModal>

      {isCrudLoading && (
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

export default Events;