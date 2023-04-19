// import {
//   Button,
//   ComposedModal,
//   ModalBody,
//   ModalHeader,
//   ProgressBar,
//   Stack,
//   TextArea,
//   TextInput,
//   Theme,
// } from '@carbon/react';
import React, { useState, useContext, useEffect } from 'react';
// import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import Swal from 'sweetalert2';
import {
  // fetchUpdateOrg,
  fetchDeleteOrg,
  fetchOrganizations,
  // fetchCreateOrg,
} from '../../../Redux/slices/organizationSlice';
import AuthContext from '../../../Store/Auth-Context';
// import styles from './Organization.module.scss';
import { handleCurrPageTitle, handleIsAddNewModal } from '../../../Redux/slices/navSlice';
import AdminDataTable from '../AdminDataTable';
import AddNewModal from '../AddNewModal';
import { FlexboxGrid, Form, Loader, Schema } from 'rsuite';
import TextField from '../TextField';
// import UseTable from '../UseTable';

// const { errText, formContainer, modalBtnCon, modalBody, mhContainer } = styles;

const lmApiUrl = process.env.REACT_APP_LM_REST_API_URL;

// demo data
const headerData = [
  {
    header: 'ID',
    key: 'id',
    width: 100,
  },
  {
    header: 'Organization',
    key: 'name',
    width: 200,
  },
  {
    header: 'URL',
    key: 'url',
    width: 200,
  },
  {
    header: 'Description',
    key: 'description',
    width: 300,
  },
];

const { StringType } = Schema.Types;

const model = Schema.Model({
  name: StringType().isRequired('This field is required.'),
  url: StringType().isRequired('This field is required.'),
  description: StringType().isRequired('This field is required.'),
});

const Organization = () => {
  const { allOrganizations, isOrgLoading, isOrgCreated, isOrgDeleted, isOrgUpdated } =
    useSelector((state) => state.organizations);
  const [formError, setFormError] = React.useState({});
  const [formValue, setFormValue] = React.useState({
    name: '',
    url: '',
    description: '',
  });

  const orgFormRef = React.useRef();

  const handleAddOrg = () => {
    if (!orgFormRef.current.check()) {
      console.error('Form Error', formError);
      return;
    }
    console.log(formValue);
    dispatch(handleIsAddNewModal(false));
  };
  // const [isAddModal, setIsAddModal] = useState(false);
  // const [orgDescription, setOrgDescription] = useState('');
  // const [editData, setEditData] = useState({});
  const [currPage, setCurrPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  // const {
  //   handleSubmit,
  //   register,
  //   reset,
  //   formState: { errors },
  // } = useForm();
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

  // handle open add org modal
  const handleAddNew = () => {
    // setIsAddModal(true);
    dispatch(handleIsAddNewModal(true));
  };
  // add modal close
  // const addModalClose = () => {
  //   setEditData({});
  //   setIsAddModal(false);
  //   reset();
  // };

  // create and edit org form submit
  // const handleAddOrg = (data) => {
  //   setIsAddModal(false);
  //   // Edit Organization
  //   if (editData?.name) {
  //     data = {
  //       name: data?.name ? data?.name : editData?.name,
  //       url: data?.url ? data?.url : editData?.url,
  //       description: orgDescription ? orgDescription : editData?.description,
  //     };
  //     const putUrl = `${lmApiUrl}/organization/${editData?.id}`;
  //     dispatch(
  //       fetchUpdateOrg({
  //         url: putUrl,
  //         token: authCtx.token,
  //         bodyData: data,
  //         reset,
  //       }),
  //     );
  //   }
  //   // Create organization
  //   else {
  //     data.description = orgDescription;
  //     const postUrl = `${lmApiUrl}/organization`;
  //     dispatch(
  //       fetchCreateOrg({
  //         url: postUrl,
  //         token: authCtx.token,
  //         bodyData: data,
  //         reset,
  //       }),
  //     );
  //   }
  // };

  useEffect(() => {
    dispatch(handleCurrPageTitle('Organizations'));

    const getUrl = `${lmApiUrl}/organization?page=${currPage}&per_page=${pageSize}`;
    dispatch(fetchOrganizations({ url: getUrl, token: authCtx.token }));
  }, [isOrgCreated, isOrgUpdated, isOrgDeleted, pageSize, currPage]);

  // handle delete Org
  const handleDelete = (data) => {
    console.log('delete data', data);
    // const idList = data?.map((v) => v.id);
    if (data.length === 1) {
      const id = data[0]?.id;
      Swal.fire({
        title: 'Are you sure',
        icon: 'info',
        text: 'Do you want to delete the organization!!',
        cancelButtonColor: 'red',
        showCancelButton: true,
        confirmButtonText: 'Delete',
        confirmButtonColor: '#3085d6',
        reverseButtons: true,
      }).then((value) => {
        if (value.isConfirmed) {
          const deleteUrl = `${lmApiUrl}/organization/${id}`;
          dispatch(fetchDeleteOrg({ url: deleteUrl, token: authCtx.token }));
        }
      });
    } else if (data.length > 1) {
      Swal.fire({
        title: 'Sorry',
        icon: 'info',
        text: 'You can not delete more then 1 organization at the same time',
        confirmButtonColor: '#3085d6',
      });
    }
  };
  // handle Edit org
  const handleEdit = (data) => {
    console.log('edit data', data);
    if (data.length === 1) {
      // setIsAddModal(true);
      // const data1 = data[0];
      // setEditData(data1);
    } else if (data.length > 1) {
      Swal.fire({
        title: 'Sorry!!',
        icon: 'info',
        text: 'You can not edit more than 1 organization at the same time',
      });
    }
  };

  // send props in the batch action table
  const tableProps = {
    title: 'Organizations',
    rowData: allOrganizations?.items?.length ? allOrganizations?.items : [],
    headerData,
    handleEdit,
    handleDelete,
    handleAddNew,
    handlePagination,
    handleChangeLimit,
    totalItems: allOrganizations?.total_items,
    totalPages: allOrganizations?.total_pages,
    pageSize,
    page: allOrganizations?.page,
    inpPlaceholder: 'Search Organization',
  };

  return (
    <div>
      <AddNewModal title={'Add New Organization'} handleSubmit={handleAddOrg}>
        <div className="show-grid">
          <Form
            fluid
            ref={orgFormRef}
            onChange={setFormValue}
            onCheck={setFormError}
            formValue={formValue}
            // formDefaultValue={}
            model={model}
          >
            <FlexboxGrid justify="space-between">
              <FlexboxGrid.Item colspan={11}>
                <TextField name="name" label="Organization Name" />
              </FlexboxGrid.Item>

              <FlexboxGrid.Item colspan={11}>
                <TextField name="url" label="Organization URL" />
              </FlexboxGrid.Item>
              <FlexboxGrid.Item colspan={24} style={{ margin: '30px 0' }}>
                <TextField name="description" label="Organization Description" />
              </FlexboxGrid.Item>
            </FlexboxGrid>
          </Form>
        </div>
      </AddNewModal>

      {isOrgLoading && (
        <FlexboxGrid justify="center">
          <Loader size="md" label="" />
        </FlexboxGrid>
      )}
      {/* <UseTable props={tableProps} /> */}
      <AdminDataTable props={tableProps} />
    </div>
  );
};

export default Organization;
