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
import { fetchApplicationPublisherIcon } from '../../../Redux/slices/applicationSlice';
import Oauth2Modal from '../../Oauth2Modal/Oauth2Modal';
import { handleIsOauth2ModalOpen } from '../../../Redux/slices/oauth2ModalSlice';
import fetchAPIRequest from '../../../apiRequests/apiRequest';
import { useMutation, useQuery } from '@tanstack/react-query';
import styles from './Application.module.scss';
import {
  MICROSERVICES_APPLICATION_TYPES,
  OAUTH2_APPLICATION_TYPES,
  THIRD_PARTY_INTEGRATIONS,
  USER_PASSWORD_APPLICATION_TYPES,
} from '../../../App.jsx';
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

const Application = () => {
  const appFormRef = useRef();
  const iframeRef = useRef(null);
  const oauth2ModalRef = useRef();
  const authCtx = useContext(AuthContext);
  const dispatch = useDispatch();
  const toaster = useToaster();
  const { refreshData, isAdminEditing } = useSelector((state) => state.nav);

  /** Model Schema */
  const model = Schema.Model({
    type: StringType().isRequired('This field is required'),
    organization_id: NumberType().isRequired('This field is required.'),
    name: StringType()
      .addRule((value) => {
        const regex = /^[a-zA-Z0-9_-]+$/;
        return regex.test(value);
      }, 'Type only alphanumeric characters, underscores, and dashes')
      .isRequired('This field is required'),
    server_url: StringType().isRequired('This field is required'),
    description: StringType(),
    client_id: StringType(),
    client_secret: StringType(),
    server_url_auth: StringType(),
    server_url_ui: StringType(),
    tenant_id: StringType(),
  });

  /** Const variables */
  const [formError, setFormError] = useState({});
  const [editData, setEditData] = useState({});
  const [deleteData, setDeleteData] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [loading, setLoading] = useState(false);

  const [openModal, setOpenModal] = useState(false);
  const [formValue, setFormValue] = useState({
    type: '',
    organization_id: '',
    name: '',
    server_url: '',
    description: '',
    client_id: '',
    client_secret: '',
    server_url_auth: '',
    server_url_ui: '',
    tenant_id: '',
  });

  /** Application variables */
  const [steps, setSteps] = useState(0);
  const [appsWithIcon, setAppsWithIcon] = useState([]);
  const [appCreateSuccess, setAppCreateSuccess] = useState(false);
  const [authorizeFrameSrc, setAuthorizeFrameSrc] = useState('');
  const [authorizedAppConsumption, setAuthorizedAppConsumption] = useState(false);
  const [isAppAuthorize, setIsAppAuthorize] = useState(false);
  const [open, setOpen] = useState(false);

  // required data for create the application using OSLC APIs
  const redirect_uris = [
    `${lmApiUrl}/application/consumer/callback?consumer=${formValue.name}`,
  ];
  const scopes = 'rest_api_access';
  const response_types = ['code'];
  const grant_types = ['service_provider', 'authorization_code'];
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

  // GET: Fetch data using react-query
  const {
    data: allApplications,
    isLoading,
    refetch: refetchApplications,
  } = useQuery(['application'], () =>
    fetchAPIRequest({
      urlPath: `application?page=${currentPage}&per_page=${pageSize}`,
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
        urlPath: 'application',
        token: authCtx.token,
        method: 'POST',
        body: { ...formValue, ...payload },
        showNotification: showNotification,
      }),
    {
      onSuccess: (res) => {
        if (res) {
          if (res?.status) {
            setAppCreateSuccess(true);
            setSteps(1);

            let query = `client_id=${res?.client_id}`;
            query += `&scope=${scopes}`;

            response_types?.forEach((response_type) => {
              if (response_types?.indexOf(response_type) === 0) {
                query += `&response_type=${response_type}`;
              } else {
                query += ` ${response_type}`;
              }
            }, query);

            query += `&redirect_uri=${redirect_uris[0]}`;
            let authorizeUri = res?.oauth_client_authorize_uri + '?' + query;
            setAuthorizeFrameSrc(authorizeUri);
          }
        }
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
        urlPath: `application/${editData?.id}`,
        token: authCtx.token,
        method: 'PUT',
        body: formValue,
        showNotification: showNotification,
      }),
    {
      onSuccess: () => {},
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
        urlPath: `application/${deleteData?.id}`,
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

  // Check for changes to the iframe URL when it is loaded
  const handleLoad = () => {
    const currentUrl = iframeRef.current.contentWindow.location.href;
    if (currentUrl !== authorizeFrameSrc) {
      setAuthorizeFrameSrc(currentUrl);
    }
  };

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
    if (!appFormRef.current.check()) {
      return;
    } else if (isAdminEditing) {
      // edit application
      updateMutate();
      setOpenModal(false);
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
    setFormValue({
      type: '',
      organization_id: '',
      name: '',
      server_url: '',
      description: '',
      client_id: '',
      client_secret: '',
      server_url_auth: '',
      server_url_ui: '',
      tenant_id: '',
    });
    setAuthorizedAppConsumption(false);
    setIsAppAuthorize(false);
    setAuthorizeFrameSrc('');
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
    setTimeout(() => {
      handleResetForm();
      dispatch(handleIsAdminEditing(false));
    }, 500);
  };

  /** Custom functions for authorization */
  //handle application type
  const handleApplicationType = (value) => {
    formValue.type = value;
    setFormValue({ ...formValue });
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
    setFormValue({
      type: data?.type,
      organization_id: data?.organization_id,
      name: data?.name,
      server_url: data?.server_url,
      description: data?.description,
      client_id: data?.client_id,
      client_secret: data?.client_secret,
      server_url_auth: data?.server_url_auth,
      server_url_ui: data?.server_url_ui,
      tenant_id: data?.tenant_id,
    });
    setOpenModal(true);
  };

  /** Effect declarations */

  // Get applications data and keep it updated
  useEffect(() => {
    dispatch(handleCurrPageTitle('Applications'));
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

  // Get icons for the applications
  useEffect(() => {
    (async () => {
      if (allApplications?.items) {
        setLoading(true);
        let tempData = [];
        allApplications?.items?.forEach((item) => {
          tempData.push({
            id: item?.id,
            rootservicesUrl: item?.server_url ? item.server_url : null,
          });
        });

        const response = await dispatch(
          fetchApplicationPublisherIcon({
            applicationData: tempData,
          }),
        );
        // merge icons data with application data
        const customAppItems = allApplications?.items?.reduce(
          (accumulator, currentValue) => {
            if (currentValue?.server_url && currentValue?.type === 'oslc') {
              if (response.payload) {
                if (response?.payload?.length) {
                  response?.payload?.forEach((icon) => {
                    if (currentValue.id === icon.id) {
                      const withIcon = {
                        ...currentValue,
                        iconUrl: icon.iconUrl,
                        // eslint-disable-next-line max-len
                        status: currentValue?.oauth2_application
                          ? currentValue?.oauth2_application[0]?.token_status?.status
                          : '',
                      };
                      accumulator.push(withIcon);
                    }
                  });
                }
              }
            } else if (THIRD_PARTY_INTEGRATIONS.includes(currentValue?.type)) {
              if (currentValue?.type === 'gitlab') {
                accumulator.push({
                  ...currentValue,
                  iconUrl: '/gitlab_logo.png',
                  status: currentValue?.oauth2_application[0]?.token_status?.status,
                });
              } else if (currentValue?.type === 'jira') {
                accumulator.push({
                  ...currentValue,
                  iconUrl: '/jira_logo.png',
                  status: currentValue?.oauth2_application[0]?.token_status?.status,
                });
              }
              if (currentValue?.type === 'glideyoke') {
                accumulator.push({
                  ...currentValue,
                  iconUrl: '/glide_logo.png',
                  status: currentValue?.oauth2_application[0]?.token_status?.status,
                });
              }
              if (currentValue?.type === 'valispace') {
                accumulator.push({
                  ...currentValue,
                  iconUrl: '/valispace_logo.png',
                  status: currentValue?.oauth2_application[0]?.token_status?.status,
                });
              }
            } else {
              accumulator.push({
                ...currentValue,
                iconUrl: '/default_logo.png',
                status: currentValue?.oauth2_application[0]?.token_status?.status,
              });
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

  // Manage Redirect URI
  useEffect(() => {
    if (formValue?.type === 'oslc') {
      setPayload({
        redirect_uris,
        scopes,
        response_types,
        grant_types,
      });
    } else if (OAUTH2_APPLICATION_TYPES.includes(formValue?.type)) {
      setPayload({
        redirect_uris: [`${window.location.origin}/oauth2/callback`],
      });
    } else if (MICROSERVICES_APPLICATION_TYPES.includes(formValue?.type)) {
      setPayload({
        client_id: formValue?.tenant_id,
        client_secret: formValue?.tenant_id,
      });
    }
  }, [formValue]);

  // manage oauth iframe
  useEffect(() => {
    if (iframeRef.current) {
      iframeRef.current.addEventListener('load', handleLoad);
    }
    return () => {
      if (iframeRef.current) {
        iframeRef.current.removeEventListener('load', handleLoad);
      }
    };
  }, [iframeRef]);

  /** Event listeners */
  window.addEventListener(
    'message',
    function (event) {
      let message = event.data;
      if (!message.source) {
        if (message.toString()?.startsWith('consumer-token-info')) {
          const response = JSON.parse(message?.substr('consumer-token-info:'?.length));
          if (response?.consumerStatus === 'success') {
            setIsAppAuthorize(true);
            dispatch(handleIsOauth2ModalOpen(false));
            if (steps === 1) {
              setAuthorizedAppConsumption(true);
              setSteps(2);
            }
          }
        }
      }
    },
    false,
  );

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
            {isAdminEditing ? 'Edit Application' : 'Add New Application'}
          </Modal.Title>

          {!isAdminEditing && (
            <Steps current={steps} style={{ marginTop: '5px' }}>
              <Steps.Item />
              <Steps.Item status={manageStep2} />
              <Steps.Item />
            </Steps>
          )}
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
                  <FlexboxGrid.Item style={{ margin: '25px 0' }} colspan={11}>
                    <SelectField
                      name="organization_id"
                      label="Organization"
                      placeholder="Select Organization"
                      accepter={CustomReactSelect}
                      apiURL={`${lmApiUrl}/organization`}
                      error={formError.organization_id}
                      reqText="Organization Id is required"
                    />
                  </FlexboxGrid.Item>

                  <FlexboxGrid.Item style={{ margin: '25px 0' }} colspan={11}>
                    <SelectField
                      name="type"
                      label="Application type"
                      placeholder="Select application type"
                      accepter={CustomReactSelect}
                      apiURL={`${lmApiUrl}/external-integrations`}
                      error={formError.type}
                      reqText="Application type is required"
                      disabled={isAdminEditing}
                      onChange={(value) => handleApplicationType(value)}
                    />
                  </FlexboxGrid.Item>

                  <FlexboxGrid.Item colspan={11}>
                    <TextField
                      name="name"
                      label="Name"
                      reqText="Application name is required"
                    />
                  </FlexboxGrid.Item>

                  <FlexboxGrid.Item colspan={11}>
                    <TextField
                      name="server_url"
                      label={
                        formValue?.type === 'oslc' ? 'Rootservices URL' : 'Server URL'
                      }
                      reqText="Server URL is required"
                      disabled={isAdminEditing}
                    />
                  </FlexboxGrid.Item>

                  <FlexboxGrid.Item
                    colspan={24}
                    style={{
                      marginBottom: '25px',
                      marginTop: '30px',
                    }}
                  >
                    <TextField
                      name="description"
                      label="Description"
                      accepter={TextArea}
                      rows={3}
                    />
                  </FlexboxGrid.Item>
                  {(formValue?.type === 'gitlab' || formValue?.type === 'jira') && (
                    <React.Fragment>
                      <FlexboxGrid.Item colspan={11}>
                        <TextField
                          name="client_id"
                          label="Client ID"
                          reqText="OAuth2 client ID of app is required"
                          disabled={isAdminEditing}
                        />
                      </FlexboxGrid.Item>

                      <FlexboxGrid.Item colspan={11} style={{ marginBottom: '5%' }}>
                        <TextField
                          name="client_secret"
                          label="Client secret"
                          reqText="OAuth2 client secret of app is required"
                          disabled={isAdminEditing}
                        />
                      </FlexboxGrid.Item>
                    </React.Fragment>
                  )}
                  {formValue?.type === 'glideyoke' && (
                    <React.Fragment>
                      <FlexboxGrid.Item colspan={11}>
                        <TextField
                          name="server_url_auth"
                          label="Authentication server"
                          reqText="Authentication server of app is required"
                        />
                      </FlexboxGrid.Item>

                      <FlexboxGrid.Item colspan={11}>
                        <TextField
                          name="server_url_ui"
                          label="UI server"
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
              <h4>{'Authorize the access to the application'}</h4>
              {formValue?.type === 'oslc' && (
                <iframe
                  className={'authorize-iframe'}
                  ref={iframeRef}
                  src={authorizeFrameSrc}
                />
              )}
              {(formValue?.type === 'gitlab' || formValue?.type === 'jira') &&
                steps === 1 &&
                createSuccess && <Oauth2Waiting data={formValue} />}

              {
                // prettier-ignore
                USER_PASSWORD_APPLICATION_TYPES.includes(formValue?.type) &&
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
        content={'Do you want to delete the application?'}
        handleConfirmed={handleConfirmed}
      />

      <AdminDataTable props={tableProps} />
    </div>
  );
};

export default Application;
