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
    width: 120,
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

  const {
    data: organizationData,
    // isLoading: organizationLoading,
    // refetch: refetchOrganization,
  } = useQuery(['organization'], () =>
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
        console.log('Create: ', res);
      },
      onError: () => {},
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
        console.log('Update: ', res);
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

  // oauth2 modal for authorize applications
  const handleOpenAuthorizeModal = (data) => {
    if (data?.status && data?.status?.toLowerCase() !== 'valid') {
      setIsAppAuthorize(false);
      if (oauth2ModalRef.current && oauth2ModalRef.current?.verifyAndOpenModal) {
        oauth2ModalRef.current?.verifyAndOpenModal(data, data?.id);
      }
    } else if (data?.status && data?.status?.toLowerCase() === 'valid') {
      const message = (
        <Message closable showIcon type="info" style={{ fontSize: '17px' }}>
          Sorry, This application has been already authorized
        </Message>
      );
      toaster.push(message, { placement: 'bottomCenter', duration: 5000 });
    }
  };

  // Show advanced options for integration
  const handleShowAdvancedOptions = () => {
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

    // get data from authentication server array.
    const serverData = {};
    data?.authentication_server?.forEach((item) => {
      if (data?.type === 'codebeamer') {
        const isOidc = item?.type?.toLowerCase()?.includes('oidc');
        if (isOidc) serverData['oidc_url'] = item?.type;
        else {
          serverData['server_url'] = item?.type;
        }
      } else if (data?.type === 'glideyoke') {
        if (item?.type?.toLowerCase()?.includes('rest')) {
          serverData['server_url'] = item?.type;
        } else if (item?.type?.toLowerCase()?.includes('auth')) {
          serverData['url_auth'] = item?.type;
        } else {
          serverData['url_ui'] = item?.type;
        }
      } else {
        serverData['server_url'] = item.type;
      }
    });

    const oauth2 = data?.oauth2_application;
    setFormValue({
      type: data?.type,
      organization_id: data?.organization_id,
      name: data?.name,
      server_url: serverData?.server_url,
      description: data?.description,
      client_id: oauth2?.client_id ? oauth2?.client_id : '',
      client_secret: oauth2?.client_secret ? oauth2?.client_secret : '',
      server_url_auth: serverData?.url_auth ? serverData?.url_auth : '',
      server_url_ui: serverData?.url_ui ? serverData?.url_ui : '',
      tenant_id: oauth2?.client_id ? oauth2?.client_id : '',
      oidc_url: serverData?.oidc_url ? serverData?.oidc_url : '',
    });
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
      setNewFormTitle(`${organizationData.name} - Add external integration`);
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

          {/* {!isAdminEditing && ( */}
          <Steps current={steps} style={{ marginTop: '5px' }}>
            <Steps.Item />
            <Steps.Item status={manageStep2} />
            <Steps.Item />
          </Steps>
          {/* )} */}
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
                  <FlexboxGrid.Item style={{ margin: '4px 0' }} colspan={11}>
                    <SelectField
                      name="type"
                      label="Integration type"
                      placeholder="Select integration type"
                      accepter={CustomReactSelect}
                      apiURL={`${lmApiUrl}/external-integrations`}
                      error={formError.type}
                      reqText="Integration type is required"
                      disabled={isAdminEditing}
                      onChange={(value) => handleApplicationType(value)}
                    />
                  </FlexboxGrid.Item>

                  <FlexboxGrid.Item colspan={11}>
                    <TextField
                      name="name"
                      label="Name"
                      reqText="Integration name is required"
                    />
                  </FlexboxGrid.Item>

                  <FlexboxGrid.Item
                    colspan={24}
                    style={{
                      marginBottom: '10px',
                      marginTop: '15px',
                    }}
                  >
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

              <FlexboxGrid justify="end">
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
                    if (appCreateSuccess) setSteps(1);
                    else {
                      handleAddApplication();
                    }
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
              {applicationType?.authentication_type === 'oauth2' &&
                steps === 1 &&
                createSuccess && <Oauth2Waiting data={formValue} />}

              {
                // prettier-ignore
                (['basic', 'oauth2_ropc'].includes(
                  applicationType?.authentication_type)
                ) &&
                steps === 1 &&
                createSuccess && (
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
