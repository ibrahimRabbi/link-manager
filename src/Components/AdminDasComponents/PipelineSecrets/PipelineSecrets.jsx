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
import {
  fetchCreateData,
  fetchDeleteData,
  fetchUpdateData,
} from '../../../Redux/slices/useCRUDSlice';
import { useQuery } from '@tanstack/react-query';
import fetchAPIRequest from '../../../apiRequests/apiRequest';
import AlertModal from '../../Shared/AlertModal';
import PasswordField from '../PasswordField';
import SelectField from '../SelectField';
import CustomReactSelect from '../../Shared/Dropdowns/CustomReactSelect';
const lmApiUrl = import.meta.env.VITE_LM_REST_API_URL;

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
    header: 'Value',
    key: 'display_value',
  },
];

const { StringType, NumberType } = Schema.Types;

const model = Schema.Model({
  organization_id: NumberType(),
  name: StringType().isRequired('This field is required.'),
  value: StringType().isRequired('This field is required.'),
});

const PipelineSecrets = () => {
  const { isCreated, isDeleted, isUpdated, isCrudLoading } = useSelector(
    (state) => state.crud,
  );

  const { refreshData, isAdminEditing } = useSelector((state) => state.nav);

  const [currPage, setCurrPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [formError, setFormError] = useState({});
  const [editData, setEditData] = useState({});
  const [formValue, setFormValue] = useState({
    organization_id: '',
    name: '',
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

  const pipelineSecretsFormRef = useRef();
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

  // handle open add pipeline secret modal
  const handleAddNew = () => {
    handleResetForm();
    dispatch(handleIsAddNewModal(true));
  };

  const handleCopy = (data) => {
    navigator.clipboard.writeText(data.value);
  };

  const handleAddPipelineSecret = () => {
    const bodyData = {
      name: formValue.name,
      value: formValue.value,
    };

    if (!pipelineSecretsFormRef.current.check()) {
      return;
    } else if (isAdminEditing) {
      // eslint-disable-next-line max-len
      const putUrl = `${lmApiUrl}/${authCtx.organization_id}/pipeline_secret/${editData?.id}`;
      dispatch(
        fetchUpdateData({
          url: putUrl,
          token: authCtx.token,
          bodyData: bodyData,
          showNotification: showNotification,
        }),
      );
    } else {
      const postUrl = `${lmApiUrl}/${authCtx.organization_id}/pipeline_secret`;
      dispatch(
        fetchCreateData({
          url: postUrl,
          token: authCtx.token,
          bodyData: bodyData,
          showNotification: showNotification,
        }),
      );
    }
    dispatch(handleIsAddNewModal(false));
    if (isAdminEditing) dispatch(handleIsAdminEditing(false));
    refetchPipelineSecrets();
  };

  // reset form
  const handleResetForm = () => {
    setEditData({});
    setFormValue({
      organization_id: '',
      name: '',
      value: '',
    });
  };

  // get all pipeline secrets
  const { data: allPipelineSecrets, refetch: refetchPipelineSecrets } = useQuery(
    ['pipelineSecret'],
    () =>
      fetchAPIRequest({
        // eslint-disable-next-line max-len
        urlPath: `${authCtx.organization_id}/pipeline_secret?page=${currPage}&per_page=${pageSize}`,
        token: authCtx.token,
        method: 'GET',
        showNotification: showNotification,
      }),
    {
      onSuccess(allPipelineSecrets) {
        for (let i = 0; i < allPipelineSecrets.items.length; i++) {
          allPipelineSecrets.items[i]['display_value'] = '***********';
        }
      },
    },
  );

  // get all pipeline secrets
  useEffect(() => {
    dispatch(handleCurrPageTitle('Pipeline Secrets'));
    refetchPipelineSecrets();
  }, [isCreated, isUpdated, isDeleted, pageSize, currPage, refreshData, isCrudLoading]);

  // handle delete pipeline secret
  const handleDelete = (data) => {
    setDeleteData(data);
    setOpen(true);
  };
  const handleConfirmed = (value) => {
    if (value) {
      // eslint-disable-next-line max-len
      const deleteUrl = `${lmApiUrl}/${authCtx.organization_id}/pipeline_secret/${deleteData?.id}`;
      dispatch(
        fetchDeleteData({
          url: deleteUrl,
          token: authCtx.token,
          showNotification: showNotification,
        }),
      );
    }
  };
  // handle edit pipeline secret
  const handleEdit = (data) => {
    setEditData(data);
    dispatch(handleIsAdminEditing(true));
    setFormValue({
      organization_id: data?.organization_id || Number(authCtx?.organization_id),
      name: data?.name,
      value: data?.value,
    });
    dispatch(handleIsAddNewModal(true));
  };

  // send props in the batch action table
  const tableProps = {
    title: 'Pipeline Secrets',
    rowData: allPipelineSecrets?.items?.length ? allPipelineSecrets?.items : [],
    headerData,
    handleEdit,
    handleDelete,
    handleAddNew,
    handleCopy,
    handlePagination,
    handleChangeLimit,
    totalItems: allPipelineSecrets?.total_items,
    totalPages: allPipelineSecrets?.total_pages,
    pageSize,
    page: allPipelineSecrets?.page,
    inpPlaceholder: 'Search Pipeline Secrets',
  };

  return (
    <div>
      <AddNewModal
        title={isAdminEditing ? 'Edit Pipeline Secret' : 'Add Pipeline Secret'}
        handleSubmit={handleAddPipelineSecret}
        handleReset={handleResetForm}
      >
        <div className="show-grid">
          <Form
            fluid
            ref={pipelineSecretsFormRef}
            onChange={setFormValue}
            onCheck={setFormError}
            formValue={formValue}
            model={model}
          >
            <FlexboxGrid justify="space-between">
              <FlexboxGrid.Item style={{ marginBottom: '25px' }} colspan={24}>
                <SelectField
                  name="organization_id"
                  label="Organization"
                  value={Number(authCtx?.organization_id)}
                  placeholder="Select Organization"
                  accepter={CustomReactSelect}
                  apiURL={`${lmApiUrl}/organization`}
                  error={formError.organization_id}
                  disabled
                />
              </FlexboxGrid.Item>

              <FlexboxGrid.Item colspan={24} style={{ marginBottom: '25px' }}>
                <TextField
                  name="name"
                  label="Name"
                  reqText="Name is required"
                  error={formError.name}
                />
              </FlexboxGrid.Item>

              <FlexboxGrid.Item colspan={24}>
                <PasswordField
                  name="value"
                  type="password"
                  label="value"
                  reqText="Value is required"
                  error={formError.value}
                ></PasswordField>
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
        content={'Do you want to delete the pipeline secret?'}
        handleConfirmed={handleConfirmed}
      />
      <AdminDataTable props={tableProps} />
    </div>
  );
};

export default PipelineSecrets;
