import React, { useState, useContext, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import AuthContext from '../../../Store/Auth-Context';
import {
  handleCurrPageTitle,
  handleIsAdminEditing,
} from '../../../Redux/slices/navSlice';
import {
  Button,
  FlexboxGrid,
  Form,
  Modal,
  Schema,
  Steps,
  useToaster,
  Message,
} from 'rsuite';
import AdminDataTable from '../AdminDataTable';
import TextField from '../TextField';
import SelectField from '../SelectField';
import TextArea from '../TextArea';
import UseLoader from '../../Shared/UseLoader';
import Oauth2Modal from '../../Oauth2Modal/Oauth2Modal';
import fetchAPIRequest from '../../../apiRequests/apiRequest';
import { useMutation, useQuery } from '@tanstack/react-query';
import styles from './Application.module.scss';
import Oauth2Waiting from '../ExternalAppIntegrations/Oauth2Waiting/Oauth2Waiting.jsx';
import ExternalLogin from '../ExternalAppIntegrations/ExternalLogin/ExternalLogin.jsx';
import CustomReactSelect from '../../Shared/Dropdowns/CustomReactSelect';
import AlertModal from '../../Shared/AlertModal';

const { modalBodyStyle, step1Container, step2Container, skipBtn } = styles;

const lmApiUrl = import.meta.env.VITE_LM_REST_API_URL;

// demo data
const headerData = [
  {
    header: 'ID',
    key: 'id',
  },
  {
    header: 'Application',
    key: 'name',
    iconKey: 'iconUrl',
  },
  {
    header: 'Description',
    key: 'description',
  },
  {
    header: 'Status',
    statusKey: 'status',
    width: 80,
  },
];

const { StringType, NumberType } = Schema.Types;
const requiredLabel = 'This field is required';

const Application = () => {
  const APPLICATION_FORM = {
    type: '',
    organization_id: '',
    name: '',
    description: '',
    tenant_id: '',
    client_id: '',
    client_secret: '',
    redirect_uris: [`${window.location.origin}/oauth2/callback`],
    rest: '',
    auth: '',
    ui: '',
    oidc: '',
  };

  const appFormRef = useRef();
  const oauth2ModalRef = useRef();
  const authCtx = useContext(AuthContext);
  const dispatch = useDispatch();
  const toaster = useToaster();
  const { refreshData, isAdminEditing } = useSelector((state) => state.nav);

  /** Const variables */
  const [formError, setFormError] = useState({});
  const [editData, setEditData] = useState({});
  const [deleteData, setDeleteData] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [loading, setLoading] = useState(false);
  const [newFormTitle, setNewFormTitle] = useState('');
  const [editFormTitle, setEditFormTitle] = useState('');
  const [advancedOptions, setAdvancedOptions] = useState(false);
  const [applicationType, setApplicationType] = useState({});

  const [openModal, setOpenModal] = useState(false);
  const [formValue, setFormValue] = useState(APPLICATION_FORM);

  /** Application variables */
  const [steps, setSteps] = useState(0);
  const [appsWithIcon, setAppsWithIcon] = useState([]);
  const [appCreateSuccess, setAppCreateSuccess] = useState(false);
  const [authorizedAppConsumption, setAuthorizedAppConsumption] = useState(false);
  const [isAppAuthorize, setIsAppAuthorize] = useState(false);
  const [authorizeButton, setAuthorizeButton] = useState(false);
  const [open, setOpen] = useState(false);

  /** Model Schema */
  const model = Schema.Model({
    type: StringType().isRequired(requiredLabel),
    organization_id: NumberType().isRequired(requiredLabel),
    name: StringType().isRequired(requiredLabel),
    description: StringType(),
    client_id:
      applicationType?.mandatory_client_secret || advancedOptions
        ? StringType().isRequired(requiredLabel)
        : StringType(),
    client_secret:
      applicationType?.mandatory_client_secret || advancedOptions
        ? StringType().isRequired(requiredLabel)
        : StringType(),
    rest:
      applicationType?.mandatory_rest_url || advancedOptions
        ? StringType().isRequired(requiredLabel)
        : StringType(),
    auth: applicationType?.has_microservice
      ? StringType().isRequired(requiredLabel)
      : StringType(),
    ui: applicationType?.has_microservice
      ? StringType().isRequired(requiredLabel)
      : StringType(),
    oidc: applicationType?.has_oidc
      ? StringType().isRequired(requiredLabel)
      : StringType(),
    tenant_id: applicationType?.has_microservice
      ? StringType().isRequired(requiredLabel)
      : StringType(),
  });

  const [payload, setPayload] = useState({});

  // Data for 3rd party integrations
  const broadcastChannel = new BroadcastChannel('oauth2-app-status');

  /** Functions */
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

  // GET: Application data using react-query
  const {
    data: allApplications,
    isLoading,
    refetch: refetchApplications,
  } = useQuery(['application'], () =>
    fetchAPIRequest({
      // eslint-disable-next-line max-len
      urlPath: `${authCtx.organization_id}/application?page=${currentPage}&per_page=${pageSize}`,
      token: authCtx.token,
      method: 'GET',
      showNotification: showNotification,
    }),
  );

  const { data: applicationDataTypes } = useQuery(['applicationTypes'], () =>
    fetchAPIRequest({
      // eslint-disable-next-line max-len
      urlPath: 'external-integrations',
      token: authCtx.token,
      method: 'GET',
      showNotification: showNotification,
    }),
  );

  const { data: organizationData } = useQuery(['organization'], () =>
    fetchAPIRequest({
      // eslint-disable-next-line max-len
      urlPath: `organization/${authCtx.organization_id}`,
      token: authCtx.token,
      method: 'GET',
      showNotification: showNotification,
    }),
  );

  // POST: Create data using react query
  const {
    isLoading: createLoading,
    isSuccess: createSuccess,
    mutate: createMutate,
  } = useMutation(
    () =>
      fetchAPIRequest({
        urlPath: `${authCtx.organization_id}/application`,
        token: authCtx.token,
        method: 'POST',
        body: { ...payload },
        showNotification: showNotification,
      }),
    {
      onSuccess: (res) => {
        if (res) {
          setSteps(1);
        }
      },
      onError: () => {
        setSteps(0);
      },
    },
  );

  // PUT: Update data using react query
  const {
    isLoading: updateLoading,
    isSuccess: updateSuccess,
    mutate: updateMutate,
  } = useMutation(
    () =>
      fetchAPIRequest({
        urlPath: `${authCtx.organization_id}/application/${editData?.id}`,
        token: authCtx.token,
        method: 'PUT',
        body: { ...formValue, ...payload },
        showNotification: showNotification,
      }),
    {
      onSuccess: (res) => {
        if (res) {
          setSteps(1);
        }
      },
      onError: () => {
        setSteps(0);
      },
    },
  );

  // DELETE: Delete data using react query
  const {
    isLoading: deleteLoading,
    isSuccess: deleteSuccess,
    mutate: deleteMutate,
  } = useMutation(
    () =>
      fetchAPIRequest({
        urlPath: `${authCtx.organization_id}/application/${deleteData?.id}`,
        token: authCtx.token,
        method: 'DELETE',
        showNotification: showNotification,
      }),
    {
      onSuccess: () => {
        setDeleteData({});
      },
    },
  );

  // Get applications data and keep it updated
  useEffect(() => {
    dispatch(handleCurrPageTitle('Integrations'));
    refetchApplications();
  }, [
    createSuccess,
    updateSuccess,
    deleteSuccess,
    pageSize,
    currentPage,
    refreshData,
    isAppAuthorize,
  ]);

  useEffect(() => {
    if (steps === 2) {
      dispatch(handleCurrPageTitle('Integrations'));
      refetchApplications();
    }
  }, [steps]);

  // Pagination
  const handlePagination = (value) => {
    setCurrentPage(value);
  };
  // page limit control
  const handleChangeLimit = (dataKey) => {
    setCurrentPage(1);
    setPageSize(dataKey);
  };

  // Create and edit application
  const handleAddApplication = () => {
    setPayload({
      type: formValue?.type,
      organization_id: formValue?.organization_id,
      name: formValue?.name,
      description: formValue?.description,
      tenant_id: formValue?.tenant_id,
      oauth2_data: {
        client_id: formValue?.client_id,
        client_secret: formValue?.client_secret,
        redirect_uris: [`${window.location.origin}/oauth2/callback`],
      },
      url_data: {
        rest: formValue?.rest,
        auth: formValue?.auth,
        ui: formValue?.ui,
        oidc: formValue?.oidc,
      },
    });
    if (!appFormRef.current.check()) {
      return;
    } else if (isAdminEditing) {
      // edit application
      updateMutate();
    } else {
      // create application
      createMutate();
    }
    if (isAdminEditing) dispatch(handleIsAdminEditing(false));
  };

  // Reset form
  const handleResetForm = () => {
    setEditData({});
    setSteps(0);
    setFormValue(APPLICATION_FORM);
    setAuthorizedAppConsumption(false);
    setIsAppAuthorize(false);
    setPayload({});
  };

  // Open application modal - Creation
  const handleAddNew = () => {
    handleResetForm();
    setOpenModal(true);
  };

  // Get server data
  const getServerData = (data) => {
    // get data from authentication server array.
    const serverData = {};
    data?.integration_urls?.forEach((item) => {
      if (data?.type === 'codebeamer') {
        const isOidc = item?.type?.toLowerCase()?.includes('oidc');
        if (isOidc) serverData['oidc'] = item?.url;
        else {
          serverData['rest'] = item?.url;
        }
      } else if (data?.type === 'glideyoke') {
        if (item?.type?.toLowerCase()?.includes('rest')) {
          serverData['rest'] = item?.url;
        } else if (item?.type?.toLowerCase()?.includes('auth')) {
          serverData['auth'] = item?.url;
        } else if (item?.type?.toLowerCase()?.includes('tenant')) {
          serverData['tenant'] = item?.url;
        } else {
          serverData['ui'] = item?.url;
        }
      } else {
        serverData['rest'] = item.url;
      }
    });
    return serverData;
  };

  // handle close modal
  const handleCloseModal = () => {
    setSteps(0);
    setOpenModal(false);
    setAppCreateSuccess(false);
    setApplicationType({});
    setAdvancedOptions(false);
    setTimeout(() => {
      handleResetForm();
      dispatch(handleIsAdminEditing(false));
    }, 500);
  };

  /** Custom functions for authorization */
  //handle application type
  const handleApplicationType = (value) => {
    if (!value) {
      setApplicationType({});
      setPayload({});
      setAdvancedOptions(false);
    }
    formValue.type = value;
    formValue.organization_id = parseInt(authCtx.organization_id);
    setFormValue({ ...formValue });
    const selectedAppType = Object.values(applicationDataTypes['items']).find(
      (item) => item.id === value,
    );
    setApplicationType(selectedAppType);
  };

  // Listen to the notifications in Oauth2 status window
  broadcastChannel.onmessage = (event) => {
    const { status } = event.data;
    if (status === 'success') {
      setSteps(2);
      setAuthorizedAppConsumption(true);
    }
  };

  // Handle login status provided by login to the 3rd party application via Basic
  const getExtLoginData = (data) => {
    if (data?.status) {
      setIsAppAuthorize(true);
      setSteps(2);
      setAuthorizedAppConsumption(true);
    }
  };

  // Use modal in second step to authorize the access to this application
  const handleOpenAuthorizeModal = (data) => {
    // Use authorize button in case of having an unauthorized, suspect or null status
    if (!data.status || data.status === 0 || data.status === 2) {
      handleApplicationType(data?.type);

      setSteps(1);
      const serverData = getServerData(data);
      const oauth2 = data?.oauth2_data[0];

      const foundApplicationType = Object.values(applicationDataTypes['items']).find(
        (item) => item.id === data?.type,
      );

      const editForm = {
        type: data?.type,
        organization_id: data?.organization_id,
        name: data?.name,
        description: data?.description,
        tenant_id: serverData?.tenant ? serverData?.tenant : '',
        client_id:
          oauth2?.client_id && !data?.default_oauth2_credentials ? oauth2?.client_id : '',
        client_secret:
          oauth2?.client_secret && !data?.default_oauth2_credentials
            ? oauth2?.client_secret
            : '',
        redirect_uris: oauth2?.redirect_uris ? oauth2?.redirect_uris : [],
        rest:
          (serverData?.rest && !data?.default_oauth2_credentials) ||
          foundApplicationType?.mandatory_rest_url
            ? serverData?.rest
            : '',
        auth: serverData?.auth ? serverData?.auth : '',
        ui: serverData?.ui ? serverData?.ui : '',
        oidc: serverData?.oidc ? serverData?.oidc : '',
      };
      setFormValue(editForm);
      setOpenModal(true);
      setAuthorizeButton(true);
    }
  };

  // Show advanced options for integration
  const handleShowAdvancedOptions = () => {
    if (advancedOptions) {
      setAdvancedOptions(false);
      if (applicationType?.mandatory_rest_url) {
        setFormValue({
          ...formValue,
          tenant_id: '',
          client_id: '',
          client_secret: '',
          auth: '',
          ui: '',
          oidc: '',
        });
      } else {
        setFormValue({
          ...formValue,
          tenant_id: '',
          client_id: '',
          client_secret: '',
          rest: '',
          auth: '',
          ui: '',
          oidc: '',
        });
      }
    } else {
      setAdvancedOptions(true);
    }
    setAdvancedOptions(!advancedOptions);
  };

  // Open deletion modal
  const handleDelete = (data) => {
    setDeleteData(data);
    setOpen(true);
  };
  const handleConfirmed = (value) => {
    if (value) deleteMutate();
  };

  // Open edit application modal
  const handleEdit = (data) => {
    setSteps(0);
    setEditData(data);
    dispatch(handleIsAdminEditing(true));

    const serverData = getServerData(data);
    const oauth2 = data?.oauth2_data[0];
    handleApplicationType(data?.type);
    const foundApplicationType = Object.values(applicationDataTypes['items']).find(
      (item) => item.id === data?.type,
    );
    const editForm = {
      type: data?.type,
      organization_id: data?.organization_id,
      name: data?.name,
      description: data?.description,
      tenant_id: serverData?.tenant ? serverData?.tenant : '',
      client_id:
        oauth2?.client_id && !data?.default_oauth2_credentials ? oauth2?.client_id : '',
      client_secret:
        oauth2?.client_secret && !data?.default_oauth2_credentials
          ? oauth2?.client_secret
          : '',
      redirect_uris: oauth2?.redirect_uris ? oauth2?.redirect_uris : [],
      rest:
        (serverData?.rest && !data?.default_oauth2_credentials) ||
        foundApplicationType?.mandatory_rest_url
          ? serverData?.rest
          : '',
      auth: serverData?.auth ? serverData?.auth : '',
      ui: serverData?.ui ? serverData?.ui : '',
      oidc: serverData?.oidc ? serverData?.oidc : '',
    };

    setFormValue(editForm);
    setAdvancedOptions(!data?.default_oauth2_credentials);
    setOpenModal(true);
  };

  // Get icons for the applications
  useEffect(() => {
    (async () => {
      if (allApplications?.items) {
        setLoading(true);
        // merge icons data with application data
        const customAppItems = allApplications?.items?.reduce(
          (accumulator, currentValue) => {
            // prettier-ignore
            switch (currentValue?.type) {
            case 'gitlab':
              accumulator.push({
                ...currentValue,
                iconUrl: '/gitlab_logo.png',
                status: currentValue?.status,
              });
              break;
            case 'bitbucket':
              accumulator.push({
                ...currentValue,
                iconUrl: '/bitbucket_logo.png',
                status: currentValue?.status,
              });
              break;
            case 'github':
              accumulator.push({
                ...currentValue,
                iconUrl: '/github_logo.png',
                status: currentValue?.status,
              });
              break;
            case 'jira':
              accumulator.push({
                ...currentValue,
                iconUrl: '/jira_logo.png',
                status: currentValue?.status,
              });
              break;
            case 'glideyoke':
              accumulator.push({
                ...currentValue,
                iconUrl: '/glide_logo.png',
                status: currentValue?.status,
              });
              break;
            case 'valispace':
              accumulator.push({
                ...currentValue,
                iconUrl: '/valispace_logo.png',
                status: currentValue?.status,
              });
              break;
            case 'codebeamer':
              accumulator.push({
                ...currentValue,
                iconUrl: '/codebeamer_logo.png',
                status: currentValue?.status,
              });
              break;
            case 'dng':
              accumulator.push({
                ...currentValue,
                iconUrl: '/dng_logo.png',
                status: currentValue?.status,
              });
              break;
            default:
              accumulator.push({
                ...currentValue,
                iconUrl: '/default_logo.png',
                status: currentValue?.status,
              });
              break;
            }
            return accumulator;
          },
          [],
        );
        setAppsWithIcon(customAppItems);
      }
    })();
    setLoading(false);
  }, [allApplications]);

  useEffect(() => {
    if (organizationData?.name) {
      setEditFormTitle(`${organizationData.name} - Edit external integration`);
      setNewFormTitle('Add external integration');
    } else {
      setEditFormTitle('Edit external integration');
      setNewFormTitle('Add external integration');
    }
  }, [organizationData]);

  // send props in the batch action table
  const tableProps = {
    title: 'Applications',
    rowData: allApplications ? appsWithIcon : [],
    headerData,
    handleEdit,
    handleDelete,
    handleAddNew,
    handlePagination,
    handleChangeLimit,
    authorizeModal: handleOpenAuthorizeModal,
    totalItems: allApplications?.total_items,
    totalPages: allApplications?.total_pages,
    pageSize,
    page: allApplications?.page,
    inpPlaceholder: 'Search Application',
  };

  // manage step 2
  const manageStep2 =
    steps == 1 ? 'process' : steps === 2 && authorizedAppConsumption ? 'finish' : 'wait';
  return (
    <div>
      <Modal
        backdrop={'static'}
        keyboard={false}
        size="md"
        open={openModal}
        onClose={handleCloseModal}
      >
        <Modal.Header>
          <Modal.Title className="adminModalTitle">
            {isAdminEditing ? editFormTitle : newFormTitle}
          </Modal.Title>

          <Steps current={steps} style={{ marginTop: '5px' }}>
            <Steps.Item />
            <Steps.Item status={manageStep2} />
            <Steps.Item />
          </Steps>
        </Modal.Header>

        <Modal.Body className={modalBodyStyle}>
          {steps === 0 && (
            <div className="show-grid step-1">
              <Form
                fluid
                ref={appFormRef}
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

                  <FlexboxGrid.Item style={{ marginBottom: '25px' }} colspan={24}>
                    <SelectField
                      name="type"
                      label="Integration type"
                      placeholder="Select integration"
                      accepter={CustomReactSelect}
                      apiURL={`${lmApiUrl}/external-integrations`}
                      error={formError.type}
                      reqText="Integration type is required"
                      disabled={isAdminEditing}
                      onChange={(value) => handleApplicationType(value)}
                    />
                  </FlexboxGrid.Item>

                  <FlexboxGrid.Item colspan={24} style={{ marginBottom: '25px' }}>
                    <TextField
                      name="name"
                      label="Name"
                      reqText="Integration name is required"
                    />
                  </FlexboxGrid.Item>

                  <FlexboxGrid.Item colspan={24}>
                    <TextField
                      name="description"
                      label="Description"
                      accepter={TextArea}
                      rows={3}
                    />
                  </FlexboxGrid.Item>

                  {(applicationType?.mandatory_rest_url || advancedOptions) && (
                    <FlexboxGrid.Item colspan={11} style={{ marginBottom: '3%' }}>
                      <TextField
                        name="rest"
                        label="REST URL"
                        reqText="REST URL is required"
                      />
                    </FlexboxGrid.Item>
                  )}

                  {/* eslint-disable-next-line max-len */}
                  {(advancedOptions ||
                    applicationType?.has_oidc ||
                    applicationType?.has_microservice ||
                    applicationType?.mandatory_client_secret) && (
                    <>
                      {/* eslint-disable-next-line max-len */}
                      {(applicationType?.authentication_type === 'oauth2' ||
                        applicationType?.has_oidc ||
                        applicationType?.mandatory_client_secret) && (
                        <>
                          <FlexboxGrid.Item colspan={11} style={{ marginBottom: '3%' }}>
                            <TextField
                              name="client_id"
                              label="Client ID"
                              reqText="OAuth2 client ID is required"
                            />
                          </FlexboxGrid.Item>

                          <FlexboxGrid.Item colspan={11} style={{ marginBottom: '3%' }}>
                            <TextField
                              name="client_secret"
                              label="Client secret"
                              reqText="OAuth2 secret is required"
                            />
                          </FlexboxGrid.Item>
                        </>
                      )}

                      {applicationType?.has_microservice && (
                        <React.Fragment>
                          <FlexboxGrid.Item colspan={11} style={{ marginBottom: '3%' }}>
                            <TextField
                              name="auth"
                              label="Auth server URL"
                              reqText="Authentication server of app is required"
                            />
                          </FlexboxGrid.Item>

                          <FlexboxGrid.Item colspan={11} style={{ marginBottom: '3%' }}>
                            <TextField
                              name="ui"
                              label="UI server URL"
                              reqText="UI server of app is required"
                            />
                          </FlexboxGrid.Item>

                          <FlexboxGrid.Item colspan={11} style={{ marginBottom: '3%' }}>
                            <TextField
                              name="tenant_id"
                              label="Tenant ID"
                              reqText="Tenant ID is required"
                            />
                          </FlexboxGrid.Item>
                        </React.Fragment>
                      )}

                      {applicationType?.has_oidc && (
                        <React.Fragment>
                          <FlexboxGrid.Item colspan={11}>
                            <TextField
                              name="oidc"
                              label="OIDC issuer"
                              reqText="OIDC issuer is required"
                            />
                          </FlexboxGrid.Item>
                        </React.Fragment>
                      )}
                    </>
                  )}
                  {/* eslint-disable-next-line max-len */}
                  {applicationType?.show_advanced && applicationType && (
                    <>
                      <FlexboxGrid.Item
                        style={{ marginTop: '2px', marginBottom: '2px' }}
                        colspan={22}
                      >
                        <Button appearance="link" onClick={handleShowAdvancedOptions}>
                          {/* eslint-disable-next-line max-len */}
                          {advancedOptions ? 'Show less' : 'Advanced options'}
                        </Button>
                      </FlexboxGrid.Item>
                    </>
                  )}
                </FlexboxGrid>
              </Form>

              <FlexboxGrid justify="end" style={{ margin: '25px 0 0 0' }}>
                <Button
                  className="adminModalFooterBtn"
                  appearance="default"
                  onClick={handleCloseModal}
                >
                  {appCreateSuccess ? 'Close' : 'Cancel'}
                </Button>
                <Button
                  appearance="primary"
                  color="blue"
                  className="adminModalFooterBtn"
                  onClick={() => {
                    handleAddApplication();
                  }}
                >
                  {appCreateSuccess ? 'Next' : 'Save'}
                </Button>
              </FlexboxGrid>
            </div>
          )}

          {steps === 1 && (
            <div className={step1Container}>
              <h4>{'Authorize the access to the integration'}</h4>
              {(applicationType?.authentication_type === 'oauth2' &&
                steps === 1 &&
                createSuccess) ||
                updateSuccess ||
                (authorizeButton && <Oauth2Waiting data={formValue} />)}
              {
                // prettier-ignore
                (['basic', 'oauth2_ropc'].includes(
                  applicationType?.authentication_type)
                ) &&
                steps === 1 &&
                (createSuccess || updateSuccess || authorizeButton) && (
                  <ExternalLogin appData={formValue} onDataStatus={getExtLoginData} />
                )
              }
              <FlexboxGrid justify="end" className={skipBtn}>
                <Button
                  appearance="ghost"
                  color="blue"
                  className="adminModalFooterBtn"
                  onClick={() => setSteps(2)}
                >
                  Skip
                </Button>
              </FlexboxGrid>
            </div>
          )}

          {steps === 2 && (
            <div className={step2Container}>
              {authorizedAppConsumption ? (
                <h4>You have authorized</h4>
              ) : (
                <h4>You have not authorized</h4>
              )}

              {authorizedAppConsumption ? (
                <h5>
                  Close this window and go back to the application to start using it
                </h5>
              ) : (
                <h5>You can skip it for now</h5>
              )}

              <FlexboxGrid justify="end">
                <Button
                  appearance="primary"
                  color="blue"
                  className="adminModalFooterBtn"
                  onClick={handleCloseModal}
                >
                  Close
                </Button>
              </FlexboxGrid>
            </div>
          )}
        </Modal.Body>
      </Modal>

      {/* --- oauth 2 modal ---  */}
      <Oauth2Modal ref={oauth2ModalRef} />

      {(isLoading || loading || createLoading || updateLoading || deleteLoading) && (
        <UseLoader />
      )}
      {/* confirmation modal  */}
      <AlertModal
        open={open}
        setOpen={setOpen}
        content={'Do you want to delete the integration?'}
        handleConfirmed={handleConfirmed}
      />

      <AdminDataTable props={tableProps} />
    </div>
  );
};

export default Application;
