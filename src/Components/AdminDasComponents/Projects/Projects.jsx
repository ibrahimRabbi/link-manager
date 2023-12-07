import React, { useState, useContext, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import AuthContext from '../../../Store/Auth-Context';
import {
  handleCurrPageTitle,
  handleIsAddNewModal,
  handleIsAdminEditing,
} from '../../../Redux/slices/navSlice';
import { FlexboxGrid, Form, Message, Schema, toaster } from 'rsuite';
import AdminDataTable from '../AdminDataTable';
import AddNewModal from '../AddNewModal';
import TextField from '../TextField';
import TextArea from '../TextArea';
import UseLoader from '../../Shared/UseLoader';
import SelectField from '../SelectField.jsx';
import { useQuery, useMutation } from '@tanstack/react-query';
import fetchAPIRequest from '../../../apiRequests/apiRequest.js';
import CustomReactSelect from '../../Shared/Dropdowns/CustomReactSelect';
import AlertModal from '../../Shared/AlertModal';
import { Mixpanel } from '../../../../Mixpanel';
import jwt_decode from 'jwt-decode';
import { useLocation } from 'react-router-dom';
const lmApiUrl = import.meta.env.VITE_LM_REST_API_URL;

// demo data
const headerData = [
  {
    header: 'ID',
    key: 'id',
  },
  {
    header: 'Projects',
    key: 'name',
  },
  {
    header: 'Descriptions',
    key: 'description',
  },
];

const { StringType, NumberType, ArrayType } = Schema.Types;

const model = Schema.Model({
  name: StringType().isRequired('This field is required.'),
  description: StringType(),
  organization_id: NumberType(),
  users: ArrayType(),
});

const Projects = () => {
  const location = useLocation();

  const { refreshData, isAdminEditing } = useSelector((state) => state.nav);
  const [currPage, setCurrPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [formError, setFormError] = useState({});
  const [editData, setEditData] = useState({});
  const [deleteData, setDeleteData] = useState({});
  const authCtx = useContext(AuthContext);
  const dispatch = useDispatch();
  const userInfo = jwt_decode(authCtx?.token);
  const projectFormRef = useRef();
  const [formValue, setFormValue] = useState({
    name: '',
    description: '',
    organization_id: '',
    users: [],
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

  // get projects using react-query
  const {
    data: allProjects,
    isLoading,
    refetch: refetchProjects,
  } = useQuery(
    ['project'],
    () =>
      fetchAPIRequest({
        // eslint-disable-next-line max-len
        urlPath: `${authCtx.organization_id}/project?page=${currPage}&per_page=${pageSize}`,
        token: authCtx.token,
        method: 'GET',
        showNotification: showNotification,
      }),
    {
      onSuccess: (allProjects) => {
        for (let i = 0; i < allProjects.items.length; i++) {
          allProjects.items[i]['organization_name'] =
            allProjects.items[i].organization.name;
        }
      },
    },
  );

  // create project using react query
  const {
    isLoading: createLoading,
    isSuccess: createSuccess,
    mutate: createMutate,
  } = useMutation(
    () =>
      fetchAPIRequest({
        urlPath: `${authCtx.organization_id}/project`,
        token: authCtx.token,
        method: 'POST',
        body: formValue,
        showNotification: showNotification,
      }),
    {
      onSuccess: (value) => {
        if (value?.message) {
          Mixpanel.track('Project created success.', {
            username: userInfo?.preferred_username,
          });
        } else {
          Mixpanel.track('Project created failed.', {
            username: userInfo?.preferred_username,
          });
        }
        showNotification(value?.status, value?.message);
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
        urlPath: `${authCtx.organization_id}/project/${editData?.id}`,
        token: authCtx.token,
        method: 'PUT',
        body: formValue,
        showNotification: showNotification,
      }),
    {
      onSuccess: (value) => {
        if (value?.message) {
          Mixpanel.track('Project updated success', {
            username: userInfo?.preferred_username,
          });
        } else {
          Mixpanel.track('Project updated failed', {
            username: userInfo?.preferred_username,
          });
        }
        showNotification(value?.status, value?.message);
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
        urlPath: `${authCtx.organization_id}/project/${deleteData?.id}`,
        token: authCtx.token,
        method: 'DELETE',
        showNotification: showNotification,
      }),
    {
      onSuccess: (value) => {
        if (value?.message) {
          Mixpanel.track('Project deleted success.', {
            username: userInfo?.preferred_username,
          });
        } else {
          Mixpanel.track('Project deleted failed.', {
            username: userInfo?.preferred_username,
          });
        }
        showNotification(value?.status, value?.message);
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
    setTimeout(() => {
      setEditData({});
      setFormValue({
        name: '',
        description: '',
        organization_id: '',
        users: [],
      });
    }, 500);
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
    setOpen(true);
  };
  const handleConfirmed = (value) => {
    if (value) {
      deleteMutate();
    }
  };

  // handle Edit project
  const handleEdit = async (data) => {
    setEditData(data);
    dispatch(handleIsAdminEditing(true));
    // map user data to display in the dropdown
    const mappedUserList = data?.users?.reduce((accumulator, user) => {
      accumulator.push({
        ...user,
        label: user?.email,
        value: user?.id,
      });
      return accumulator;
    }, []);

    setFormValue({
      name: data?.name,
      description: data?.description,
      organization_id: data?.organization_id,
      users: mappedUserList,
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
    showResourceLink: location.pathname.replace('projects', 'project'),
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
          <FlexboxGrid.Item colspan={24}>
            <SelectField
              name="organization_id"
              label="Organization"
              placeholder="Select Organization"
              accepter={CustomReactSelect}
              apiURL={`${lmApiUrl}/organization`}
              error={formError.organization_id}
              disabled={true}
              reqText="Organization Id is required"
              value={Number(authCtx?.organization_id)}
              defaultValue={Number(authCtx?.organization_id)}
            />
          </FlexboxGrid.Item>

          <FlexboxGrid.Item colspan={24} style={{ margin: '25px 0' }}>
            <TextField name="name" label="Name" reqText="Name is required" />
          </FlexboxGrid.Item>

          <FlexboxGrid.Item colspan={24} style={{ marginBottom: '25px' }}>
            <SelectField
              name="users"
              label="Assign users"
              placeholder="Select Users"
              accepter={CustomReactSelect}
              apiURL={`${lmApiUrl}/user`}
              error={formError.users}
              isMulti={true}
            />
          </FlexboxGrid.Item>

          <FlexboxGrid.Item colspan={24}>
            <TextField
              name="description"
              label="Description"
              accepter={TextArea}
              rows={3}
              reqText="Description is required"
            />
          </FlexboxGrid.Item>
        </Form>
      </AddNewModal>

      {(isLoading || createLoading || updateLoading || deleteLoading) && <UseLoader />}
      {/* confirmation modal  */}
      <AlertModal
        open={open}
        setOpen={setOpen}
        content={'Do you want to delete the project?'}
        handleConfirmed={handleConfirmed}
      />
      <AdminDataTable props={tableProps} />
    </div>
  );
};

export default Projects;
