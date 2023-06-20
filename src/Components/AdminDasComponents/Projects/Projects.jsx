import React, { useState, useContext, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Swal from 'sweetalert2';
import AuthContext from '../../../Store/Auth-Context';
import {
  handleCurrPageTitle,
  handleIsAddNewModal,
  handleIsAdminEditing,
} from '../../../Redux/slices/navSlice';
import { FlexboxGrid, Form, Schema } from 'rsuite';
import AdminDataTable from '../AdminDataTable';
import AddNewModal from '../AddNewModal';
import TextField from '../TextField';
import TextArea from '../TextArea';
import UseLoader from '../../Shared/UseLoader';
import SelectField from '../SelectField.jsx';
import CustomSelect from '../CustomSelect.jsx';
import Notification from '../../Shared/Notification';
import { useQuery, useMutation } from '@tanstack/react-query';
import fetchAPIRequest from '../../../apiRequests/apiRequest';

const lmApiUrl = process.env.REACT_APP_LM_REST_API_URL;

// demo data
const headerData = [
  {
    header: 'ID',
    key: 'id',
  },
  {
    header: 'Project',
    key: 'name',
  },
  {
    header: 'Description',
    key: 'description',
  },
  {
    header: 'Organization',
    key: 'organization_id',
  },
];

const { StringType, NumberType } = Schema.Types;

const model = Schema.Model({
  name: StringType().isRequired('This field is required.'),
  description: StringType().isRequired('This field is required.'),
  organization_id: NumberType().isRequired('This field is required.'),
});

const Projects = () => {
  const { refreshData, isAdminEditing } = useSelector((state) => state.nav);
  const [currPage, setCurrPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [formError, setFormError] = useState({});
  const [editData, setEditData] = useState({});
  const [deleteData, setDeleteData] = useState({});
  const [formValue, setFormValue] = useState({
    name: '',
    description: '',
    organization_id: '',
  });
  const [notificationType, setNotificationType] = useState('');
  const [notificationMessage, setNotificationMessage] = useState('');
  // const showNotification = (type, message) => {
  //   setNotificationType(type);
  //   setNotificationMessage(message);
  // };
  const projectFormRef = useRef();
  const authCtx = useContext(AuthContext);
  const dispatch = useDispatch();

  // get projects using react-query
  const {
    data: allProjects,
    isLoading,
    refetch: refetchProjects,
  } = useQuery(['project'], () =>
    fetchAPIRequest({
      urlPath: `project?page=${currPage}&per_page=${pageSize}`,
      token: authCtx.token,
      method: 'GET',
    }),
  );

  // create project using react query
  const {
    isLoading: createLoading,
    isSuccess: createSuccess,
    mutate: createMutate,
  } = useMutation(
    () =>
      fetchAPIRequest({
        urlPath: 'project',
        token: authCtx.token,
        method: 'POST',
        body: formValue,
      }),
    {
      onSuccess: (value) => {
        console.log(value);
      },
    },
  );

  // update project using react query
  const {
    isLoading: updateLoading,
    isSuccess: updateSuccess,
    mutate: updateMutate,
  } = useMutation(
    () =>
      fetchAPIRequest({
        urlPath: `project/${editData?.id}`,
        token: authCtx.token,
        method: 'PUT',
        body: formValue,
      }),
    {
      onSuccess: (value) => {
        console.log(value);
      },
    },
  );

  // Delete project using react query
  const {
    isLoading: deleteLoading,
    isSuccess: deleteSuccess,
    mutate: deleteMutate,
  } = useMutation(
    () =>
      fetchAPIRequest({
        urlPath: `project/${deleteData?.id}`,
        token: authCtx.token,
        method: 'DELETE',
      }),
    {
      onSuccess: (value) => {
        console.log(value);
        setDeleteData({});
      },
    },
  );

  // Pagination
  const handlePagination = (value) => {
    setCurrPage(value);
  };

  const handleChangeLimit = (dataKey) => {
    setCurrPage(1);
    setPageSize(dataKey);
  };

  const handleAddProject = () => {
    if (!projectFormRef.current.check()) {
      console.error('Form Error', formError);
      return;
    } else if (isAdminEditing) {
      updateMutate();
    } else {
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
      organization_id: '',
    });
  };

  // get all projects
  useEffect(() => {
    dispatch(handleCurrPageTitle('Projects'));

    refetchProjects();
  }, [createSuccess, updateSuccess, deleteSuccess, pageSize, currPage, refreshData]);

  // handle open add user modal
  const handleAddNew = () => {
    handleResetForm();
    dispatch(handleIsAddNewModal(true));
  };

  // handle delete project
  const handleDelete = (data) => {
    setDeleteData(data);
    Swal.fire({
      title: 'Are you sure',
      icon: 'info',
      text: 'Do you want to delete the project!!',
      cancelButtonColor: 'red',
      showCancelButton: true,
      confirmButtonText: 'Delete',
      confirmButtonColor: '#3085d6',
      reverseButtons: true,
    }).then((value) => {
      if (value.isConfirmed) {
        deleteMutate();
      }
    });
  };
  // handle Edit project
  const handleEdit = (data) => {
    setEditData(data);
    dispatch(handleIsAdminEditing(true));
    setFormValue({
      name: data?.name,
      description: data?.description,
      organization_id: data?.organization_id,
    });

    dispatch(handleIsAddNewModal(true));
  };

  // send props in the batch action table
  const tableProps = {
    title: 'Projects',
    rowData: allProjects ? allProjects?.items : [],
    headerData,
    handleEdit,
    handleDelete,
    handleAddNew,
    handlePagination,
    handleChangeLimit,
    totalItems: allProjects?.total_items,
    totalPages: allProjects?.total_pages,
    pageSize,
    page: allProjects?.page,
    inpPlaceholder: 'Search Project',
  };

  return (
    <div>
      <AddNewModal
        title={isAdminEditing ? 'Edit Project' : 'Add New Project'}
        handleSubmit={handleAddProject}
        handleReset={handleResetForm}
      >
        <Form
          fluid
          ref={projectFormRef}
          onChange={setFormValue}
          onCheck={setFormError}
          formValue={formValue}
          model={model}
        >
          <TextField name="name" label="Name" reqText="Name is required" />
          <div style={{ margin: '30px 0 10px' }}>
            <TextField
              name="description"
              label="Description"
              accepter={TextArea}
              rows={5}
              reqText="Description is required"
            />
          </div>
          <FlexboxGrid.Item style={{ margin: '30px 0' }} colspan={24}>
            <SelectField
              name="organization_id"
              label="Organization"
              placeholder="Select Organization"
              accepter={CustomSelect}
              apiURL={`${lmApiUrl}/organization`}
              error={formError.organization_id}
              reqText="Organization Id is required"
            />
          </FlexboxGrid.Item>
        </Form>
      </AddNewModal>

      {(isLoading || createLoading || updateLoading || deleteLoading) && <UseLoader />}

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

export default Projects;
