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
import { FlexboxGrid, Form, Loader, Message, Schema, toaster } from 'rsuite';
import TextField from '../TextField';
import { useRef } from 'react';
import TextArea from '../TextArea';
import {
  fetchCreateData,
  fetchDeleteData,
  fetchUpdateData,
} from '../../../Redux/slices/useCRUDSlice';
import { useQuery } from '@tanstack/react-query';
import SelectField from '../SelectField.jsx';
import fetchAPIRequest from '../../../apiRequests/apiRequest';
import CustomReactSelect from '../../Shared/Dropdowns/CustomReactSelect';
import AlertModal from '../../Shared/AlertModal';

const lmApiUrl = import.meta.env.VITE_LM_REST_API_URL;

// demo data
const headerData = [
  {
    header: 'Name',
    key: 'name',
  },
  {
    header: 'Description',
    key: 'description',
  },
  {
    header: 'Organization',
    key: 'organization_name',
  },
  {
    header: 'Application',
    key: 'application_name',
  },
  {
    header: 'Trigger Endpoint',
    key: 'trigger_endpoint',
  },
];

const { StringType, NumberType } = Schema.Types;

const model = Schema.Model({
  name: StringType().isRequired('This field is required.'),
  description: StringType().isRequired('This field is required.'),
  application_id: NumberType().isRequired('This field is required.'),
});

const Events = () => {
  const { isCreated, isDeleted, isUpdated, isCrudLoading } = useSelector(
    (state) => state.crud,
  );

  const { refreshData, isAdminEditing } = useSelector((state) => state.nav);

  const [currPage, setCurrPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [formError, setFormError] = useState({});
  const [editData, setEditData] = useState({});
  const [formValue, setFormValue] = useState({
    name: '',
    application_id: '',
    description: '',
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
    const bodyData = {
      name: formValue.name,
      application_id: formValue.application_id,
      description: formValue.description,
    };

    if (!eventFormRef.current.check()) {
      console.error('Form Error', formError);
      return;
    } else if (isAdminEditing) {
      const putUrl = `${lmApiUrl}/${authCtx.organization_id}/events/${editData?.id}`;
      dispatch(
        fetchUpdateData({
          url: putUrl,
          token: authCtx.token,
          bodyData: bodyData,
          showNotification: showNotification,
        }),
      );
    } else {
      const postUrl = `${lmApiUrl}/${authCtx.organization_id}/events`;
      dispatch(
        fetchCreateData({
          url: postUrl,
          token: authCtx.token,
          bodyData: bodyData,
          message: 'event',
          showNotification: showNotification,
        }),
      );
    }
    dispatch(handleIsAddNewModal(false));
    if (isAdminEditing) dispatch(handleIsAdminEditing(false));
    refetchEvents();
  };

  // reset form
  const handleResetForm = () => {
    setEditData({});
    setFormValue({
      name: '',
      description: '',
      application_id: '',
    });
  };

  // get all events
  const { data: allEvents, refetch: refetchEvents } = useQuery(
    ['events'],
    () =>
      fetchAPIRequest({
        // eslint-disable-next-line max-len
        urlPath: `${authCtx.organization_id}/events?page=${currPage}&per_page=${pageSize}`,
        token: authCtx.token,
        method: 'GET',
        showNotification: showNotification,
      }),
    {
      onSuccess(allEvents) {
        for (let i = 0; i < allEvents.items.length; i++) {
          allEvents.items[i]['application_name'] = allEvents.items[i].application.name;
          allEvents.items[i]['organization_name'] = allEvents.items[i].organization.name;
        }
      },
    },
  );

  // get all events
  useEffect(() => {
    dispatch(handleCurrPageTitle('Event Configuration'));
    refetchEvents();
  }, [isCreated, isUpdated, isDeleted, pageSize, currPage, refreshData]);

  // handle delete event
  const handleDelete = (data) => {
    setDeleteData(data);
    setOpen(true);
  };
  const handleConfirmed = (value) => {
    if (value) {
      const deleteUrl = `${lmApiUrl}/${authCtx.organization_id}/events/${deleteData?.id}`;
      dispatch(
        fetchDeleteData({
          url: deleteUrl,
          token: authCtx.token,
          showNotification: showNotification,
        }),
      );
    }
  };
  // handle Edit Event
  const handleEdit = (data) => {
    setEditData(data);
    dispatch(handleIsAdminEditing(true));
    setFormValue({
      name: data?.name,
      description: data?.description,
      application_id: data?.application_id,
    });
    dispatch(handleIsAddNewModal(true));
  };

  // send props in the batch action table
  const tableProps = {
    title: 'Events',
    rowData: allEvents?.items?.length ? allEvents?.items : [],
    headerData,
    handleEdit,
    handleDelete,
    handleAddNew,
    handlePagination,
    handleChangeLimit,
    totalItems: allEvents?.total_items,
    totalPages: allEvents?.total_pages,
    pageSize,
    page: allEvents?.page,
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
              <FlexboxGrid.Item colspan={11}>
                <TextField name="name" label="Name" reqText="Name is required" />
              </FlexboxGrid.Item>

              <FlexboxGrid.Item colspan={11}>
                <SelectField
                  name="application_id"
                  label="Application"
                  placeholder="Select Application"
                  accepter={CustomReactSelect}
                  apiURL={`${lmApiUrl}/${authCtx.organization_id}/application`}
                  apiQueryParams={'events=true'}
                  error={formError.application_id}
                  reqText="Application Id is required"
                />
              </FlexboxGrid.Item>

              <FlexboxGrid.Item colspan={24} style={{ marginTop: '25px' }}>
                <TextField
                  name="description"
                  label="Description"
                  accepter={TextArea}
                  rows={3}
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
      {/* confirmation modal  */}
      <AlertModal
        open={open}
        setOpen={setOpen}
        content={'Do you want to delete the event?'}
        handleConfirmed={handleConfirmed}
      />
      <AdminDataTable props={tableProps} />
    </div>
  );
};

export default Events;
