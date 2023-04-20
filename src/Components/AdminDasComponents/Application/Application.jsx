import React, { useState, useContext, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Swal from 'sweetalert2';
import {
  fetchApplications,
  // fetchCreateApp,
  fetchDeleteApp,
  fetchOrg,
  // fetchUpdateApp,
} from '../../../Redux/slices/applicationSlice';
import AuthContext from '../../../Store/Auth-Context';
import { handleCurrPageTitle, handleIsAddNewModal } from '../../../Redux/slices/navSlice';
import AddNewModal from '../AddNewModal';
import { FlexboxGrid, Form, Loader, Schema } from 'rsuite';
import AdminDataTable from '../AdminDataTable';
import TextField from '../TextField';
import SelectField from '../SelectField';
import CustomSelect from '../CustomSelect';
// import styles from './Application.module.scss';

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
    header: 'OSLC Domain',
    key: 'oslc_domain',
  },
  {
    header: 'URL',
    key: 'url',
  },
  {
    header: 'Description',
    key: 'description',
  },
];

const { StringType, NumberType } = Schema.Types;

const model = Schema.Model({
  name: StringType().isRequired('This field is required.'),
  url: StringType().isRequired('This field is required.'),
  oslc_domain: StringType().isRequired('This field is required.'),
  organization_id: NumberType().isRequired('This field is required.'),
  description: StringType().isRequired('This field is required.'),
});

const Application = () => {
  const {
    allApplications,
    organizationList,
    isAppLoading,
    isAppUpdated,
    isAppCreated,
    isAppDeleted,
  } = useSelector((state) => state.applications);
  // const [isAddModal, setIsAddModal] = useState(false);
  // const [appDescription, setAppDescription] = useState('');
  // const [selectedItem, setSelectedItem] = useState({});
  // const [filInput, setFilInput] = useState('');
  // const [editData, setEditData] = useState({});
  const [currPage, setCurrPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [formError, setFormError] = useState({});
  const [formValue, setFormValue] = useState({
    name: '',
    url: '',
    oslc_domain: '',
    organization_id: '',
    description: '',
  });
  const appFormRef = useRef();
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

  // handle open add user modal
  const handleAddNew = () => {
    dispatch(handleIsAddNewModal(true));
  };

  const handleAddApplication = () => {
    if (!appFormRef.current.check()) {
      console.error('Form Error', formError);
      return;
    }

    console.log(formValue);
    setFormValue({
      name: '',
      url: '',
      oslc_domain: '',
      organization_id: '',
      description: '',
    });
    dispatch(handleIsAddNewModal(false));
  };

  // const addModalClose = () => {
  //   setEditData({});
  //   setAppDescription('');
  //   setIsAddModal(false);
  //   reset();
  // };

  // create and edit application form submit
  // const handleAddApplication = (data) => {
  //   setIsAddModal(false);
  // update application
  // if (editData?.name) {
  //   data = {
  //     name: data?.name ? data?.name : editData?.name,
  //     url: data.url ? data.url : editData?.url,
  //     description: appDescription ? appDescription : editData?.description,
  //     oslc_domain: data.oslc_domain ? data.oslc_domain : editData?.oslc_domain,
  //     organization_id: selectedItem?.id ? selectedItem?.id : editData?.organization_id,
  //   };
  //   console.log('edit submit: ', data);
  //   const putUrl = `${lmApiUrl}/application/${editData?.id}`;
  //   dispatch(
  //     fetchUpdateApp({
  //       url: putUrl,
  //       token: authCtx.token,
  //       bodyData: data,
  // reset,
  //     }),
  //   );
  // }
  //   // Create application
  //   else {
  //     const appData = {
  //       name: data.name,
  //       url: data.url,
  //       description: appDescription,
  //       oslc_domain: data.oslc_domain,
  //       organization_id: selectedItem?.id,
  //     };
  //     console.log('app submit: ', appData);
  //     const postUrl = `${lmApiUrl}/application`;
  //     dispatch(
  //       fetchCreateApp({
  //         url: postUrl,
  //         token: authCtx.token,
  //         bodyData: appData,
  //         reset,
  //       }),
  //     );
  //   }
  //   setFilInput('');
  //   setSelectedItem({});
  //   // setOrgData({});
  // };

  // Pagination
  const handlePagination = (values) => {
    setPageSize(values.pageSize);
    setCurrPage(values.page);
  };

  useEffect(() => {
    dispatch(handleCurrPageTitle('Applications'));

    const getUrl = `${lmApiUrl}/application?page=${currPage}&per_page=${pageSize}`;
    dispatch(fetchApplications({ url: getUrl, token: authCtx.token }));
  }, [isAppCreated, isAppUpdated, isAppDeleted, pageSize, currPage]);

  // handle delete application
  const handleDelete = (data) => {
    // const idList = data?.map((v) => v.id);
    if (data.length === 1) {
      const id = data[0]?.id;
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
          const deleteUrl = `${lmApiUrl}/application/${id}`;
          dispatch(fetchDeleteApp({ url: deleteUrl, token: authCtx.token }));
        }
      });
    } else if (data.length > 1) {
      Swal.fire({
        title: 'Sorry',
        icon: 'info',
        text: 'You can not delete multiple application at the same time!!',
        confirmButtonColor: '#3085d6',
      });
    }
  };
  // handle Edit application
  const handleEdit = (data) => {
    if (data.length === 1) {
      // setIsAddModal(true);
      // const data1 = data[0];
      // setEditData(data1);
    } else if (data.length > 1) {
      Swal.fire({
        title: 'Sorry!!',
        icon: 'info',
        text: 'You can not edit more than 1 application at the same time',
      });
    }
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
    totalItems: allApplications?.total_items,
    totalPages: allApplications?.total_pages,
    pageSize,
    page: allApplications?.page,
    inpPlaceholder: 'Search Application',
  };

  return (
    <div>
      <AddNewModal handleSubmit={handleAddApplication} title="Add New Application">
        <div className="show-grid">
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
                <TextField name="name" label="Application Name" />
              </FlexboxGrid.Item>

              <FlexboxGrid.Item colspan={11}>
                <TextField name="url" label="Application URL" />
              </FlexboxGrid.Item>

              <FlexboxGrid.Item style={{ margin: '30px 0' }} colspan={24}>
                <TextField name="oslc_domain" label="OSLC Domain" />
              </FlexboxGrid.Item>

              <FlexboxGrid.Item style={{ margin: '30px 0' }} colspan={24}>
                <SelectField
                  name="organization_id"
                  label="Organization ID"
                  accepter={CustomSelect}
                  options={organizationList?.items ? organizationList?.items : []}
                  error={formError.organization_id}
                />
                {/* <TextField name="organization_id" label="Organization ID" /> */}
              </FlexboxGrid.Item>

              <FlexboxGrid.Item colspan={24} style={{ margin: '30px 0' }}>
                <TextField name="description" label="Description" />
              </FlexboxGrid.Item>
            </FlexboxGrid>
          </Form>
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
