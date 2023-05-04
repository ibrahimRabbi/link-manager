import React, { useState, useContext, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Swal from 'sweetalert2';
import {
  fetchCreateOrg,
  fetchDeleteOrg,
  fetchOrganizations,
  fetchUpdateOrg,
} from '../../../Redux/slices/organizationSlice';
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

// import styles from './Organization.module.scss';
// const { errText, formContainer, modalBtnCon, modalBody, mhContainer } = styles;

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

const Organization = () => {
  const { allOrganizations, isOrgLoading, isOrgCreated, isOrgDeleted, isOrgUpdated } =
    useSelector((state) => state.organizations);
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

  const authCtx = useContext(AuthContext);
  const dispatch = useDispatch();
  const orgFormRef = React.useRef();

  const handleAddOrg = () => {
    // throw form validation error
    if (!orgFormRef.current.check()) {
      console.error('Form Error', formError);
      return;
    }
    // editing org
    else if (isAdminEditing) {
      const putUrl = `${lmApiUrl}/organization/${editData?.id}`;
      dispatch(
        fetchUpdateOrg({
          url: putUrl,
          token: authCtx.token,
          bodyData: formValue,
        }),
      );
    }
    // creating org
    else {
      const postUrl = `${lmApiUrl}/organization`;
      dispatch(
        fetchCreateOrg({
          url: postUrl,
          token: authCtx.token,
          bodyData: formValue,
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

  // load table data
  useEffect(() => {
    dispatch(handleCurrPageTitle('Organizations'));

    const getUrl = `${lmApiUrl}/organization?page=${currPage}&per_page=${pageSize}`;
    dispatch(fetchOrganizations({ url: getUrl, token: authCtx.token }));
  }, [isOrgCreated, isOrgUpdated, isOrgDeleted, pageSize, currPage, refreshData]);

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
        dispatch(fetchDeleteOrg({ url: deleteUrl, token: authCtx.token }));
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
    rowData: allOrganizations?.items?.length ? allOrganizations?.items : [],
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

      {isOrgLoading && <UseLoader />}
      {/* <UseTable props={tableProps} /> */}
      <AdminDataTable props={tableProps} />
    </div>
  );
};

export default Organization;
