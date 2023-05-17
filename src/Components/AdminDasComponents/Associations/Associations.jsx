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
import UseLoader from '../../Shared/UseLoader';
import SelectField from '../SelectField.jsx';
import CustomSelect from '../CustomSelect.jsx';

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
    header: 'Description',
    key: 'service_label',
  },
  {
    header: 'Resource type',
    key: 'resource_type_id',
  },
];

const { StringType, NumberType } = Schema.Types;

const model = Schema.Model({
  name: StringType().isRequired('This field is required.'),
  application_id: NumberType().isRequired('This field is required.'),
  project_id: NumberType().isRequired('This field is required.'),
  service_provider_id: StringType().isRequired('This field is required.'),
  selection_dialog_url: StringType().isRequired('This field is required.'),
});

const Associations = () => {
  const {
    allAssociations,
    isAssocLoading,
    isAssocCreated,
    isAssocUpdated,
    isAssocDeleted,
  } = useSelector((state) => state.associations);
  const {
    oslcRootservicesCatalogResponse,
    oslcServiceProviderCatalogResponse,
    oslcServiceProviderResponse,
  } = useSelector((state) => state.oslcResources);
  const { refreshData, isAdminEditing } = useSelector((state) => state.nav);
  const [currPage, setCurrPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [formError, setFormError] = useState({});
  const [editData, setEditData] = useState({});
  const [formValue, setFormValue] = useState({
    name: '',
    application_id: '',
    service_provider_id: '',
    selection_dialog_url: '',
    project_id: '',
  });
  console.log('oslcServiceProviderResponse', oslcServiceProviderResponse);

  const associationFormRef = useRef();
  const authCtx = useContext(AuthContext);
  const dispatch = useDispatch();

  const fetchOslcServiceProviderCatalog = (data) => {
    const url = data[0];
    const newFormValue = { ...formValue };
    newFormValue.application_id = data[1];
    setFormValue(newFormValue);

    const consumerToken = localStorage.getItem('consumerToken');
    dispatch(
      fetchOslcResource({
        url: url,
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
      let bodyData = { ...formValue };
      const selectedServiceProvider = oslcServiceProviderCatalogResponse?.find(
        (item) => item.value === formValue.service_provider_id,
      );
      const selectedSelectionDialog = oslcServiceProviderResponse?.find(
        (item) => item.value === formValue.selection_dialog_url,
      );
      bodyData['oslc_domain'] = selectedSelectionDialog.domain;
      bodyData['service_provider_id'] = selectedServiceProvider?.serviceProviderId;
      bodyData['service_label'] = selectedSelectionDialog?.label;
      bodyData['resource_type_id'] = selectedSelectionDialog?.resourceType;
      bodyData['selection_dialog_url'] = selectedSelectionDialog?.value;
      bodyData['height'] = selectedSelectionDialog?.height;
      bodyData['width'] = selectedSelectionDialog?.width;

      const postUrl = `${lmApiUrl}/association`;
      dispatch(
        fetchCreateAssoc({
          url: postUrl,
          token: authCtx.token,
          bodyData: bodyData,
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
      application_id: '',
      service_provider_id: '',
      selection_dialog_url: '',
      project_id: '',
    });
  };

  useEffect(() => {
    const consumerToken = localStorage.getItem('consumerToken');
    dispatch(
      fetchOslcResource({
        url: oslcRootservicesCatalogResponse,
        token: 'Bearer ' + consumerToken,
      }),
    );
  }, [oslcRootservicesCatalogResponse]);

  // get all associations
  useEffect(() => {
    dispatch(handleCurrPageTitle('Integrations'));

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
      service_provider_id: data?.service_provider_id,
      selection_dialog_url: data?.selection_dialog_url,
    });

    dispatch(handleIsAddNewModal(true));
  };

  // send props in the batch action table
  const tableProps = {
    title: 'Integrations',
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
    inpPlaceholder: 'Search Integration',
  };

  return (
    <div>
      <AddNewModal
        title={isAdminEditing ? 'Edit Integration' : 'Add integration to project'}
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
              name="project_id"
              label="Project"
              placeholder="Select project"
              accepter={CustomSelect}
              apiURL={`${lmApiUrl}/project`}
              error={formError.project_id}
              reqText="Project to attach integration is required"
            />
          </FlexboxGrid.Item>
          <FlexboxGrid.Item style={{ margin: '30px 0' }} colspan={24}>
            <SelectField
              name="application"
              label="Integration"
              placeholder="Select external integration"
              accepter={CustomSelect}
              apiURL={`${lmApiUrl}/application`}
              customSelectValue="rootservices_url"
              customSelectLabel="rootservices_url"
              error={formError.application_id}
              onChange={(value) => {
                console.log('value: ', value);
                fetchOslcServiceProviderCatalog(value);
              }}
              reqText="External integration data is required"
            />
          </FlexboxGrid.Item>
          <FlexboxGrid.Item style={{ margin: '30px 0' }} colspan={24}>
            <SelectField
              name="service_provider_id"
              label="Resource container"
              placeholder="Select resource container"
              data={oslcServiceProviderCatalogResponse}
              accepter={SelectPicker}
              onChange={(value) => {
                getServiceProviderResources(value);
              }}
              reqText="Resource container is required"
            />
          </FlexboxGrid.Item>
          <FlexboxGrid.Item style={{ margin: '30px 0' }} colspan={24}>
            <SelectField
              name="selection_dialog_url"
              label="Resource type"
              placeholder="Select resource type"
              data={oslcServiceProviderResponse}
              accepter={SelectPicker}
              reqText="Resource type is required"
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
