import React, { useState, useContext, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import AuthContext from '../../../Store/Auth-Context';
import {
  handleCurrPageTitle,
  handleIsAddNewModal,
  handleIsAdminEditing,
} from '../../../Redux/slices/navSlice';
import AdminDataTable from '../AdminDataTable';
import AddNewModal from '../AddNewModal';
import { FlexboxGrid, Form, Message, Schema, toaster } from 'rsuite';
import TextField from '../TextField';
import TextArea from '../TextArea';
import UseLoader from '../../Shared/UseLoader';
import { useQuery, useMutation } from '@tanstack/react-query';
import fetchAPIRequest from '../../../apiRequests/apiRequest';
import AlertModal from '../../Shared/AlertModal';

// demo data
const headerData = [
  {
    header: 'Organization',
    key: 'name',
  },
  {
    header: 'Description',
    key: 'description',
  },
];

const { StringType } = Schema.Types;

const model = Schema.Model({
  name: StringType().isRequired('This field is required.'),
  description: StringType(),
});

const Organization = () => {
  const { refreshData, isAdminEditing } = useSelector((state) => state.nav);
  const [currPage, setCurrPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [formError, setFormError] = useState({});
  const [editData, setEditData] = useState({});
  const [deleteData, setDeleteData] = useState({});
  const [formValue, setFormValue] = useState({
    name: '',
    description: '',
  });
  const [open, setOpen] = useState(false);
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
  const authCtx = useContext(AuthContext);
  const dispatch = useDispatch();
  const orgFormRef = React.useRef();

  // get data using react-query
  const {
    data: allOrganizations,
    isLoading,
    refetch: refetchOrganizations,
  } = useQuery(['organization'], () =>
    fetchAPIRequest({
      urlPath: `organization?page=${currPage}&per_page=${pageSize}`,
      token: authCtx.token,
      method: 'GET',
      showNotification: showNotification,
    }),
  );

  // create data using react query
  const {
    isLoading: createLoading,
    isSuccess: createSuccess,
    mutate: createMutate,
  } = useMutation(
    () =>
      fetchAPIRequest({
        urlPath: 'organization',
        token: authCtx.token,
        method: 'POST',
        body: formValue,
        showNotification: showNotification,
      }),
    {
      onSuccess: (value) => {
        showNotification(value?.status, value?.message);
      },
      onError: (value) => {
        console.log(value);
      },
    },
  );

  // update data using react query
  const {
    isLoading: updateLoading,
    isSuccess: updateSuccess,
    mutate: updateMutate,
  } = useMutation(
    () =>
      fetchAPIRequest({
        urlPath: `organization/${editData?.id}`,
        token: authCtx.token,
        method: 'PUT',
        body: formValue,
        showNotification: showNotification,
      }),
    {
      onSuccess: (value) => {
        showNotification(value?.status, value?.message);
      },
      onSettled: (value) => {
        console.log(value);
      },
    },
  );

  // Delete data using react query
  const {
    isLoading: deleteLoading,
    isSuccess: deleteSuccess,
    mutate: deleteMutate,
  } = useMutation(
    () =>
      fetchAPIRequest({
        urlPath: `organization/${deleteData?.id}`,
        token: authCtx.token,
        method: 'DELETE',
        showNotification: showNotification,
      }),
    {
      onSuccess: (value) => {
        console.log(value);
        setDeleteData({});
      },
    },
  );

  // get all organizations
  useEffect(() => {
    dispatch(handleCurrPageTitle('Organizations'));
    refetchOrganizations();
  }, [createSuccess, updateSuccess, deleteSuccess, pageSize, currPage, refreshData]);

  // handle create and update organization
  const handleAddOrg = () => {
    // throw form validation error
    if (!orgFormRef.current.check()) {
      console.error('Form Error', formError);
      return;
    }
    // editing org
    else if (isAdminEditing) {
      updateMutate();
    }
    // creating org
    else {
      createMutate();
    }
    dispatch(handleIsAddNewModal(false));
    if (isAdminEditing) dispatch(handleIsAdminEditing(false));
  };

  // reset form
  const handleResetForm = () => {
    setEditData({});
    setFormValue({
      name: '',
      description: '',
    });
  };

  // Pagination
  const handlePagination = (value) => {
    setCurrPage(value);
  };

  const handleChangeLimit = (dataKey) => {
    setCurrPage(1);
    setPageSize(dataKey);
  };

  // handle open add org modal
  const handleAddNew = () => {
    handleResetForm();
    dispatch(handleIsAddNewModal(true));
  };

  // handle delete Org
  const handleDelete = (data) => {
    setDeleteData(data);
    setOpen(true);
  };
  const handleConfirmed = (value) => {
    if (value) {
      deleteMutate();
    }
  };

  // handle Edit org
  const handleEdit = (data) => {
    setEditData(data);
    dispatch(handleIsAdminEditing(true));
    setFormValue({
      name: data?.name,
      description: data?.description,
    });
    dispatch(handleIsAddNewModal(true));
  };

  // send props in the batch action table
  const tableProps = {
    title: 'Organizations',
    rowData: allOrganizations ? allOrganizations?.items : [],
    headerData,
    handleEdit,
    handleDelete,
    handleAddNew,
    handlePagination,
    handleChangeLimit,
    totalItems: allOrganizations?.total_items,
    totalPages: allOrganizations?.total_pages,
    pageSize,
    page: allOrganizations?.page,
    inpPlaceholder: 'Search Organization',
  };

  return (
    <div>
      <AddNewModal
        title={isAdminEditing ? 'Edit Organization' : 'Add New Organization'}
        handleSubmit={handleAddOrg}
        handleReset={handleResetForm}
      >
        <div className="show-grid">
          <Form
            fluid
            ref={orgFormRef}
            onChange={setFormValue}
            onCheck={setFormError}
            formValue={formValue}
            model={model}
          >
            <FlexboxGrid justify="space-between">
              <FlexboxGrid.Item colspan={24} style={{ marginBottom: '25px' }}>
                <TextField name="name" label="Name" reqText="Name is Required" />
              </FlexboxGrid.Item>

              <FlexboxGrid.Item colspan={24}>
                <TextField
                  name="description"
                  label="Description"
                  accepter={TextArea}
                  rows={3}
                  reqText="Description is Required"
                />
              </FlexboxGrid.Item>
            </FlexboxGrid>
          </Form>
        </div>
      </AddNewModal>

      {(isLoading || createLoading || updateLoading || deleteLoading) && <UseLoader />}
      {/* confirmation modal  */}
      <AlertModal
        open={open}
        setOpen={setOpen}
        content={'Do you want to delete the organization?'}
        handleConfirmed={handleConfirmed}
      />
      <AdminDataTable props={tableProps} />
    </div>
  );
};

export default Organization;
