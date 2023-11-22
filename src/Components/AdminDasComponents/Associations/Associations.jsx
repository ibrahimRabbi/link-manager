import React, { useState, useContext, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
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
import RemindOutlineIcon from '@rsuite/icons/RemindOutline';
import { FlexboxGrid, Form, Message, Schema, toaster } from 'rsuite';
import AdminDataTable from '../AdminDataTable';
import AddNewModal from '../AddNewModal';
import UseLoader from '../../Shared/UseLoader';
import SelectField from '../SelectField.jsx';
import Oauth2Modal from '../../Oauth2Modal/Oauth2Modal.jsx';
// eslint-disable-next-line max-len
import ExternalAppModal from '../ExternalAppIntegrations/ExternalAppModal/ExternalAppModal.jsx';

import {
  actions as crudActions,
  fetchGetData,
} from '../../../Redux/slices/useCRUDSlice.jsx';
import { ROOTSERVICES_CATALOG_TYPES } from '../../../Redux/slices/oslcResourcesSlice.jsx';
import { handleIsOauth2ModalOpen } from '../../../Redux/slices/oauth2ModalSlice';
import {
  BASIC_AUTH_APPLICATION_TYPES,
  MICROSERVICES_APPLICATION_TYPES,
  OAUTH2_APPLICATION_TYPES,
  PROJECT_APPLICATION_TYPES,
  WORKSPACE_APPLICATION_TYPES,
} from '../../../App.jsx';
import CustomReactSelect from '../../Shared/Dropdowns/CustomReactSelect';
import DefaultCustomReactSelect from '../../Shared/Dropdowns/DefaultCustomReactSelect';
import AlertModal from '../../Shared/AlertModal';

const lmApiUrl = import.meta.env.VITE_LM_REST_API_URL;
const thirdPartyUrl = `${lmApiUrl}/third_party`;

// demo data
const headerData = [
  {
    header: 'ID',
    key: 'id',
    width: 60,
  },
  {
    header: 'Application',
    key: 'application_name',
    width: 160,
  },
  {
    header: 'Project',
    key: 'project_name',
    width: 160,
  },
  {
    header: 'Resource container',
    key: 'service_provider_id',
    width: 200,
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
  ext_application_project: StringType().isRequired('This field is required.'),
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
    applicationsForDropdown,
    projectsForDropdown,
    projectsForDropdownOslc,
  } = useSelector((state) => state.associations);
  const { crudData, isCrudLoading } = useSelector((state) => state.crud);
  const { refreshData, isAdminEditing } = useSelector((state) => state.nav);
  const [currPage, setCurrPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [editData, setEditData] = useState({});
  const [appData, setAppData] = useState({});
  const [formError, setFormError] = useState({});
  const [formValue, setFormValue] = useState({
    organization_id: '',
    workspace_id: '',
    project_id: '',
    application_id: '',
    ext_application_project: '',
  });

  // Variable for fetching project based on organization ID
  const [queryParamId, setQueryParamId] = useState('');
  const [workspaceContainer, setWorkspaceContainer] = useState('');
  const [workspace, setWorkspace] = useState('');
  const [workspaceApp, setWorkspaceApp] = useState({});
  const [restartAppRequest, setRestartAppRequest] = useState(false);
  const [thirdPartyLogin, setThirdPartyLogin] = useState(false);
  const [authorizedThirdParty, setAuthorizedThirdParty] = useState(true);
  const broadcastChannel = new BroadcastChannel('oauth2-app-status');

  // Variables for OSLC dara
  const [oslcCatalogDropdown, setOslcCatalogDropdown] = useState(null);
  const [isAuthorizeSuccess, setIsAuthorizeSuccess] = useState(null);
  const [open, setOpen] = useState(false);
  const [deleteData, setDeleteData] = useState({});
  const {
    oslcCatalogResponse,
    isOslcResourceLoading,
    oslcCatalogUrls,
    oslcResourceFailed,
    oslcUnauthorizedUser,
    oslcMissingConsumerToken,
  } = useSelector((state) => state.oslcResources);
  // manage notifications
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

  /*** Methods for OSLC data ***/
  // GET: Fetch OSLC Consumer token from LM API
  const fetchOslcConsumerToken = (label) => {
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

  const fetchCatalogFromRootservices = (rootservicesUrl) => {
    const consumerToken = crudData?.consumerToken?.access_token;

    if (consumerToken && appData?.type === 'oslc') {
      dispatch(
        fetchOslcResource({
          url: rootservicesUrl,
          token: 'Bearer ' + consumerToken,
        }),
      );
    }
  };

  // get service provider resources by id
  const findServiceProviderById = (id) => {
    const data = projectsForDropdownOslc?.find((v) => v?.serviceProviderId === id);
    return data;
  };

  // handle get service provider resources
  const getServiceProviderResources = (payload) => {
    const consumerToken = crudData?.consumerToken?.access_token;
    const data = findServiceProviderById(payload);
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

  const thirdPartyNotificationStatus = (type, res) => {
    if (type === 'error' && res?.status === 401) {
      //Open Modal for Oauth2 or Basic Auth of 3rd party app
      setThirdPartyLogin(true);
      setAuthorizedThirdParty(false);
    } else {
      showNotification(type, res);
    }
  };

  const getExtLoginData = (data) => {
    if (data?.status) {
      setAuthorizedThirdParty(true);
      setThirdPartyLogin(false);
    }
  };

  const closeThirdPartyModal = () => {
    setThirdPartyLogin(false);
  };

  broadcastChannel.onmessage = (event) => {
    const { status } = event.data;
    if (status === 'success') {
      setAuthorizedThirdParty(true);
      setThirdPartyLogin(false);
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
      // handle edit integration
      const bodyData = { ...formValue };

      if (appData?.type === 'oslc') {
        const data = findServiceProviderById(formValue?.ext_application_project);
        bodyData['service_provider_id'] = data?.serviceProviderId;
        bodyData['service_provider_url'] = data?.value;
      } else {
        bodyData['service_provider_id'] = workspaceApp?.id;
        bodyData['service_provider_url'] = workspaceApp?.link;
      }
      const putUrl = `${lmApiUrl}/association/${editData?.id}`;
      dispatch(
        fetchUpdateAssoc({
          url: putUrl,
          token: authCtx.token,
          bodyData: bodyData,
          showNotification: showNotification,
        }),
      );
    } else {
      // handle create new integration
      const bodyData = { ...formValue };
      if (appData?.type === 'oslc') {
        const data = findServiceProviderById(formValue?.ext_application_project);
        bodyData['service_provider_id'] = data?.serviceProviderId;
        bodyData['service_provider_url'] = data?.value;
      } else {
        bodyData['service_provider_id'] = workspaceApp?.id;
        bodyData['service_provider_url'] = workspaceApp?.link;
      }
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
    setAppData({});
    setOslcCatalogDropdown(null);
    setIsAuthorizeSuccess(false);
    setThirdPartyLogin(false);
    setAuthorizedThirdParty(true);
    setRestartAppRequest(false);
    setWorkspaceContainer('');
    setWorkspaceApp({});
    setFormValue({
      organization_id: '',
      project_id: '',
      application_id: '',
      workspace_id: '',
      ext_application_project: '',
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
    setDeleteData(data);
    setOpen(true);
  };
  const handleConfirmed = (value) => {
    if (value) {
      const deleteUrl = `${lmApiUrl}/association/${deleteData?.id}`;
      dispatch(
        fetchDeleteAssoc({
          url: deleteUrl,
          token: authCtx.token,
          showNotification: showNotification,
        }),
      );
    }
  };

  // Edit association
  const handleEdit = (data) => {
    setEditData(data);
    setAppData(data?.application);
    dispatch(handleIsAdminEditing(true));
    const newData = {
      organization_id: data?.organization_id,
      project_id: data?.project_id,
      application_id: data?.application_id,
      workspace_id: data?.workspace_id,
      ext_application_project: data?.service_provider_id,
    };
    setFormValue(newData);
    dispatch(handleIsAddNewModal(true));
  };

  // set workspace container value after fulfil the edit form
  useEffect(() => {
    if (editData?.workspace_id && formValue?.workspace_id) {
      // delay for loading upper dropdowns
      setTimeout(() => {
        // eslint-disable-next-line max-len
        setWorkspaceContainer(
          `${thirdPartyUrl}/${appData?.type}/containers/${editData?.workspace_id}`,
        );
      }, 500);
    }
  }, [editData, formValue]);

  /*** Methods for dropdowns ***/
  // Handle External application dropdown change
  const handleExtAppChange = (value) => {
    dispatch(actions.resetOslcServiceProviderCatalogResponse());

    if (oslcCatalogDropdown) setOslcCatalogDropdown(null);
    setAuthorizedThirdParty(true);
    if (value) {
      const extAppData = applicationsForDropdown?.find((v) => v?.id === value);
      setAppData(extAppData);
    } else {
      dispatch(crudActions.removeCrudParameter('consumerToken'));
      setAppData({});
      const newFormValue = { ...formValue };
      newFormValue['ext_workspace_id'] = '';
      newFormValue['application_id'] = '';
      setFormValue(newFormValue);
      setWorkspaceContainer('');
      setWorkspaceApp({});
    }
  };

  //
  useEffect(() => {
    if (editData?.service_provider_id && projectsForDropdownOslc?.length) {
      const consumerToken = crudData?.consumerToken?.access_token;
      const data = projectsForDropdownOslc?.find(
        (v) => v?.serviceProviderId === editData?.service_provider_id,
      );
      const url = data?.value;

      if (url && consumerToken) {
        dispatch(
          fetchOslcResource({
            url: url,
            token: 'Bearer ' + consumerToken,
          }),
        );
      }
    }
  }, [editData, projectsForDropdownOslc]);

  // separated actions for showing default value in the edit integration form
  useEffect(() => {
    if (appData?.id) {
      setWorkspaceContainer('');
      setWorkspaceApp({});
      const newFormValue = { ...formValue };
      newFormValue['application_id'] = appData?.id;
      newFormValue['ext_workspace_id'] = '';
      setFormValue(newFormValue);

      if (appData?.type === 'oslc') {
        fetchOslcConsumerToken(appData?.name);
      } else {
        if (PROJECT_APPLICATION_TYPES.includes(appData?.type)) {
          setWorkspaceContainer(`${thirdPartyUrl}/${appData?.type}/containers`);
        }
      }
    }
  }, [appData]);

  const handleWorkspaceChange = (value) => {
    if (value) {
      // eslint-disable-next-line max-len
      setWorkspaceContainer(`${thirdPartyUrl}/${appData?.type}/containers/${value}`);
    } else {
      setWorkspaceContainer('');
    }
  };

  const handleExtProjectWorkspaceChange = (value) => {
    if (value) {
      const workspaceData = projectsForDropdown?.find((v) => v?.id == value);
      setWorkspaceApp(workspaceData);
    } else {
      setWorkspaceApp({});
    }
  };

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
    if (
      crudData?.consumerToken?.access_token &&
      appData?.id &&
      appData?.type === 'oslc'
    ) {
      const rootservicesUrl = appData?.authentication_server?.find(
        (item) => item.type === 'rootservices',
      );
      if (rootservicesUrl) {
        fetchCatalogFromRootservices(rootservicesUrl?.url, appData?.id);
      }
    }
  }, [crudData?.consumerToken?.access_token, appData]);

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
        oauth2ModalRef.current?.verifyAndOpenModal(appData, appData?.id, true);
      }
    } else if (oslcResourceFailed && oslcMissingConsumerToken && oauth2ModalRef.current) {
      if (oauth2ModalRef.current?.verifyAndOpenModal) {
        oauth2ModalRef.current?.verifyAndOpenModal(appData, appData?.id);
      }
    }
  }, [oslcResourceFailed, oslcUnauthorizedUser]);

  // Close Oauth2 Modal after successful authorization
  useEffect(() => {
    fetchOslcConsumerToken(appData?.name);
    dispatch(handleIsOauth2ModalOpen(false));
  }, [isAuthorizeSuccess]);

  useEffect(() => {}, [formValue]);

  useEffect(() => {
    if (WORKSPACE_APPLICATION_TYPES.includes(appData?.type)) {
      setWorkspace(`${thirdPartyUrl}/${appData?.type}/workspace`);
    }
  }, [appData]);

  useEffect(() => {
    if (authorizedThirdParty) {
      if (
        OAUTH2_APPLICATION_TYPES.includes(appData?.type) &&
        formValue?.ext_workspace_id
      ) {
        setWorkspaceContainer('');
      }
      if (WORKSPACE_APPLICATION_TYPES.includes(appData?.type)) {
        setWorkspace('');
      }
      if (PROJECT_APPLICATION_TYPES.includes(appData?.type)) {
        setWorkspaceContainer('');
      }
      setRestartAppRequest(true);
    }
  }, [authorizedThirdParty]);

  useEffect(() => {
    if (restartAppRequest) {
      if (
        OAUTH2_APPLICATION_TYPES.includes(appData?.type) &&
        formValue?.ext_workspace_id
      ) {
        setWorkspaceContainer(
          `${thirdPartyUrl}/${appData?.type}/containers/${formValue?.ext_workspace_id}`,
        );
      }
      if (WORKSPACE_APPLICATION_TYPES.includes(appData?.type)) {
        setWorkspace(`${thirdPartyUrl}/${appData?.type}/workspace`);
      }
      if (PROJECT_APPLICATION_TYPES.includes(appData?.type)) {
        setWorkspaceContainer(`${thirdPartyUrl}/${appData?.type}/containers`);
      }
      setRestartAppRequest(false);
    }
  }, [restartAppRequest]);

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
      oauth2ModalRef.current?.verifyAndOpenModal(appData, appData?.id);
    }
  };

  const openLoginModal = () => {
    setThirdPartyLogin(true);
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
            <FlexboxGrid.Item colspan={24} style={{ marginBottom: '25px' }}>
              <SelectField
                name="organization_id"
                label="Organization"
                placeholder="Select Organization"
                accepter={CustomReactSelect}
                apiURL={`${lmApiUrl}/organization`}
                error={formError.organization_id}
                reqText="Organization is required"
              />
            </FlexboxGrid.Item>

            <FlexboxGrid.Item style={{ marginBottom: '25px' }} colspan={24}>
              <SelectField
                name="project_id"
                label="Workspace"
                placeholder="Select workspace"
                accepter={CustomReactSelect}
                apiURL={queryParamId ? `${lmApiUrl}/project` : ''}
                error={formError.project_id}
                apiQueryParams={queryParamId}
                disabled={queryParamId ? false : true}
                reqText="Workspace is required"
              />
            </FlexboxGrid.Item>

            <FlexboxGrid.Item colspan={24} style={{ marginBottom: '25px' }}>
              <SelectField
                name="application_id"
                label="External application"
                placeholder="Select external application"
                accepter={CustomReactSelect}
                apiURL={queryParamId ? `${lmApiUrl}/application` : ''}
                customLabelKey="rootservices_url"
                error={formError.application_id}
                apiQueryParams={queryParamId}
                disabled={queryParamId ? false : true}
                reqText="External application is required"
                requestStatus={thirdPartyNotificationStatus}
                onChange={(value) => handleExtAppChange(value)}
              />
            </FlexboxGrid.Item>

            {appData?.id && (
              <>
                {isCrudLoading ? (
                  <FlexboxGrid.Item colspan={24}>
                    <UseLoader />
                  </FlexboxGrid.Item>
                ) : (
                  <>
                    {/* eslint-disable-next-line max-len */} {/* I had consumerToken */}
                    {appData?.type === 'oslc' && oslcCatalogDropdown && (
                      <FlexboxGrid.Item style={{ marginBottom: '25px' }} colspan={24}>
                        <SelectField
                          size="lg"
                          block
                          name="ext_application_project"
                          label="Application project"
                          placeholder="Select an external app project"
                          options={oslcCatalogResponse}
                          customSelectLabel="label"
                          accepter={DefaultCustomReactSelect}
                          onChange={(value) => {
                            getServiceProviderResources(value);
                          }}
                          reqText="External app project is required"
                        />
                      </FlexboxGrid.Item>
                    )}
                    {isOslcResourceLoading && (
                      <FlexboxGrid.Item colspan={24}>
                        <UseLoader />
                      </FlexboxGrid.Item>
                    )}
                    {oslcMissingConsumerToken && appData?.type === 'oslc' && (
                      <p
                        style={{
                          fontSize: '17px',
                          marginTop: '5px',
                        }}
                      >
                        <RemindOutlineIcon
                          style={{
                            marginRight: '5px',
                            color: 'orange',
                          }}
                          onClick={openLoginModal}
                        />
                        <span
                          style={{
                            color: 'blue',
                            textDecoration: 'underline',
                            cursor: 'pointer',
                          }}
                          onClick={handleOauth2Modal}
                        >
                          Authorize this application
                        </span>{' '}
                        for accessing application data.
                      </p>
                    )}
                    {!authorizedThirdParty && (
                      <p
                        style={{
                          fontSize: '17px',
                          marginTop: '5px',
                        }}
                      >
                        <RemindOutlineIcon
                          style={{
                            marginRight: '5px',
                            color: 'orange',
                          }}
                          onClick={openLoginModal}
                        />
                        <span
                          style={{
                            color: 'blue',
                            textDecoration: 'underline',
                            cursor: 'pointer',
                          }}
                          onClick={openLoginModal}
                        >
                          Authorize this application
                        </span>{' '}
                        for accessing application data.
                      </p>
                    )}
                    {WORKSPACE_APPLICATION_TYPES.includes(appData?.type) && workspace && (
                      <FlexboxGrid.Item style={{ marginBottom: '25px' }} colspan={24}>
                        <SelectField
                          block
                          size="lg"
                          accepter={CustomReactSelect}
                          name={'workspace_id'}
                          disabled={!authorizedThirdParty}
                          label="External application workspace"
                          placeholder="Select an external workspace"
                          apiQueryParams={`application_id=${appData?.id}`}
                          apiURL={workspace}
                          requestStatus={thirdPartyNotificationStatus}
                          onChange={(value) => {
                            handleWorkspaceChange(value);
                          }}
                          reqText="External app workspace is required"
                        />
                      </FlexboxGrid.Item>
                    )}
                    {workspaceContainer && (
                      <FlexboxGrid.Item colspan={24} style={{ marginBottom: '25px' }}>
                        <SelectField
                          block
                          size="lg"
                          name="ext_application_project"
                          accepter={CustomReactSelect}
                          customLabelKey={'workTitle'}
                          disabled={!authorizedThirdParty}
                          label="External application project"
                          placeholder="Select an external application"
                          apiQueryParams={`application_id=${appData?.id}`}
                          apiURL={workspaceContainer}
                          requestStatus={thirdPartyNotificationStatus}
                          onChange={(value) => {
                            handleExtProjectWorkspaceChange(value);
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
      <Oauth2Modal setAppData={setAppData} ref={oauth2ModalRef} />

      {thirdPartyLogin && (
        <ExternalAppModal
          formValue={appData}
          openedModal={thirdPartyLogin}
          closeModal={closeThirdPartyModal}
          isOauth2={OAUTH2_APPLICATION_TYPES?.includes(appData?.type)}
          isBasic={(
            BASIC_AUTH_APPLICATION_TYPES + MICROSERVICES_APPLICATION_TYPES
          ).includes(appData?.type)}
          onDataStatus={getExtLoginData}
        />
      )}

      {isAssocLoading && <UseLoader />}
      {/* confirmation modal  */}
      <AlertModal
        open={open}
        setOpen={setOpen}
        content={'Do you want to delete the Integration?'}
        handleConfirmed={handleConfirmed}
      />
      <AdminDataTable props={tableProps} />
    </div>
  );
};

export default Associations;
