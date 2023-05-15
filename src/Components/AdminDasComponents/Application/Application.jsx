import React, { useState, useContext, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Swal from 'sweetalert2';
import {
  fetchApplications,
  fetchCreateApp,
  fetchDeleteApp,
  fetchUpdateApp,
} from '../../../Redux/slices/applicationSlice';
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

// import css file
import './Application2.scss';
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
  },
  {
    header: 'Description',
    key: 'description',
  },
  {
    header: 'OSLC Domain',
    key: 'oslc_domain',
  },
  {
    header: 'Rootservices URL',
    key: 'rootservices_url',
  },
];

const { StringType, NumberType } = Schema.Types;

const model = Schema.Model({
  name: StringType().isRequired('This field is required.'),
  label: StringType().isRequired('This field is required.'),
  rootservices_url: StringType().isRequired('This field is required.'),
  client_uri: StringType().isRequired('This field is required.'),
  oslc_domain: StringType().isRequired('This field is required.'),
  organization_id: NumberType().isRequired('This field is required.'),
  description: StringType().isRequired('This field is required.'),
});

const Application = () => {
  const { allApplications, isAppLoading, isAppUpdated, isAppCreated, isAppDeleted } =
    useSelector((state) => state.applications);
  const { refreshData, isAdminEditing } = useSelector((state) => state.nav);

  const [currPage, setCurrPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [formError, setFormError] = useState({});
  const [editData, setEditData] = useState({});
  const [openModal, setOpenModal] = useState(false);
  const [steps, setSteps] = useState(0);
  // const [grant_types, set_grant_types] = useState([]);
  // const [redirect_uris, set_redirect_uris] = useState('');
  // const [response_types, set_response_types] = useState([]);
  // const [scopes, set_scopes]=useState('');

  // const [clientId, setClientId] = useState('');
  // const [clientSecret, setClientSecret] = useState('');
  const [appCreateSuccess, setAppCreateSuccess] = useState(false);
  const [authorizeFrameSrc, setAuthorizeFrameSrc] = useState('');

  const [formValue, setFormValue] = useState({
    name: '',
    label: '',
    rootservices_url: '',
    client_uri: '',
    oslc_domain: '',
    organization_id: '',
    description: '',
  });
  const appFormRef = useRef();
  const iframeRef = useRef(null);
  const authCtx = useContext(AuthContext);
  const dispatch = useDispatch();

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
        fetchUpdateApp({
          url: putUrl,
          token: authCtx.token,
          bodyData: formValue,
        }),
      );
      setOpenModal(false);
    } else {
      // create application
      console.log('Trying to create new application');
      console.log('appFormRef: ', appFormRef);

      const redirect_uris = [
        'https://lm-api-dev.koneksys.com/api/v1/application/' +
          'oauth2-consumer/callback?consumer=' +
          formValue.label,
      ];
      const scope = 'oslc_fetch_access';
      const response_types = ['code'];
      const grant_types = ['service_provider', 'authorization_code'];

      const postUrl = `${lmApiUrl}/application`;
      dispatch(
        fetchCreateApp({
          url: postUrl,
          token: authCtx.token,
          bodyData: { ...formValue, scope, response_types, grant_types, redirect_uris },
          sendMsg: false,
        }),
      )
        .then((response) => {
          if (response) {
            console.log('application:response: ', response);
            if (response?.payload?.status) {
              setAppCreateSuccess(true);
              setSteps(1);
              // setClientId(response.payload.client_id);
              // setClientSecret(response.payload.client_secret);
              let query = `client_id=${response.payload.client_id}`;
              query += `&scope=${scope}`;

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
                response.payload?.oauth_client_authorize_uri + '?' + query;
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
      if (!message.source && message?.data) {
        console.log('windowMessage: ', message);
        if (message.toString()?.startsWith('access-token-data')) {
          const response = JSON.parse(message?.substr('access-token-data:'?.length));

          console.log('response: ', response);
          localStorage.setItem('access_token', response.access_token);
          localStorage.setItem('expires_in', response.expires_in);
          setSteps(2);
        }
      }
    },
    false,
  );

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

  // reset form
  const handleResetForm = () => {
    setEditData({});
    setFormValue({
      name: '',
      label: '',
      rootservices_url: '',
      client_uri: '',
      oslc_domain: '',
      organization_id: '',
      description: '',
    });
  };

  // handle open add application modal
  const handleAddNew = () => {
    handleResetForm();
    setOpenModal(true);
  };
  // handle close modal
  const handleCloseModal = async () => {
    await setOpenModal(false);
    await setSteps(0);
    handleResetForm();
    setAppCreateSuccess(false);
  };

  useEffect(() => {
    dispatch(handleCurrPageTitle('Applications'));

    const getUrl = `${lmApiUrl}/application?page=${currPage}&per_page=${pageSize}`;
    dispatch(fetchApplications({ url: getUrl, token: authCtx.token }));
  }, [isAppCreated, isAppUpdated, isAppDeleted, pageSize, currPage, refreshData]);

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
        dispatch(fetchDeleteApp({ url: deleteUrl, token: authCtx.token }));
      }
    });
  };
  // handle Edit application
  const handleEdit = (data) => {
    setEditData(data);
    dispatch(handleIsAdminEditing(true));
    setFormValue({
      name: data?.name,
      label: data?.label,
      rootservices_url: data?.rootservices_url,
      client_uri: data?.client_uri,
      oslc_domain: data?.oslc_domain,
      organization_id: data?.organization_id,
      description: data?.description,
    });

    setOpenModal(true);
  };

  // send props in the batch action table
  const tableProps = {
    title: 'Applications',
    rowData: allApplications?.items?.length ? allApplications?.items : [],
    headerData,
    handleEdit,
    handleDelete,
    handleAddNew,
    handlePagination,
    handleChangeLimit,
    totalItems: allApplications?.total_items,
    totalPages: allApplications?.total_pages,
    pageSize,
    page: allApplications?.page,
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

          <Steps current={steps} style={{ marginTop: '5px' }}>
            <Steps.Item />
            <Steps.Item />
            <Steps.Item />
          </Steps>
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
                  <FlexboxGrid.Item colspan={11}>
                    <TextField
                      name="name"
                      label="Name"
                      reqText="Application name is required"
                    />
                  </FlexboxGrid.Item>

                  <FlexboxGrid.Item colspan={11}>
                    <TextField
                      name="label"
                      label="label"
                      reqText="Application label is required"
                    />
                  </FlexboxGrid.Item>

                  <FlexboxGrid.Item style={{ margin: '30px 0' }} colspan={11}>
                    <TextField
                      name="rootservices_url"
                      label="Root Services URL"
                      reqText="Root Services URL of OSLC application is required"
                    />
                  </FlexboxGrid.Item>

                  <FlexboxGrid.Item style={{ margin: '30px 0' }} colspan={11}>
                    <TextField
                      name="client_uri"
                      label="Client URI"
                      reqText="Client URI about OSLC application is required"
                    />
                  </FlexboxGrid.Item>

                  <FlexboxGrid.Item colspan={24}>
                    <TextField
                      name="oslc_domain"
                      label="OSLC Domain"
                      reqText="OSLC domain is required"
                    />
                  </FlexboxGrid.Item>

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
                  Cancel
                </Button>
                <Button
                  appearance="primary"
                  color="blue"
                  className="adminModalFooterBtn"
                  onClick={() => {
                    if (appCreateSuccess) setSteps(2);
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
            <div className="show-grid step-2">
              <h4 style={{ marginBottom: '20px' }}>
                Authorize the application consumption
              </h4>
              Please authorize the access for the application in the window below:
              {/* eslint-disable-next-line max-len */}
              <iframe
                className={'authorize-iframe'}
                ref={iframeRef}
                src={authorizeFrameSrc}
              />
              <FlexboxGrid justify="end">
                <Button
                  className="adminModalFooterBtn"
                  appearance="ghost"
                  onClick={() => setSteps(0)}
                >
                  {' '}
                  Back
                </Button>

                <Button
                  appearance="primary"
                  color="blue"
                  className="adminModalFooterBtn"
                  onClick={() => setSteps(2)}
                >
                  {' '}
                  Save
                  {/* {appCreateSuccess ? 'Next' : 'Save'} */}
                </Button>

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
            <div className="show-grid step-3">
              {/* eslint-disable-next-line max-len */}
              <h4 style={{ marginBottom: '10px' }}>
                Application has been registered and authorized successfully
              </h4>
              <h5 style={{ marginBottom: '20px' }}>Close this window to continue.</h5>

              <FlexboxGrid justify="end">
                <Button
                  className="adminModalFooterBtn"
                  appearance="default"
                  onClick={() => setSteps(1)}
                >
                  {' '}
                  Back
                </Button>

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

        {/* <Modal.Footer>
          <Button
            className="adminModalFooterBtn"
            appearance="default"
            onClick={() => setOpenModal(false)}
          >
            Cancel
          </Button>
          <Button
            className="adminModalFooterBtn"
            appearance="primary"
            color="blue"
            onClick={() => handleAddApplication()}
          >
            Save
          </Button>
        </Modal.Footer> */}
      </Modal>

      {isAppLoading && <UseLoader />}

      <AdminDataTable props={tableProps} />
    </div>
  );
};

export default Application;
