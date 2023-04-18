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
import { FlexboxGrid, Form, Loader } from 'rsuite';
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

const Organization = () => {
  const { allOrganizations, isOrgLoading, isOrgCreated, isOrgDeleted, isOrgUpdated } =
    useSelector((state) => state.organizations);
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

  const [formValue, setFormValue] = useState({
    name: '',
    url: '',
    description: '',
  });
  console.log(console.log(formValue));

  const handleSubmitAdd = () => {
    setFormValue({
      name: '',
      url: '',
      description: '',
    });
    console.log('submitted');
  };
  return (
    <div>
      <AddNewModal handleSubmit={handleSubmitAdd}>
        <Form fluid onChange={setFormValue} formValue={formValue}>
          <Form.Group controlId="orgName">
            <Form.ControlLabel>Organization Name</Form.ControlLabel>
            <Form.Control name="name" />
            <Form.HelpText>Required</Form.HelpText>
          </Form.Group>
          <Form.Group controlId="orgUrl">
            <Form.ControlLabel>Organization URL</Form.ControlLabel>
            <Form.Control name="url" />
            <Form.HelpText>Required</Form.HelpText>
          </Form.Group>
          <Form.Group controlId="orgDesc">
            <Form.ControlLabel>Organization Description</Form.ControlLabel>
            <Form.Control rows={5} name="description" />
          </Form.Group>
        </Form>
      </AddNewModal>

      {/* -- add org Modal -- */}
      {/* <Theme theme="g10">
        <ComposedModal open={isAddModal} onClose={addModalClose}>
          <div className={mhContainer}>
            <h4>{editData?.name ? 'Edit Organization' : 'Add New Organization'}</h4>
            <ModalHeader onClick={addModalClose} />
          </div>

          <ModalBody id={modalBody}>
            <form onSubmit={handleSubmit(handleAddOrg)} className={formContainer}>
              <Stack gap={7}>
                <div>
                  <TextInput
                    defaultValue={editData?.name}
                    type="text"
                    id="org_name"
                    labelText="Organization Name"
                    placeholder="Please enter organization name"
                    {...register('name', { required: editData?.name ? false : true })}
                  />
                  <p className={errText}>{errors.name && 'Invalid Organization Name'}</p>
                </div>

                <div>
                  <TextInput
                    defaultValue={editData?.url}
                    type="text"
                    id="organization_url"
                    labelText="Organization URL"
                    placeholder="Please enter Organization URL"
                    {...register('url', { required: editData?.url ? false : true })}
                  />
                  <p className={errText}>{errors.url && 'Invalid url'}</p>
                </div>

                <div>
                  <TextArea
                    defaultValue={editData?.description}
                    id="org_description"
                    required={editData?.description ? false : true}
                    onChange={(e) => setOrgDescription(e.target.value)}
                    labelText="Organization description"
                    placeholder="Please enter organization description"
                  />
                </div>

                <div className={modalBtnCon}>
                  <Button kind="secondary" size="md" onClick={addModalClose}>
                    Cancel
                  </Button>
                  <Button kind="primary" size="md" type="submit">
                    {editData?.email ? 'Save' : 'Ok'}
                  </Button>
                </div>
              </Stack>
            </form>
          </ModalBody>
        </ComposedModal>
      </Theme> */}

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
