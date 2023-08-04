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
  // fetchGetData,
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
  {
    header: 'Application',
    key: 'application_name',
  },
  {
    header: 'Integration',
    key: 'service_provider_id',
  },
];

const { StringType } = Schema.Types;

const model = Schema.Model({
  name: StringType().isRequired('This field is required.'),
  trigger_endpoint: StringType().isRequired('This field is required.'),
  description: StringType().isRequired('This field is required.'),
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
    trigger_endpoint: '',
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
    if (!eventFormRef.current.check()) {
      console.error('Form Error', formError);
      return;
    } else if (isAdminEditing) {
      const putUrl = `${lmApiUrl}/events/${editData?.id}`;
      dispatch(
        fetchUpdateData({
          url: putUrl,
          token: authCtx.token,
          bodyData: formValue,
          showNotification: showNotification,
        }),
      );
    } else {
      const postUrl = `${lmApiUrl}/events`;
      dispatch(
        fetchCreateData({
          url: postUrl,
          token: authCtx.token,
          bodyData: formValue,
          message: 'event',
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
      name: '',
      trigger_endpoint: '',
      description: '',
    });
  };

  // get all events
  const {
    data: allEvents,
    // isLoading: createLoading,
    refetch: refetchEvents,
  } = useQuery(
    ['events'],
    () =>
      fetchAPIRequest({
        urlPath: `events?page=${currPage}&per_page=${pageSize}`,
        token: authCtx.token,
        method: 'GET',
        showNotification: showNotification,
      }),
    {
      onSuccess(allEvents) {
        for (let i = 0; i < allEvents.items.length; i++) {
          allEvents.items[i]['application_name'] =
            allEvents.items[i].associations.application.name;
          allEvents.items[i]['service_provider_id'] =
            allEvents.items[i].associations.service_provider_id;
        }
      },
    },
  );

  // get all events
  useEffect(() => {
    dispatch(handleCurrPageTitle('Events'));
    refetchEvents();
  }, [isCreated, isUpdated, isDeleted, pageSize, currPage, refreshData]);

  // useEffect(() => {
  //   dispatch(handleCurrPageTitle('Events'));

  //   const getUrl = `${lmApiUrl}/events?page=${currPage}&per_page=${pageSize}`;
  //   dispatch(
  //     fetchGetData({
  //       url: getUrl,
  //       token: authCtx.token,
  //       stateName: 'allEvents',
  //       showNotification: showNotification,
  //     }),
  //   );
  // }, [isCreated, isUpdated, isDeleted, pageSize, currPage, refreshData]);

  // handle delete event
  const handleDelete = (data) => {
    setDeleteData(data);
    setOpen(true);
  };
  const handleConfirmed = (value) => {
    if (value) {
      const deleteUrl = `${lmApiUrl}/events/${deleteData?.id}`;
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
      trigger_endpoint: data?.trigger_endpoint,
      description: data?.description,
      application_id: data?.application_id,
      association_id: data?.association_id,
      // association_name:
    });
    // console.log(data.association_id)
    // console.log(data)
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

  // const treedata = crudData?.allEvents?.items.map((item) => {
  //   return { label: item.name, value: item.name, isFolder: true, children: [] };
  // });
  // {
  //   limits: [3, 3, 4],
  //   labels: (layer, value, faker) => {
  //     const methodName = ['jobArea', 'jobType', 'firstName'];
  //     return faker.person[methodName[layer]]();
  //   },
  //
  //   Array(5) [Object,
  //   Object,
  //   Object,
  //   Object,
  //   Object]
  //
  //
  // {
  //   "label": "Embedded Software",
  //   "value": "Embedded Software",
  //   "isFolder": "true",
  //   "children": [],
  //   "oslc:label": "Embedded Software",
  //   "rdf:type": "http://open-services.net/ns/scm#RepositoryTree",
  //   "koatl:apiPath": "Embedded Software",
  //   "oslc:providerId": "42854970",
  //   "oslc:resourceType": "files",
  //   "oslc:resourceId": "f921876d132d886e141e3a62a408cc0efcec9f52",
  //   "oslc:branchName": "main",
  //   "oslc:api": "gitlab"
  // }
  //
  //
  // };
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
              <FlexboxGrid.Item style={{ margin: '30px 0' }} colspan={24}>
                <SelectField
                  name="application_id"
                  label="Application"
                  placeholder="Select Application"
                  accepter={CustomReactSelect}
                  apiURL={`${lmApiUrl}/application`}
                  error={formError.application_id}
                  reqText="Application Id is required"
                />
              </FlexboxGrid.Item>
              <FlexboxGrid.Item style={{ margin: '30px 0' }} colspan={24}>
                <SelectField
                  name="association_id"
                  label="Integration"
                  placeholder="Select Integration"
                  accepter={CustomReactSelect}
                  apiURL={`${lmApiUrl}/association`}
                  error={formError.association_id}
                  reqText="Integration Id is required"
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
      {/* confirmation modal  */}
      <AlertModal
        open={open}
        setOpen={setOpen}
        content={'Do you want to delete the event?'}
        handleConfirmed={handleConfirmed}
      />
      <AdminDataTable props={tableProps} />
      {/* {treedata && <Tree data={treedata} getChildren={{}}></Tree>} */}
    </div>
  );
};

export default Events;
