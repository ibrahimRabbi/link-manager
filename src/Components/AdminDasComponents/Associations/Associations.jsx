import React, { useState, useContext, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Swal from 'sweetalert2';
import {
  fetchCreateAssoc,
  fetchDeleteAssoc,
  fetchAssociations,
  fetchUpdateAssoc,
} from '../../../Redux/slices/associationSlice';
import { actions, fetchOslcResource } from '../../../Redux/slices/oslcResourcesSlice';
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
import UseLoader from '../../Shared/UseLoader';
import SelectField from '../SelectField.jsx';
import CustomSelect from '../CustomSelect.jsx';
import DefaultCustomSelect from '../DefaultCustomSelect';
import Oauth2Modal from '../../Oauth2Modal/Oauth2Modal.jsx';

const lmApiUrl = process.env.REACT_APP_LM_REST_API_URL;

// demo data
const headerData = [
  {
    header: 'ID',
    key: 'id',
  },
  {
    header: 'Service Provider ID',
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
  {
    header: 'Project ID',
    key: 'project_id',
  },
  {
    header: 'Created',
    key: 'created',
  },
];

const { StringType, NumberType } = Schema.Types;

const model = Schema.Model({
  name: StringType().isRequired('This field is required.'),
  application_id: NumberType().isRequired('This field is required.'),
  project_id: NumberType().isRequired('This field is required.'),
  resource_container: StringType().isRequired('This field is required.'),
  resource_type: StringType().isRequired('This field is required.'),
});

const Associations = () => {
  const {
    allAssociations,
    isAssocLoading,
    isAssocCreated,
    isAssocUpdated,
    isAssocDeleted,
  } = useSelector((state) => state.associations);
  const { rootservicesResponse, oslcCatalogResponse, oslcServiceProviderResponse } =
    useSelector((state) => state.oslcResources);
  const { refreshData, isAdminEditing } = useSelector((state) => state.nav);
  const [currPage, setCurrPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [formError, setFormError] = useState({});
  const [editData, setEditData] = useState({});
  const [formValue, setFormValue] = useState({
    name: '',
    application_id: '',
    resource_container: '',
    // service_provider_url: '',
    resource_type: '',
    project_id: '',
  });

  const associationFormRef = useRef();
  const oauth2ModalRef = useRef();
  const authCtx = useContext(AuthContext);
  const dispatch = useDispatch();

  const fetchOslcServiceProviderCatalog = (url, id) => {
    const newFormValue = { ...formValue };
    newFormValue['application_id'] = id;
    setFormValue(newFormValue);
    console.log('Trying to request Rootservices');
    const consumerToken = localStorage.getItem('consumerToken');
    dispatch(
      fetchOslcResource({
        url: url,
        token: 'Bearer ' + consumerToken,
      }),
    );
  };

  const getServiceProviderResources = (payload) => {
    const data = JSON.parse(payload);
    const url = data.value;
    const consumerToken = localStorage.getItem('consumerToken');
    if (url && consumerToken) {
      dispatch(
        fetchOslcResource({
          url: url,
          token: 'Bearer ' + consumerToken,
        }),
      );
    }
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
      const bodyData = { ...formValue };
      const resourceContainerPayload = JSON.parse(bodyData.resource_container);
      const resourceTypePayload = JSON.parse(bodyData.resource_type);

      const selectedServiceProvider = oslcCatalogResponse?.find(
        (item) => item.value === resourceContainerPayload.value,
      );
      const selectedSelectionDialog = oslcServiceProviderResponse?.find(
        (item) => item.value === resourceTypePayload.value,
      );

      bodyData['oslc_domain'] = selectedSelectionDialog.domain;
      bodyData['service_provider_id'] = selectedServiceProvider?.serviceProviderId;
      bodyData['service_provider_url'] = selectedServiceProvider?.value;
      bodyData['service_label'] = selectedSelectionDialog?.label;
      bodyData['service_description'] = selectedSelectionDialog?.description;
      bodyData['resource_type'] = selectedSelectionDialog?.resourceType;

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
    console.log('reset form');
    setEditData({});
    setFormValue({
      name: '',
      application_id: '',
      resource_container: '',
      resource_type: '',
      project_id: '',
    });
    dispatch(actions.resetRootservicesResponse());
    dispatch(actions.resetOslcServiceProviderCatalogResponse());
    dispatch(actions.resetOslcServiceProviderResponse());
    dispatch(actions.resetOslcSelectionDialogData());
  };

  useEffect(() => {
    const consumerToken = localStorage.getItem('consumerToken');
    console.log('Trying to request OSLC Root Services Catalog');
    dispatch(
      fetchOslcResource({
        url: rootservicesResponse,
        token: 'Bearer ' + consumerToken,
      }),
    );
  }, [rootservicesResponse]);

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
      resource_container: data?.resource_container,
      resource_type: data?.resource_type,
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

  // control oauth2 modal

  const handleRootServiceUrlChange = (value) => {
    const consumerToken = localStorage.getItem('consumerToken');
    const selectedURL = JSON.parse(value);

    if (consumerToken && value) {
      fetchOslcServiceProviderCatalog(selectedURL?.rootservices_url, selectedURL?.id);
    } else {
      // Call function of Oauth2Modal
      if (oauth2ModalRef.current && oauth2ModalRef.current.verifyAndOpenModal) {
        oauth2ModalRef.current.verifyAndOpenModal(selectedURL, selectedURL?.id);
      }
    }
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
          <FlexboxGrid>
            <FlexboxGrid.Item colspan={24}>
              <TextField name="name" label="Name" reqText="Name is required" />
            </FlexboxGrid.Item>

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

            <FlexboxGrid.Item colspan={24}>
              <SelectField
                name="application"
                label="Integration"
                placeholder="Select external integration"
                accepter={CustomSelect}
                apiURL={`${lmApiUrl}/application`}
                customSelectLabel="rootservices_url"
                error={formError.application_id}
                reqText="External integration data is required"
                onChange={(value) => handleRootServiceUrlChange(value)}
              />
            </FlexboxGrid.Item>

            {/* {rootservicesResponse[0] && ( */}
            <>
              <FlexboxGrid.Item style={{ margin: '30px 0' }} colspan={24}>
                <SelectField
                  size="lg"
                  block
                  name="resource_container"
                  label="Resource container"
                  placeholder="Select resource container"
                  options={oslcCatalogResponse}
                  customSelectLabel="label"
                  accepter={DefaultCustomSelect}
                  onChange={(value) => {
                    getServiceProviderResources(value);
                  }}
                  reqText="Resource container is required"
                />
              </FlexboxGrid.Item>

              <FlexboxGrid.Item style={{ marginBottom: '10px' }} colspan={24}>
                <SelectField
                  name="resource_type"
                  label="Resource type"
                  placeholder="Select resource type"
                  options={oslcServiceProviderResponse}
                  accepter={DefaultCustomSelect}
                  customSelectLabel="label"
                  reqText="Resource type is required"
                />
              </FlexboxGrid.Item>
            </>
            {/* )} */}
          </FlexboxGrid>
        </Form>
      </AddNewModal>

      {/* --- oauth 2 modal ---  */}
      <Oauth2Modal ref={oauth2ModalRef} />

      {isAssocLoading && <UseLoader />}

      <AdminDataTable props={tableProps} />
    </div>
  );
};

export default Associations;
