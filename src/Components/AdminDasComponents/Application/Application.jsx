import React, { useState, useContext, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Swal from 'sweetalert2';
import AuthContext from '../../../Store/Auth-Context';
import {
  handleCurrPageTitle,
  handleIsAdminEditing,
} from '../../../Redux/slices/navSlice';
import { Button, FlexboxGrid, Form, Modal, Schema, Steps } from 'rsuite';
import AdminDataTable from '../AdminDataTable';
import TextField from '../TextField';
import SelectField from '../SelectField';
import CustomSelect from '../CustomSelect';
import TextArea from '../TextArea';
import UseLoader from '../../Shared/UseLoader';
import {
  fetchCreateData,
  fetchDeleteData,
  fetchGetData,
  fetchUpdateData,
} from '../../../Redux/slices/useCRUDSlice';
import { fetchApplicationPublisherIcon } from '../../../Redux/slices/applicationSlice';
import Oauth2Modal from '../../Oauth2Modal/Oauth2Modal';

const lmApiUrl = process.env.REACT_APP_LM_REST_API_URL;

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
    header: 'Rootservices URL',
    key: 'rootservices_url',
  },
  {
    header: 'Status',
    statusKey: 'status',
    width: 120,
  },
];

const { StringType, NumberType } = Schema.Types;

const Application = () => {
  const { refreshData, isAdminEditing } = useSelector((state) => state.nav);
  const { crudData, isCreated, isDeleted, isUpdated, isCrudLoading } = useSelector(
    (state) => state.crud,
  );
  const { iconData } = useSelector((state) => state.applications);

  // application form validation schema
  const model = Schema.Model({
    name: StringType()
      .addRule((value) => {
        const regex = /^[a-zA-Z0-9_-]+$/;
        return regex.test(value);
      }, 'Please try to enter valid application name')
      .isRequired('This field is required.'),
    rootservices_url: isAdminEditing
      ? StringType()
      : StringType().isRequired('This field is required.'),
    organization_id: NumberType().isRequired('This field is required.'),
    description: StringType().isRequired('This field is required.'),
  });

  const [currPage, setCurrPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [formError, setFormError] = useState({});
  const [editData, setEditData] = useState({});
  const [openModal, setOpenModal] = useState(false);
  const [steps, setSteps] = useState(0);
  const [appsWithIcon, setAppsWithIcon] = useState([]);
  const [appCreateSuccess, setAppCreateSuccess] = useState(false);
  const [authorizeFrameSrc, setAuthorizeFrameSrc] = useState('');
  const [authorizedAppConsumption, setAuthorizedAppConsumption] = useState(false);

  const [formValue, setFormValue] = useState({
    name: '',
    rootservices_url: '',
    organization_id: '',
    description: '',
  });
  const appFormRef = useRef();
  const iframeRef = useRef(null);
  const oauth2ModalRef = useRef();
  const authCtx = useContext(AuthContext);
  const dispatch = useDispatch();

  // get all applications
  useEffect(() => {
    dispatch(handleCurrPageTitle('Applications'));
    const getUrl = `${lmApiUrl}/application?page=${currPage}&per_page=${pageSize}`;
    dispatch(
      fetchGetData({
        url: getUrl,
        token: authCtx.token,
        stateName: 'allApplications',
      }),
    );
  }, [isCreated, isUpdated, isDeleted, pageSize, currPage, refreshData]);

  // get icons for the applications
  useEffect(() => {
    if (crudData?.allApplications?.items) {
      let tempData = [];
      crudData?.allApplications?.items?.forEach((item) => {
        tempData.push({
          id: item?.id,
          rootservicesUrl: item?.rootservices_url ? item.rootservices_url : null,
        });
      });
      dispatch(
        fetchApplicationPublisherIcon({
          applicationData: tempData,
        }),
      );
    }
  }, [crudData?.allApplications]);

  // merging application icons with applications data
  useEffect(() => {
    const customAppItems = crudData?.allApplications?.items?.reduce((acc, curr) => {
      if (curr?.rootservices_url) {
        iconData?.forEach((icon) => {
          if (curr.id === icon.id) {
            const withIcon = {
              ...curr,
              iconUrl: icon.iconUrl,
              status: curr?.oauth2_application[0]?.token_status?.status,
            };
            acc.push(withIcon);
          }
        });
      } else {
        acc.push({
          ...curr,
          iconUrl: null,
          status: curr?.oauth2_application[0]?.token_status?.status,
        });
      }
      return acc;
    }, []);
    setAppsWithIcon(customAppItems);
  }, [iconData, crudData?.allApplications]);

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

  // Check for changes to the iframe URL when it is loaded
  const handleLoad = () => {
    const currentUrl = iframeRef.current.contentWindow.location.href;
    if (currentUrl !== authorizeFrameSrc) {
      setAuthorizeFrameSrc(currentUrl);
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

  const handleAddApplication = () => {
    if (!appFormRef.current.check()) {
      return;
    } else if (isAdminEditing) {
      // edit application
      const putUrl = `${lmApiUrl}/application/${editData?.id}`;
      dispatch(
        fetchUpdateData({
          url: putUrl,
          token: authCtx.token,
          bodyData: formValue,
        }),
      );
      setOpenModal(false);
    } else {
      const redirect_uris = [
        `${lmApiUrl}/application/` + 'consumer/callback?consumer=' + formValue.name,
      ];
      const scopes = 'rest_api_access';
      const response_types = ['code'];
      const grant_types = ['service_provider', 'authorization_code'];

      const postUrl = `${lmApiUrl}/application`;
      dispatch(
        fetchCreateData({
          url: postUrl,
          token: authCtx.token,
          bodyData: { ...formValue, scopes, response_types, grant_types, redirect_uris },
          sendMsg: false,
        }),
      )
        .then((appRes) => {
          if (appRes.payload) {
            if (appRes.payload.response?.status) {
              setAppCreateSuccess(true);
              setSteps(1);

              let query = `client_id=${appRes.payload.response?.client_id}`;
              query += `&scope=${scopes}`;

              response_types?.forEach((response_type) => {
                if (response_types?.indexOf(response_type) === 0) {
                  query += `&response_type=${response_type}`;
                } else {
                  query += ` ${response_type}`;
                }
              }, query);

              query += `&redirect_uri=${redirect_uris[0]}`;
              // eslint-disable-next-line max-len
              let authorizeUri =
                appRes.payload?.response?.oauth_client_authorize_uri + '?' + query;
              setAuthorizeFrameSrc(authorizeUri);
            }
          } else {
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: 'Something went wrong!',
            });
          }
        })
        .catch((error) => console.error(error));
    }

    // setOpenModal(false);
    if (isAdminEditing) dispatch(handleIsAdminEditing(false));
  };

  window.addEventListener(
    'message',
    function (event) {
      let message = event.data;
      if (!message.source) {
        if (message.toString()?.startsWith('consumer-token-info')) {
          const response = JSON.parse(message?.substr('consumer-token-info:'?.length));
          if (response?.consumerStatus === 'success') {
            setAuthorizedAppConsumption(true);
            setSteps(2);
          }
        }
      }
    },
    false,
  );

  // reset form
  const handleResetForm = () => {
    setEditData({});
    setFormValue({
      name: '',
      rootservices_url: '',
      organization_id: '',
      description: '',
    });
    setAuthorizedAppConsumption(false);
  };

  // handle open add application modal
  const handleAddNew = () => {
    handleResetForm();
    setOpenModal(true);
  };
  // handle close modal
  const handleCloseModal = () => {
    setOpenModal(false);
    setAppCreateSuccess(false);
    setTimeout(() => {
      handleResetForm();
      setSteps(0);
      dispatch(handleIsAdminEditing(false));
    }, 500);
  };

  // handle oauth2 modal for authorize applications
  const handleOpenAuthorizeModal = (data) => {
    if (data?.status && data?.status?.toLowerCase() !== 'valid') {
      if (oauth2ModalRef.current && oauth2ModalRef.current?.verifyAndOpenModal) {
        oauth2ModalRef.current?.verifyAndOpenModal(data, data?.id);
      }
    }
  };

  // handle delete application
  const handleDelete = (data) => {
    Swal.fire({
      title: 'Are you sure',
      icon: 'info',
      text: 'Do you want to delete the Application!!',
      cancelButtonColor: 'red',
      showCancelButton: true,
      confirmButtonText: 'Delete',
      confirmButtonColor: '#3085d6',
      reverseButtons: true,
    }).then((value) => {
      if (value.isConfirmed) {
        const deleteUrl = `${lmApiUrl}/application/${data?.id}`;
        dispatch(fetchDeleteData({ url: deleteUrl, token: authCtx.token }));
      }
    });
  };
  // handle Edit application
  const handleEdit = (data) => {
    setEditData(data);
    dispatch(handleIsAdminEditing(true));
    setFormValue({
      name: data?.name,
      rootservices_url: data?.rootservices_url,
      organization_id: data?.organization_id,
      description: data?.description,
    });
    setOpenModal(true);
  };

  // send props in the batch action table
  const tableProps = {
    title: 'Applications',
    rowData: crudData?.allApplications?.items?.length ? appsWithIcon : [],
    headerData,
    handleEdit,
    handleDelete,
    handleAddNew,
    handlePagination,
    handleChangeLimit,
    authorizeModal: handleOpenAuthorizeModal,
    totalItems: crudData?.allApplications?.total_items,
    totalPages: crudData?.allApplications?.total_pages,
    pageSize,
    page: crudData?.allApplications?.page,
    inpPlaceholder: 'Search Application',
  };
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
              <Steps.Item status={steps == 1 ? 'process' : 'wait'} />
              <Steps.Item />
            </Steps>
          )}
        </Modal.Header>

        <Modal.Body style={{ padding: '0 10px 30px' }}>
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
                  <FlexboxGrid.Item colspan={isAdminEditing ? 24 : 11}>
                    <TextField
                      name="name"
                      label="Name"
                      reqText="Application name is required"
                    />
                  </FlexboxGrid.Item>

                  {!isAdminEditing && (
                    <FlexboxGrid.Item colspan={11}>
                      <TextField
                        name="rootservices_url"
                        label="Root Services URL"
                        reqText="Root Services URL of OSLC application is required"
                      />
                    </FlexboxGrid.Item>
                  )}

                  <FlexboxGrid.Item style={{ margin: '30px 0' }} colspan={24}>
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

                  <FlexboxGrid.Item colspan={24} style={{ marginBottom: '20px' }}>
                    <TextField
                      name="description"
                      label="Description"
                      accepter={TextArea}
                      rows={5}
                      reqText="application description is required"
                    />
                  </FlexboxGrid.Item>
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
            <div style={{ textAlign: 'center' }}>
              <h4>{'The application has been registered successfully'}</h4>

              <iframe
                className={'authorize-iframe'}
                ref={iframeRef}
                src={authorizeFrameSrc}
              />
              <FlexboxGrid justify="end" style={{ marginTop: '20px' }}>
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
            <div style={{ textAlign: 'center' }}>
              {authorizedAppConsumption ? (
                <h4 style={{ marginBottom: '10px' }}>You have authorized</h4>
              ) : (
                <h4 style={{ marginBottom: '10px' }}>You have not authorized</h4>
              )}

              {authorizedAppConsumption ? (
                <h5 style={{ marginBottom: '20px' }}>
                  Close this window and go back to the application to start using it
                </h5>
              ) : (
                // eslint-disable-next-line max-len
                <h5 style={{ marginBottom: '20px' }}>You can skip it for now</h5>
              )}

              <FlexboxGrid justify="end" style={{ marginTop: '30px' }}>
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

      {isCrudLoading && <UseLoader />}

      <AdminDataTable props={tableProps} />
    </div>
  );
};

export default Application;
