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
import {PROJECT_APPLICATION_TYPES, WORKSPACE_APPLICATION_TYPES} from '../../../App.jsx';

const lmApiUrl = import.meta.env.VITE_LM_REST_API_URL;
const thirdPartyUrl = `${lmApiUrl}/third_party`;

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
    header: 'Resource url',
    key: 'service_provider_url',
  },
];

const { StringType, NumberType } = Schema.Types;

const model = Schema.Model({
  organization_id: NumberType().isRequired('This field is required.'),
  application_id: NumberType().isRequired('This field is required.'),
  project_id: NumberType().isRequired('This field is required.'),
  resource_container: StringType().isRequired('This field is required.'),
  ext_workspace_id: StringType(),
});

const Associations = () => {
  const associationFormRef = useRef();
  const authCtx = useContext(AuthContext);
  const dispatch = useDispatch();
  const oauth2ModalRef = useRef();

  // Variables for Association table/form
  const {
    allAssociations,
    isAssocLoading,
    isAssocCreated,
    isAssocUpdated,
    isAssocDeleted,
  } = useSelector((state) => state.associations);
  const { crudData, isCrudLoading } = useSelector((state) => state.crud);
  const { refreshData, isAdminEditing } = useSelector((state) => state.nav);
  const [currPage, setCurrPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [editData, setEditData] = useState({});
  const [selectedAppData, setSelectedAppData] = useState({});
  const [formError, setFormError] = useState({});
  const [notificationType, setNotificationType] = useState('');
  const [notificationMessage, setNotificationMessage] = useState('');
  const [formValue, setFormValue] = useState({
    ext_workspace_id: '',
    organization_id: '',
    project_id: '',
    application_id: '',
    resource_container: '',
  });

  // Variable for fetching project based on organization ID
  const [queryParamId, setQueryParamId] = useState('');

  // Variables for OSLC dara
  const [oslcCatalogDropdown, setOslcCatalogDropdown] = useState(null);
  const [isAuthorizeSuccess, setIsAuthorizeSuccess] = useState(null);
  const {
    oslcCatalogResponse,
    isOslcResourceLoading,
    oslcCatalogUrls,
    oslcResourceFailed,
    oslcUnauthorizedUser,
    oslcMissingConsumerToken,
  } = useSelector((state) => state.oslcResources);

  const showNotification = (type, message) => {
    setNotificationType(type);
    setNotificationMessage(message);
  };

  /*** Methods for OSLC data ***/
  // GET: Fetch OSLC Consumer token from LM API
  const fetchOslcConsumerToken = (label) => {
    console.log('label', label);
    if (label) {
      dispatch(
        fetchGetData({
          url: `${lmApiUrl}/application/consumer-token/${label}`,
          token: authCtx.token,
          stateName: 'consumerToken',
          showNotification: showNotification,
        }),
      );
    }

  };

  const fetchCatalogFromRootservices = (rootservicesUrl, applicationId) => {
    const consumerToken = crudData?.consumerToken?.access_token;
    const newFormValue = { ...formValue };
    newFormValue['application_id'] = applicationId;
    setFormValue(newFormValue);
    console.log('rootservicesUrl', rootservicesUrl);
    console.log('applicationId', applicationId);

    if (consumerToken && selectedAppData?.type === 'oslc') {
      dispatch(
        fetchOslcResource({
          url: rootservicesUrl,
          token: 'Bearer ' + consumerToken,
        }),
      );
    }
  };

  const getServiceProviderResources = (payload) => {
    const consumerToken = crudData?.consumerToken?.access_token;
    const data = JSON.parse(payload);
    const url = data?.value;

    if (url && consumerToken) {
      dispatch(
        fetchOslcResource({
          url: url,
          token: 'Bearer ' + consumerToken,
        }),
      );
    }
  };

  /*** Methods for Integration table ***/
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

  // Reset form
  const handleResetForm = () => {
    setEditData({});
    setSelectedAppData({});
    setOslcCatalogDropdown(null);
    setIsAuthorizeSuccess(false);
    setFormValue({
      ext_workspace_id: '',
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

  // Open add association modal
  const handleAddNew = () => {
    handleResetForm();
    dispatch(handleIsAddNewModal(true));
  };

  // Delete association
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

  // Edit association
  const handleEdit = (data) => {
    setEditData(data);
    dispatch(handleIsAdminEditing(true));
    setFormValue({
      resource_container: data?.resource_container,
      resource_type: data?.resource_type,
    });

    dispatch(handleIsAddNewModal(true));
  };

  /*** Methods for dropdowns ***/
  // Handle External application dropdown change
  const handleExtAppChange = (value) => {
    dispatch(actions.resetOslcServiceProviderCatalogResponse());
    if (oslcCatalogDropdown) setOslcCatalogDropdown(null);
    if (value) {
      const extAppData = JSON.parse(value);
      console.log('extAppData', extAppData);
      setSelectedAppData(extAppData);
      if (extAppData?.type ==='oslc'){
        fetchOslcConsumerToken(extAppData?.name);
      }
    } else {
      dispatch(crudActions.removeCrudParameter('consumerToken'));
      setSelectedAppData({});
    }
  };

  /** UseEffects for Association */

  // GET all associations
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

  // Set the query param for filtering data based on organization ID
  useEffect(() => {
    if (formValue?.organization_id) {
      setQueryParamId(`organization_id=${formValue?.organization_id}`);
    } else {
      setQueryParamId('');
    }
  }, [formValue.organization_id]);

  // Get the OSLC catalogs through received consumer token and external app data
  useEffect(() => {
    console.log('consumerToken', crudData?.consumerToken);
    console.log('selectedAppData', selectedAppData);
    // eslint-disable-next-line max-len
    if (crudData?.consumerToken?.access_token && selectedAppData?.id) {
      const rootservicesUrl = selectedAppData?.authentication_server.filter(
        (item) => item.type === 'rootservices');
      console.log('rootservicesUrl', rootservicesUrl);
      fetchCatalogFromRootservices(
        rootservicesUrl[0]?.url,
        selectedAppData?.id,
      );
    }
  }, [crudData?.consumerToken?.access_token, selectedAppData]);

  // Get OSLC Service Providers through selected OSLC catalog
  useEffect(() => {
    let ignore = false;
    setOslcCatalogDropdown(null);

    // Get RM Catalog (test)
    if (oslcCatalogUrls && oslcCatalogUrls[ROOTSERVICES_CATALOG_TYPES[0]]) {
      dispatch(
        fetchOslcResource({
          url: oslcCatalogUrls[ROOTSERVICES_CATALOG_TYPES[0]],
          token: 'Bearer ' + crudData?.consumerToken?.access_token,
        }),
      ).then((res) => {
        if (!ignore) setOslcCatalogDropdown(res.payload);
      });
    }
    return () => {
      ignore = true;
    };
  }, [oslcCatalogUrls]);

  // Method for opening Oauth2 modal for authorizing OSLC consumption
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

  // Close Oauth2 Modal after successful authorization
  useEffect(() => {
    fetchOslcConsumerToken(selectedAppData?.name);
    dispatch(handleIsOauth2ModalOpen(false));
  }, [isAuthorizeSuccess]);


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

  // Call function of Oauth2Modal
  const handleOauth2Modal = () => {
    if (oauth2ModalRef.current && oauth2ModalRef.current?.verifyAndOpenModal) {
      oauth2ModalRef.current?.verifyAndOpenModal(selectedAppData, selectedAppData?.id);
    }
  };

  // Get authorize response from oauth2 modal
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
                label="Organization"
                placeholder="Select Organization"
                accepter={CustomSelect}
                apiURL={`${lmApiUrl}/organization`}
                error={formError.organization_id}
                reqText="Organization is required"
              />
            </FlexboxGrid.Item>

            <FlexboxGrid.Item style={{ margin: '30px 0' }} colspan={24}>
              <SelectField
                name="project_id"
                label="Workspace"
                placeholder="Select workspace"
                accepter={CustomSelect}
                apiURL={queryParamId ? `${lmApiUrl}/project` : ''}
                error={formError.project_id}
                apiQueryParams={queryParamId}
                disabled={queryParamId ? false : true}
                reqText="Workspace is required"
              />
            </FlexboxGrid.Item>

            <FlexboxGrid.Item colspan={24}>
              <SelectField
                name="application"
                label="External application"
                placeholder="Select external application"
                accepter={CustomSelect}
                apiURL={queryParamId ? `${lmApiUrl}/application` : ''}
                customLabelKey="rootservices_url"
                error={formError.application_id}
                apiQueryParams={queryParamId}
                disabled={queryParamId ? false : true}
                reqText="External application is required"
                onChange={(value) => handleExtAppChange(value)}
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
                    {
                      crudData?.consumerToken?.access_token && 
                      oslcCatalogDropdown &&
                      selectedAppData?.type === 'oslc' && (
                        <FlexboxGrid.Item style={{ margin: '30px 0' }} colspan={24}>
                          <SelectField
                            size="lg"
                            block
                            name="resource_container"
                            label="Application project"
                            placeholder="Select an external app project"
                            options={oslcCatalogResponse}
                            customSelectLabel="label"
                            accepter={DefaultCustomSelect}
                            onChange={(value) => {
                              getServiceProviderResources(value);
                            }}
                            reqText="External app project is required"
                          />
                        </FlexboxGrid.Item>
                      )}  { isOslcResourceLoading && (
                      <FlexboxGrid.Item colspan={24}>
                        <UseLoader />
                      </FlexboxGrid.Item>
                    )}
                    {( !crudData?.consumerToken?.access_token &&
                          <p style={{ fontSize: '17px', marginTop: '5px' }}>
                        Please <span
                              style={{
                                color: 'blue',
                                textDecoration: 'underline',
                                cursor: 'pointer',
                              }}
                              onClick={handleOauth2Modal}
                            >authorize this application
                            </span> to fetch the application projects.
                          </p>
                    )}
                    {(WORKSPACE_APPLICATION_TYPES.includes(selectedAppData?.type)) && (
                      <FlexboxGrid.Item style={{ margin: '30px 0' }} colspan={24}>
                        <SelectField
                          block
                          size="lg"
                          accepter={CustomSelect}
                          name={'ext_workspace_id'}
                          label="External application workspace"
                          placeholder="Select an external workspace"
                          apiQueryParams={`application_id=${selectedAppData?.id}`}
                          /* eslint-disable-next-line max-len */
                          apiURL={`${thirdPartyUrl}/${selectedAppData?.type}/workspace?`}
                          onChange={(value) => {
                            getServiceProviderResources(value);
                          }}
                          reqText="External app project is required"
                        />
                      </FlexboxGrid.Item>
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
