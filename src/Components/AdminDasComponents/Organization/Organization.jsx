import React, { useState, useContext, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Swal from 'sweetalert2';
import AuthContext from '../../../Store/Auth-Context';
import {
  handleCurrPageTitle,
  handleIsAddNewModal,
  handleIsAdminEditing,
} from '../../../Redux/slices/navSlice';
import AdminDataTable from '../AdminDataTable';
import AddNewModal from '../AddNewModal';
import { FlexboxGrid, Form, Schema } from 'rsuite';
import TextField from '../TextField';
import TextArea from '../TextArea';
import UseLoader from '../../Shared/UseLoader';
import Notification from '../../Shared/Notification';

const lmApiUrl = process.env.REACT_APP_LM_REST_API_URL;

// demo data
const headerData = [
  {
    header: 'ID',
    key: 'id',
    width: 100,
  },
  {
    header: 'Organization',
    key: 'name',
    width: 200,
  },
  {
    header: 'URL',
    key: 'url',
    width: 200,
  },
  {
    header: 'Description',
    key: 'description',
    width: 300,
  },
];

const { StringType } = Schema.Types;

const model = Schema.Model({
  name: StringType().isRequired('This field is required.'),
  url: StringType().isRequired('This field is required.'),
  description: StringType().isRequired('This field is required.'),
});

// get rtk query states
import {
  useGetApiQuery,
  usePostApiMutation,
  useUpdateApiMutation,
  useDeleteApiMutation,
} from '../../../Redux/rtk_query/fetchApi';

const Organization = () => {
  const { refreshData, isAdminEditing } = useSelector((state) => state.nav);
  const [currPage, setCurrPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [formError, setFormError] = useState({});
  const [editData, setEditData] = useState({});
  const [formValue, setFormValue] = useState({
    name: '',
    url: '',
    description: '',
  });
  const [notificationType, setNotificationType] = useState('');
  const [notificationMessage, setNotificationMessage] = useState('');
  // const showNotification = (type, message) => {
  //   setNotificationType(type);
  //   setNotificationMessage(message);
  // };
  const authCtx = useContext(AuthContext);
  const dispatch = useDispatch();
  const orgFormRef = React.useRef();

  // get data using rtk query
  const {
    data: allOrganizations,
    isLoading: getLoading,
    refetch: refetchOrganizations,
  } = useGetApiQuery({
    url: `organization?page=${currPage}&per_page=${pageSize}`,
    token: authCtx.token,
  });

  // create data using rtk query
  const [createOrganization, { isSuccess: createSuccess, isLoading: createLoading }] =
    usePostApiMutation();

  // update data using rtk query
  const [updateOrganization, { isSuccess: updateSuccess, isLoading: updateLoading }] =
    useUpdateApiMutation();

  // delete data using rtk query
  const [deleteOrganization, { isSuccess: deleteSuccess, isLoading: deleteLoading }] =
    useDeleteApiMutation();

  const handleAddOrg = () => {
    // throw form validation error
    if (!orgFormRef.current.check()) {
      console.error('Form Error', formError);
      return;
    }
    // editing org
    else if (isAdminEditing) {
      const putUrl = `${lmApiUrl}/organization/${editData?.id}`;
      updateOrganization({
        url: putUrl,
        token: authCtx.token,
        bodyData: formValue,
      });
    }
    // creating org
    else {
      const postUrl = `${lmApiUrl}/organization`;
      createOrganization({
        url: postUrl,
        token: authCtx.token,
        bodyData: formValue,
      });
    }
    dispatch(handleIsAddNewModal(false));
    if (isAdminEditing) dispatch(handleIsAdminEditing(false));
  };

  // reset form
  const handleResetForm = () => {
    setEditData({});
    setFormValue({
      name: '',
      url: '',
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

  // get all organizations
  useEffect(() => {
    dispatch(handleCurrPageTitle('Organizations'));
    refetchOrganizations();
  }, [createSuccess, updateSuccess, deleteSuccess, pageSize, currPage, refreshData]);

  // handle delete Org
  const handleDelete = (data) => {
    Swal.fire({
      title: 'Are you sure',
      icon: 'info',
      text: 'Do you want to delete the organization!!',
      cancelButtonColor: 'red',
      showCancelButton: true,
      confirmButtonText: 'Delete',
      confirmButtonColor: '#3085d6',
      reverseButtons: true,
    }).then((value) => {
      if (value.isConfirmed) {
        const deleteUrl = `${lmApiUrl}/organization/${data?.id}`;
        deleteOrganization({
          url: deleteUrl,
          token: authCtx.token,
        });
      }
    });
  };

  // handle Edit org
  const handleEdit = (data) => {
    setEditData(data);
    dispatch(handleIsAdminEditing(true));
    setFormValue({
      name: data?.name,
      url: data?.url,
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
              <FlexboxGrid.Item colspan={11}>
                <TextField name="name" label="Name" reqText="Name is Required" />
              </FlexboxGrid.Item>

              <FlexboxGrid.Item colspan={11}>
                <TextField name="url" label="URL" reqText="URL is Required" />
              </FlexboxGrid.Item>
              <FlexboxGrid.Item colspan={24} style={{ margin: '30px 0 10px' }}>
                <TextField
                  name="description"
                  label="Description"
                  accepter={TextArea}
                  rows={5}
                  reqText="Description is Required"
                />
              </FlexboxGrid.Item>
            </FlexboxGrid>
          </Form>
        </div>
      </AddNewModal>

      {(getLoading || createLoading || updateLoading || deleteLoading) && <UseLoader />}

      {notificationType && notificationMessage && (
        <Notification
          type={notificationType}
          message={notificationMessage}
          setNotificationType={setNotificationType}
          setNotificationMessage={setNotificationMessage}
        />
      )}

      <AdminDataTable props={tableProps} />
    </div>
  );
};

export default Organization;
