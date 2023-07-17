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
import UseLoader from '../../Shared/UseLoader';
import SelectField from '../SelectField.jsx';
import CustomSelect from '../CustomSelect.jsx';
import DefaultCustomSelect from '../DefaultCustomSelect';
import Oauth2Modal from '../../Oauth2Modal/Oauth2Modal.jsx';
import {
  actions as crudActions,
  fetchGetData,
} from '../../../Redux/slices/useCRUDSlice.jsx';
import { ROOTSERVICES_CATALOG_TYPES } from '../../../Redux/slices/oslcResourcesSlice.jsx';
import { handleIsOauth2ModalOpen } from '../../../Redux/slices/oauth2ModalSlice';
import Notification from '../../Shared/Notification';

const lmApiUrl = import.meta.env.VITE_LM_REST_API_URL;

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
    header: 'Project',
    key: 'project_id',
  },
  {
    header: 'Resource container',
    key: 'service_provider_id',
  },
  {
    header: 'Resource URL',
    key: 'service_provider_url',
  },
];

const { StringType, NumberType } = Schema.Types;

const model = Schema.Model({
  organization_id: NumberType().isRequired('This field is required.'),
  application_id: NumberType().isRequired('This field is required.'),
  project_id: NumberType().isRequired('This field is required.'),
  resource_container: StringType().isRequired('This field is required.'),
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
    oslcCatalogResponse,
    isOslcResourceLoading,
    oslcCatalogUrls,
    oslcResourceFailed,
    oslcUnauthorizedUser,
    oslcMissingConsumerToken,
  } = useSelector((state) => state.oslcResources);
  const { crudData, isCrudLoading } = useSelector((state) => state.crud);
  const { refreshData, isAdminEditing } = useSelector((state) => state.nav);

  const [currPage, setCurrPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [editData, setEditData] = useState({});
  const [selectedAppData, setSelectedAppData] = useState({});
  const [formError, setFormError] = useState({});
  const [resourceDropdownResponse, setResourceDropdownResponse] = useState(null);
  const [isAuthorizeSuccess, setIsAuthorizeSuccess] = useState(null);
  const [formValue, setFormValue] = useState({
    organization_id: '',
    project_id: '',
    application_id: '',
    resource_container: '',
  });
  const [notificationType, setNotificationType] = useState('');
  const [notificationMessage, setNotificationMessage] = useState('');
  const showNotification = (type, message) => {
    setNotificationType(type);
    setNotificationMessage(message);
  };
  const associationFormRef = useRef();
  const oauth2ModalRef = useRef();
  const authCtx = useContext(AuthContext);
  const dispatch = useDispatch();

  const fetchCatalogFromRootservices = (url, id) => {
    const newFormValue = { ...formValue };
    newFormValue['application_id'] = id;
    setFormValue(newFormValue);

    const consumerToken = crudData?.consumerToken?.access_token;
    if (consumerToken) {
      dispatch(
        fetchOslcResource({
          url: url,
          token: 'Bearer ' + consumerToken,
        }),
      );
    }
  };

  const getServiceProviderResources = (payload) => {
    const data = JSON.parse(payload);
    const url = data?.value;
    const consumerToken = crudData?.consumerToken?.access_token;

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
      return;
    } else if (isAdminEditing) {
      const putUrl = `${lmApiUrl}/association/${editData?.id}`;
      dispatch(
        fetchUpdateAssoc({
          url: putUrl,
          token: authCtx.token,
          bodyData: formValue,
          showNotification: showNotification,
        }),
      );
    } else {
      const bodyData = { ...formValue };
      const resourceContainerPayload = JSON.parse(bodyData.resource_container);

      const selectedServiceProvider = oslcCatalogResponse?.find(
        (item) => item.value === resourceContainerPayload.value,
      );
      bodyData['service_provider_id'] = selectedServiceProvider?.serviceProviderId;
      bodyData['service_provider_url'] = selectedServiceProvider?.value;

      const postUrl = `${lmApiUrl}/association`;
      dispatch(
        fetchCreateAssoc({
          url: postUrl,
          token: authCtx.token,
          bodyData: bodyData,
          showNotification: showNotification,
        }),
      );
    }

    dispatch(handleIsAddNewModal(false));
    if (isAdminEditing) dispatch(handleIsAdminEditing(false));
  };

  // reset form
  const handleResetForm = () => {
    setEditData({});
    setSelectedAppData({});
    setResourceDropdownResponse(null);
    setIsAuthorizeSuccess(false);
    setFormValue({
      organization_id: '',
      project_id: '',
      application_id: '',
      resource_container: '',
    });
    dispatch(actions.resetRootservicesResponse());
    dispatch(actions.resetOslcCatalogUrls());
    dispatch(actions.resetOslcServiceProviderCatalogResponse());
    dispatch(actions.resetOslcServiceProviderResponse());
    dispatch(actions.resetOslcSelectionDialogData());
    dispatch(actions.resetOslcResourceFailed());
    dispatch(actions.resetOslcUnauthorizedUser());
    dispatch(actions.resetOslcMissingConsumerToken());
    dispatch(crudActions.removeCrudParameter('consumerToken'));
  };

  // get oslc resources
  useEffect(() => {
    let ignore = false;
    setResourceDropdownResponse(null);
    if (oslcCatalogUrls && oslcCatalogUrls[ROOTSERVICES_CATALOG_TYPES[0]]) {
      dispatch(
        fetchOslcResource({
          url: oslcCatalogUrls[ROOTSERVICES_CATALOG_TYPES[0]],
          token: 'Bearer ' + crudData?.consumerToken?.access_token,
        }),
      ).then((res) => {
        if (!ignore) setResourceDropdownResponse(res.payload);
      });
    }

    return () => {
      ignore = true;
    };
  }, [oslcCatalogUrls]);

  useEffect(() => {
    if (oslcResourceFailed && oslcUnauthorizedUser && oauth2ModalRef.current) {
      if (oauth2ModalRef.current.verifyAndOpenModal) {
        oauth2ModalRef.current?.verifyAndOpenModal(
          selectedAppData,
          selectedAppData?.id,
          true,
        );
      }
    } else if (oslcResourceFailed && oslcMissingConsumerToken && oauth2ModalRef.current) {
      if (oauth2ModalRef.current?.verifyAndOpenModal) {
        oauth2ModalRef.current?.verifyAndOpenModal(selectedAppData, selectedAppData?.id);
      }
    }
  }, [oslcResourceFailed, oslcUnauthorizedUser]);

  // get all associations
  useEffect(() => {
    dispatch(handleCurrPageTitle('Integrations'));

    const getUrl = `${lmApiUrl}/association?page=${currPage}&per_page=${pageSize}`;
    dispatch(
      fetchAssociations({
        url: getUrl,
        token: authCtx.token,
        showNotification: showNotification,
      }),
    );
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
        dispatch(
          fetchDeleteAssoc({
            url: deleteUrl,
            token: authCtx.token,
            showNotification: showNotification,
          }),
        );
      }
    });
  };

  // handle Edit association
  const handleEdit = (data) => {
    console.log(data);
    setEditData(data);
    dispatch(handleIsAdminEditing(true));
    setFormValue({
      resource_container: data?.resource_container,
      resource_type: data?.resource_type,
      project_id: data?.project_id,
      application_id: data?.application_id,
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

  // load projects and applications data by organization id
  const [queryParamId, setQueryParamId] = useState('');

  useEffect(() => {
    if (formValue?.organization_id) {
      setQueryParamId(`organization_id=${formValue?.organization_id}`);
    } else {
      setQueryParamId('');
    }
  }, [formValue.organization_id]);

  // control oauth2 modal
  const handleRootServiceUrlChange = (value) => {
    dispatch(actions.resetOslcServiceProviderCatalogResponse());
    if (resourceDropdownResponse) setResourceDropdownResponse(null);
    if (value) {
      const selectedURL = JSON.parse(value);
      setSelectedAppData(selectedURL);
      fetchConsumerToken(selectedURL?.name);
    } else {
      dispatch(crudActions.removeCrudParameter('consumerToken'));
      setSelectedAppData({});
    }
  };

  // get consumer token from lm API
  const fetchConsumerToken = (label) => {
    if (label) {
      dispatch(
        fetchGetData({
          url: `${lmApiUrl}/application/consumer-token/${label}`,
          token: authCtx.token,
          stateName: 'consumerToken',
        }),
      );
    }
  };

  // after authorized the oslc api consumer token is loading
  useEffect(() => {
    fetchConsumerToken(selectedAppData?.name);
    dispatch(handleIsOauth2ModalOpen(false));
  }, [isAuthorizeSuccess]);

  useEffect(() => {
    // eslint-disable-next-line max-len
    if (crudData?.consumerToken?.access_token && selectedAppData?.id) {
      fetchCatalogFromRootservices(
        selectedAppData?.rootservices_url,
        selectedAppData?.id,
      );
    }
  }, [crudData?.consumerToken?.access_token, selectedAppData]);

  // Call function of Oauth2Modal
  const handleOauth2Modal = () => {
    if (oauth2ModalRef.current && oauth2ModalRef.current?.verifyAndOpenModal) {
      oauth2ModalRef.current?.verifyAndOpenModal(selectedAppData, selectedAppData?.id);
    }
  };

  // get authoriz response from oauth2 modal
  window.addEventListener(
    'message',
    function (event) {
      let message = event.data;
      if (!message.source) {
        if (message.toString()?.startsWith('consumer-token-info')) {
          const response = JSON.parse(message?.substr('consumer-token-info:'?.length));
          if (response?.consumerStatus === 'success') {
            setIsAuthorizeSuccess(true);
          }
        }
      }
    },
    false,
  );

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
              <SelectField
                name="organization_id"
                label="Organization ID"
                placeholder="Select Organization ID"
                accepter={CustomSelect}
                apiURL={`${lmApiUrl}/organization`}
                error={formError.organization_id}
                reqText="Organization Id is required"
              />
            </FlexboxGrid.Item>

            <FlexboxGrid.Item style={{ margin: '30px 0' }} colspan={24}>
              <SelectField
                name="project_id"
                label="Project"
                placeholder="Select project"
                accepter={CustomSelect}
                apiURL={queryParamId ? `${lmApiUrl}/project` : ''}
                error={formError.project_id}
                apiQueryParams={queryParamId}
                disabled={queryParamId ? false : true}
                reqText="Project to attach integration is required"
              />
            </FlexboxGrid.Item>

            <FlexboxGrid.Item colspan={24}>
              <SelectField
                name="application"
                label="Integration"
                placeholder="Select external integration"
                accepter={CustomSelect}
                apiURL={queryParamId ? `${lmApiUrl}/application` : ''}
                customSelectLabel="rootservices_url"
                error={formError.application_id}
                apiQueryParams={queryParamId}
                disabled={queryParamId ? false : true}
                reqText="External integration data is required"
                onChange={(value) => handleRootServiceUrlChange(value)}
              />
            </FlexboxGrid.Item>

            {selectedAppData?.id && (
              <>
                {isCrudLoading ? (
                  <FlexboxGrid.Item colspan={24}>
                    <UseLoader />
                  </FlexboxGrid.Item>
                ) : (
                  <>
                    {crudData?.consumerToken?.access_token && resourceDropdownResponse ? (
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
                    ) : isOslcResourceLoading ? (
                      <FlexboxGrid.Item colspan={24}>
                        <UseLoader />
                      </FlexboxGrid.Item>
                    ) : (
                      <p style={{ fontSize: '17px', color: '#eb9d17', marginTop: '5px' }}>
                        Please
                        <span
                          style={{
                            color: 'blue',
                            textDecoration: 'underline',
                            cursor: 'pointer',
                          }}
                          onClick={handleOauth2Modal}
                        >
                          {' '}
                          authorize{' '}
                        </span>
                        this application to add integration.
                      </p>
                    )}
                  </>
                )}
              </>
            )}
          </FlexboxGrid>
        </Form>
      </AddNewModal>

      {/* --- oauth 2 modal ---  */}
      <Oauth2Modal setSelectedAppData={setSelectedAppData} ref={oauth2ModalRef} />

      {isAssocLoading && <UseLoader />}
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

export default Associations;
