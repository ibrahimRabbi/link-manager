import React, { useState, useContext, useEffect } from 'react';
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
import { useRef } from 'react';
import SelectField from '../SelectField';
import CustomSelect from '../CustomSelect';
import TextArea from '../TextArea';
import UseLoader from '../../Shared/UseLoader';
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
    header: 'Link Constraint',
    key: 'name',
  },
  {
    header: 'Source Url',
    key: 'source_url',
  },
  {
    header: 'Target Url',
    key: 'target_url',
  },
  {
    header: 'Description',
    key: 'description',
  },
];

const { StringType, NumberType } = Schema.Types;

const model = Schema.Model({
  name: StringType().isRequired('This field is required.'),
  source_url: StringType().isRequired('This field is required.'),
  target_url: StringType().isRequired('This field is required.'),
  application_id: NumberType().isRequired('This field is required.'),
  link_type_id: NumberType().isRequired('This field is required.'),
  description: StringType().isRequired('This field is required.'),
});

const LinkConstraint = () => {
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
    source_url: '',
    target_url: '',
    application_id: '',
    link_type_id: '',
    description: '',
  });

  const linkConstFormRef = useRef();
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

  // handle open add user modal
  const handleAddNew = () => {
    handleResetForm();
    dispatch(handleIsAddNewModal(true));
  };

  const handleAddLinkConstraint = () => {
    if (!linkConstFormRef.current.check()) {
      console.error('Form Error', formError);
      return;
    } else if (isAdminEditing) {
      const putUrl = `${lmApiUrl}/link-constraint/${editData?.id}`;
      dispatch(
        fetchUpdateData({
          url: putUrl,
          token: authCtx.token,
          bodyData: formValue,
        }),
      );
    } else {
      const postUrl = `${lmApiUrl}/link-constraint`;
      dispatch(
        fetchCreateData({
          url: postUrl,
          token: authCtx.token,
          bodyData: formValue,
          message: 'link constraint',
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
      url: '',
      application_id: '',
      incoming_label: '',
      outgoing_label: '',
      description: '',
    });
  };

  useEffect(() => {
    dispatch(handleCurrPageTitle('Link Constraint'));

    const getUrl = `${lmApiUrl}/link-constraint?page=${currPage}&per_page=${pageSize}`;
    dispatch(
      fetchGetData({
        url: getUrl,
        token: authCtx.token,
        stateName: 'allLinkConstraints',
      }),
    );
  }, [isCreated, isUpdated, isDeleted, pageSize, currPage, refreshData]);

  // handle delete LinkConstraint
  const handleDelete = (data) => {
    Swal.fire({
      title: 'Are you sure',
      icon: 'info',
      text: 'Do you want to delete the this link constraint!!',
      cancelButtonColor: 'red',
      showCancelButton: true,
      confirmButtonText: 'Delete',
      confirmButtonColor: '#3085d6',
      reverseButtons: true,
    }).then((value) => {
      if (value.isConfirmed) {
        const deleteUrl = `${lmApiUrl}/link-constraint/${data?.id}`;
        dispatch(fetchDeleteData({ url: deleteUrl, token: authCtx.token }));
      }
    });
  };

  // handle Edit LinkConstraint
  const handleEdit = (data) => {
    setEditData(data);
    dispatch(handleIsAdminEditing(true));
    setFormValue({
      name: data?.name,
      source_url: data?.source_url,
      target_url: data?.target_url,
      application_id: data?.application_id,
      link_type_id: data?.link_type_id,
      description: data?.description,
    });

    dispatch(handleIsAddNewModal(true));
  };

  // send props in the batch action table
  const tableProps = {
    title: 'Link Constraint',
    rowData: crudData?.allLinkConstraints?.items?.length
      ? crudData?.allLinkConstraints?.items
      : [],
    headerData,
    handleEdit,
    handleDelete,
    handleAddNew,
    handlePagination,
    handleChangeLimit,
    totalItems: crudData?.allLinkConstraints?.total_items,
    totalPages: crudData?.allLinkConstraints?.total_pages,
    pageSize,
    page: crudData?.allLinkConstraints?.page,
    inpPlaceholder: 'Search Link Constraint',
  };

  return (
    <div>
      <AddNewModal
        title={isAdminEditing ? 'Edit Link Constraint' : 'Add New Link Constraint'}
        handleSubmit={handleAddLinkConstraint}
        handleReset={handleResetForm}
      >
        <div className="show-grid">
          <Form
            fluid
            ref={linkConstFormRef}
            onChange={setFormValue}
            onCheck={setFormError}
            formValue={formValue}
            model={model}
          >
            <FlexboxGrid justify="space-between">
              <FlexboxGrid.Item style={{ marginBottom: '30px' }} colspan={24}>
                <TextField name="name" label="Name" reqText="Name is required" />
              </FlexboxGrid.Item>

              <FlexboxGrid.Item colspan={11}>
                <TextField
                  name="source_url"
                  label="Source URL"
                  reqText="Source url is required"
                />
              </FlexboxGrid.Item>

              <FlexboxGrid.Item colspan={11}>
                <TextField
                  name="target_url"
                  label="Target URL"
                  reqText="Target url is required"
                />
              </FlexboxGrid.Item>

              <FlexboxGrid.Item style={{ marginTop: '30px' }} colspan={24}>
                <SelectField
                  placeholder="Select application id"
                  name="application_id"
                  label="Application ID"
                  accepter={CustomSelect}
                  apiURL={`${lmApiUrl}/application`}
                  error={formError.organization_id}
                  reqText="Application ID is required"
                />
              </FlexboxGrid.Item>

              <FlexboxGrid.Item style={{ margin: '30px 0' }} colspan={24}>
                <SelectField
                  placeholder="Select link type id"
                  name="link_type_id"
                  label="Link Type ID"
                  accepter={CustomSelect}
                  apiURL={`${lmApiUrl}/link-type`}
                  error={formError.organization_id}
                  reqText="Link type ID is required"
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

      {isCrudLoading && <UseLoader />}

      <AdminDataTable props={tableProps} />
    </div>
  );
};

export default LinkConstraint;
