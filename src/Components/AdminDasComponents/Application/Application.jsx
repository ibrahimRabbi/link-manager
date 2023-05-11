import React, { useState, useContext, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Swal from 'sweetalert2';
import {
  fetchApplications,
  fetchCreateApp,
  fetchDeleteApp,
  fetchOrg,
  fetchUpdateApp,
  // fetchUpdateApp,
} from '../../../Redux/slices/applicationSlice';
import AuthContext from '../../../Store/Auth-Context';
import {
  handleCurrPageTitle,
  handleIsAddNewModal,
  handleIsAdminEditing,
} from '../../../Redux/slices/navSlice';
import AddNewModal from '../AddNewModal';
import { FlexboxGrid, Form, Loader, Schema, Steps } from 'rsuite';
import AdminDataTable from '../AdminDataTable';
import TextField from '../TextField';
import SelectField from '../SelectField';
import CustomSelect from '../CustomSelect';
import TextArea from '../TextArea';
// eslint-disable-next-line max-len
// import styles from './Application.module.scss';
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

const { StringType, NumberType, ArrayType } = Schema.Types;

const model = Schema.Model({
  name: StringType().isRequired('This field is required.'),
  label: StringType().isRequired('This field is required.'),
  rootservices_url: StringType().isRequired('This field is required.'),
  oslc_domain: StringType().isRequired('This field is required.'),
  organization_id: NumberType().isRequired('This field is required.'),
  description: StringType().isRequired('This field is required.'),
  client_uri: StringType().isRequired('This field is required.'),
  grant_types: ArrayType(),
  redirect_uris: ArrayType(),
  response_types: ArrayType(),
  scopes: StringType(),
});

const Application = () => {
  const { allApplications, isAppLoading, isAppUpdated, isAppCreated, isAppDeleted } =
    useSelector((state) => state.applications);
  const { refreshData, isAdminEditing } = useSelector((state) => state.nav);

  const [currPage, setCurrPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [formError, setFormError] = useState({});
  const [editData, setEditData] = useState({});
  const [steps, setSteps] = useState(0);

  // const [clientId, setClientId] = useState('');
  // const [clientSecret, setClientSecret] = useState('');
  const [authorizeFrameSrc, setAuthorizeFrameSrc] = useState('');

  const [formValue, setFormValue] = useState({
    name: '',
    label: '',
    rootservices_url: '',
    oslc_domain: '',
    organization_id: '',
    description: '',
    client_uri: '',
    grant_types: [],
    redirect_uris: '',
    response_types: [],
    scopes: '',
  });
  const appFormRef = useRef();
  const iframeRef = useRef(null);
  const authCtx = useContext(AuthContext);
  const dispatch = useDispatch();

  // get organizations for create application
  useEffect(() => {
    dispatch(
      fetchOrg({
        url: `${lmApiUrl}/organization?page=${'1'}&per_page=${'100'}`,
        token: authCtx.token,
      }),
    );
  }, []);

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
      const putUrl = `${lmApiUrl}/application/${editData?.id}`;
      dispatch(
        fetchUpdateApp({
          url: putUrl,
          token: authCtx.token,
          bodyData: formValue,
        }),
      );
    } else {
      formValue.scopes = 'oslc_fetch_access';
      formValue.response_types = ['code'];
      formValue.grant_types = ['service_provider', 'authorization_code'];
      formValue.redirect_uris = [
        // eslint-disable-next-line max-len
        'http://127.0.0.1:5100/api/v1/application/' +
          'oauth2-consumer/callback?consumer=' +
          formValue.label,
      ];

      // console.log('form value', formValue);

      const postUrl = `${lmApiUrl}/application`;
      dispatch(
        fetchCreateApp({
          url: postUrl,
          token: authCtx.token,
          bodyData: formValue,
          sendMsg: false,
        }),
      )
        .then((response) => {
          if (response) {
            // setClientId(response.payload.client_id);
            // setClientSecret(response.payload.client_secret);
            setSteps(1);
            let query = `client_id=${response.payload.client_id}`;
            query += `&scope=${formValue.scope}`;

            formValue.response_types.forEach((response_type) => {
              if (formValue.response_types.indexOf(response_type) === 0) {
                query += `&response_type=${response_type}`;
              } else {
                query += ` ${response_type}`;
              }
            }, query);

            query += `&redirect_uri=${formValue.redirect_uris[0]}`;
            let authorizeUri = response.payload.oauth_client_authorize_uri + '?' + query;
            setAuthorizeFrameSrc(authorizeUri);
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

    dispatch(handleIsAddNewModal(true));
    if (isAdminEditing) dispatch(handleIsAdminEditing(false));
  };

  window.addEventListener(
    'message',
    function (event) {
      let message = event.data;
      if (!message.source) {
        if (message.toString()?.startsWith('access-token-data')) {
          const response = JSON.parse(message?.substr('access-token-data:'?.length));

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
      url: '',
      oslc_domain: '',
      organization_id: '',
      description: '',
    });
  };

  // handle open add user modal
  const handleAddNew = () => {
    handleResetForm();
    dispatch(handleIsAddNewModal(true));
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
      url: data?.url,
      oslc_domain: data?.oslc_domain,
      organization_id: data?.organization_id,
      description: data?.description,
    });

    dispatch(handleIsAddNewModal(true));
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
      <AddNewModal
        title={isAdminEditing ? 'Edit Application' : 'Add New Application'}
        handleSubmit={handleAddApplication}
        handleReset={handleResetForm}
      >
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

              <FlexboxGrid.Item style={{ margin: '30px 0' }} colspan={24}>
                <TextField
                  name="rootservices_url"
                  label="Rootservices URL"
                  reqText="Rootservices URL of OSLC application is required"
                />
              </FlexboxGrid.Item>

              <FlexboxGrid.Item style={{ margin: '30px 0' }} colspan={24}>
                <TextField
                  name="client_uri"
                  label="Client URI"
                  reqText="Client URI about OSLC application is required"
                />
              </FlexboxGrid.Item>

              <FlexboxGrid.Item style={{ margin: '30px 0' }} colspan={24}>
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

              <FlexboxGrid.Item colspan={24} style={{ margin: '30px 0 10px' }}>
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
        </div>

        <div className="show-grid step-2">
          <h4 style={{ margin: '30px 0 10px' }}>Authorize the application consumption</h4>
          Please authorize the access for the application in the window below:
          {/* eslint-disable-next-line max-len */}
          <iframe className={'authorize-iframe'} src={authorizeFrameSrc} />
        </div>

        <div className="show-grid step-3">
          {/* eslint-disable-next-line max-len */}
          <h4 style={{ margin: '30px 0 10px' }}>
            Application has been registered and authorized successfully
          </h4>
          Close this window to continue.
        </div>

        <div className={'application-steps'} style={{ margin: '30px 0 10px' }}>
          <Steps current={steps}>
            <Steps.Item />
            <Steps.Item />
            <Steps.Item />
          </Steps>
        </div>
      </AddNewModal>

      {isAppLoading && (
        <FlexboxGrid justify="center">
          <Loader size="md" label="" />
        </FlexboxGrid>
      )}

      {/* <UseTable props={tableProps} /> */}
      <AdminDataTable props={tableProps} />
    </div>
  );
};

export default Application;
