import React, { useState, useContext, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Swal from 'sweetalert2';
import {
  fetchCreateAssoc,
  fetchDeleteAssoc,
  fetchAssociations,
  fetchUpdateAssoc,
} from '../../../Redux/slices/associationSlice';
import { fetchOslcResource } from '../../../Redux/slices/oslcResourcesSlice.jsx';
import AuthContext from '../../../Store/Auth-Context';
import {
  handleCurrPageTitle,
  handleIsAddNewModal,
  handleIsAdminEditing,
} from '../../../Redux/slices/navSlice';
import { FlexboxGrid, Form, Schema, SelectPicker } from 'rsuite';
import AdminDataTable from '../AdminDataTable';
import AddNewModal from '../AddNewModal';
import TextField from '../TextField';
// import TextArea from '../TextArea';
import UseLoader from '../../Shared/UseLoader';
import SelectField from '../SelectField.jsx';
import CustomSelect from '../CustomSelect.jsx';
// import clientMessages from '../../../Redux/apiRequests/responseMsg';

// import UseTable from '../UseTable';
// import styles from './Projects.module.scss';
// const { errText, formContainer, modalBtnCon, modalBody, mhContainer } = styles;

const lmApiUrl = process.env.REACT_APP_LM_REST_API_URL;

// demo data
const headerData = [
  {
    header: 'ID',
    key: 'id',
  },
  {
    header: 'Application',
    key: 'application_id',
  },
  {
    header: 'Service provider',
    key: 'service_provider_id',
  },
  {
    header: 'Description',
    key: 'service_label',
  },
  {
    header: 'Resource type',
    key: 'resource_type',
  },
];

const { StringType } = Schema.Types;

const model = Schema.Model({
  name: StringType().isRequired('This field is required.'),
  oslc_domain: StringType().isRequired('This field is required.'),
  service_provider_id: StringType().isRequired('This field is required.'),
  service_label: StringType().isRequired('This field is required.'),
  resource_type_id: StringType().isRequired('This field is required.'),
  selection_dialog_url: StringType().isRequired('This field is required.'),
  height: StringType().isRequired('This field is required.'),
  width: StringType().isRequired('This field is required.'),
});

const Associations = () => {
  // eslint-disable-next-line max-len
  const {
    allAssociations,
    isAssocLoading,
    isAssocCreated,
    isAssocUpdated,
    isAssocDeleted,
  } = useSelector((state) => state.associations);
  const { oslcRootservicesCatalogResponse, oslcServiceProviderCatalogResponse } =
    useSelector((state) => state.oslcResources);
  const { refreshData, isAdminEditing } = useSelector((state) => state.nav);
  const [currPage, setCurrPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [formError, setFormError] = useState({});
  const [editData, setEditData] = useState({});
  const [formValue, setFormValue] = useState({
    name: '',
    oslc_domain: '',
    service_provider_id: '',
    service_label: '',
    resource_type_id: '',
    selection_dialog_url: '',
    height: '',
    width: '',
  });

  const associationFormRef = useRef();
  const authCtx = useContext(AuthContext);
  const dispatch = useDispatch();

  const fetchOslcServiceProviderCatalog = (oslcDomain) => {
    const consumerToken = localStorage.getItem('consumerToken');
    dispatch(
      fetchOslcResource({
        url: oslcDomain,
        token: 'Bearer ' + consumerToken,
      }),
    );
  };

  const getServiceProviderResources = (url) => {
    const consumerToken = localStorage.getItem('consumerToken');
    dispatch(
      fetchOslcResource({
        url: url,
        token: 'Bearer ' + consumerToken,
      }),
    );
  };

  // Pagination
  const handlePagination = (value) => {
    setCurrPage(value);
  };

  const handleChangeLimit = (dataKey) => {
    setCurrPage(1);
    setPageSize(dataKey);
  };

  const handleAddAssociation = () => {
    if (!associationFormRef.current.check()) {
      console.error('Form Error', formError);
      return;
    } else if (isAdminEditing) {
      const putUrl = `${lmApiUrl}/association/${editData?.id}`;
      dispatch(
        fetchUpdateAssoc({
          url: putUrl,
          token: authCtx.token,
          bodyData: formValue,
        }),
      );
    } else {
      const postUrl = `${lmApiUrl}/association`;
      dispatch(
        fetchCreateAssoc({
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
      oslc_domain: '',
      service_provider_id: '',
      service_label: '',
      resource_type_id: '',
      selection_dialog_url: '',
      height: '',
      width: '',
    });
  };

  useEffect(() => {
    console.log('oslcRootservicesCatalogResponse: ', oslcRootservicesCatalogResponse);
    const consumerToken = localStorage.getItem('consumerToken');
    console.log('consumerToken: ', consumerToken);
    dispatch(
      fetchOslcResource({
        url: oslcRootservicesCatalogResponse,
        token: 'Bearer ' + consumerToken,
      }),
    );
  }, [oslcRootservicesCatalogResponse]);

  useEffect(() => {
    // eslint-disable-next-line max-len
    console.log(
      'oslcServiceProviderCatalogResponse: ',
      oslcServiceProviderCatalogResponse,
    );
  }, [oslcServiceProviderCatalogResponse]);

  // get all associations
  useEffect(() => {
    dispatch(handleCurrPageTitle('Associations'));

    const getUrl = `${lmApiUrl}/association?page=${currPage}&per_page=${pageSize}`;
    dispatch(fetchAssociations({ url: getUrl, token: authCtx.token }));
  }, [isAssocCreated, isAssocUpdated, isAssocDeleted, pageSize, currPage, refreshData]);

  // handle open add user modal
  const handleAddNew = () => {
    handleResetForm();
    dispatch(handleIsAddNewModal(true));
  };

  // handle delete association
  const handleDelete = (data) => {
    Swal.fire({
      title: 'Are you sure',
      icon: 'info',
      text: 'Do you want to delete the association?',
      cancelButtonColor: 'red',
      showCancelButton: true,
      confirmButtonText: 'Delete',
      confirmButtonColor: '#3085d6',
      reverseButtons: true,
    }).then((value) => {
      if (value.isConfirmed) {
        const deleteUrl = `${lmApiUrl}/association/${data?.id}`;
        dispatch(fetchDeleteAssoc({ url: deleteUrl, token: authCtx.token }));
      }
    });
  };
  // handle Edit association
  const handleEdit = (data) => {
    setEditData(data);
    dispatch(handleIsAdminEditing(true));
    setFormValue({
      name: data?.name,
      oslc_domain: data?.oslc_domain,
      service_provider_id: data?.service_provider_id,
      service_label: data?.service_label,
      resource_type_id: data?.resource_type_id,
      selection_dialog_url: data?.selection_dialog_url,
      height: data?.height,
      width: data?.width,
    });

    dispatch(handleIsAddNewModal(true));
  };

  // send props in the batch action table
  const tableProps = {
    title: 'Associations',
    rowData: allAssociations?.items?.length ? allAssociations?.items : [],
    headerData,
    handleEdit,
    handleDelete,
    handleAddNew,
    handlePagination,
    handleChangeLimit,
    totalItems: allAssociations?.total_items,
    totalPages: allAssociations?.total_pages,
    pageSize,
    page: allAssociations?.page,
    inpPlaceholder: 'Search Association',
  };

  return (
    <div>
      <AddNewModal
        title={isAdminEditing ? 'Edit Association' : 'Add association'}
        handleSubmit={handleAddAssociation}
        handleReset={handleResetForm}
      >
        <Form
          fluid
          ref={associationFormRef}
          onChange={setFormValue}
          onCheck={setFormError}
          formValue={formValue}
          model={model}
        >
          <TextField name="name" label="Name" reqText="Name is required" />
          <FlexboxGrid.Item style={{ margin: '30px 0' }} colspan={24}>
            <SelectField
              name="application_id"
              label="Application"
              placeholder="Select Application ID"
              accepter={CustomSelect}
              apiURL={`${lmApiUrl}/application`}
              customExpectedValue="rootservices_url"
              customExpectedLabel="rootservices_url"
              error={formError.organization_id}
              onChange={(value) => {
                fetchOslcServiceProviderCatalog(value);
              }}
              reqText="Application ID is required"
            />
          </FlexboxGrid.Item>
          <FlexboxGrid.Item style={{ margin: '30px 0' }} colspan={24}>
            <SelectField
              name="service_provider_id"
              label="Application container"
              placeholder="Select application container"
              data={oslcServiceProviderCatalogResponse}
              accepter={SelectPicker}
              onChange={(value) => {
                console.log('value', value);
                getServiceProviderResources(value);
              }}
              reqText="Application container is required"
            />
          </FlexboxGrid.Item>
        </Form>
      </AddNewModal>

      {isAssocLoading && <UseLoader />}
      {/* <UseTable props={tableProps} /> */}

      <AdminDataTable props={tableProps} />
    </div>
  );
};

export default Associations;
