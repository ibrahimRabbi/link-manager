import {
  Button,
  ComposedModal,
  ModalBody,
  ModalHeader,
  ProgressBar,
  Stack,
  TextArea,
  TextInput,
  Theme,
} from '@carbon/react';
import React, { useState, useContext, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import Swal from 'sweetalert2';
import {
  fetchCreateOrg,
  fetchDeleteOrg,
  fetchOrganizations,
} from '../../../Redux/slices/organizationSlice';
import AuthContext from '../../../Store/Auth-Context';
import UseTable from '../UseTable';
import styles from './Organization.module.scss';

const { errText, formContainer, modalBtnCon, modalBody, mhContainer } = styles;

const lmApiUrl = process.env.REACT_APP_LM_REST_API_URL;

// demo data
const headerData = [
  {
    header: 'ID',
    key: 'id',
  },
  {
    header: 'Organization',
    key: 'name',
  },
  {
    header: 'Active',
    key: 'active',
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

const Organization = () => {
  const { allOrganizations, isOrgLoading, isOrgCreated, isOrgDeleted } = useSelector(
    (state) => state.organizations,
  );
  const [isAddModal, setIsAddModal] = useState(false);
  const [orgDescription, setOrgDescription] = useState('');
  const [editData, setEditData] = useState({});
  const [currPage, setCurrPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const {
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm();
  const authCtx = useContext(AuthContext);
  const dispatch = useDispatch();

  // Pagination
  const handlePagination = (values) => {
    setPageSize(values.pageSize);
    setCurrPage(values.page);
  };

  // handle open add user modal
  const handleAddNew = () => {
    setIsAddModal(true);
  };
  // add modal close
  const addModalClose = () => {
    setEditData({});
    setIsAddModal(false);
    reset();
  };

  // create user and edit user form submit
  const handleAddUser = (data) => {
    data.description = orgDescription;
    console.log(data);
    setIsAddModal(false);
    if (editData?.name) {
      data.description = orgDescription ? orgDescription : editData.description;
      data.id = editData?.id;
      data.active = editData?.active;
      console.log(editData);
      console.log(data);
    } else {
      const postUrl = `${lmApiUrl}/organization`;
      dispatch(
        fetchCreateOrg({
          url: postUrl,
          token: authCtx.token,
          bodyData: data,
          reset,
        }),
      );
    }
  };

  // console.log(allUsers);
  useEffect(() => {
    const getUrl = `${lmApiUrl}/organization?page=${currPage}&per_page=${pageSize}`;
    dispatch(fetchOrganizations({ url: getUrl, token: authCtx.token }));
  }, [isOrgCreated, isOrgDeleted, pageSize, currPage]);

  // handle delete user
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
  // handle Edit user
  const handleEdit = (data) => {
    if (data.length === 1) {
      setIsAddModal(true);
      const data1 = data[0];
      setEditData(data1);
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
    totalItems: allOrganizations?.total_items,
    totalPages: allOrganizations?.total_pages,
    pageSize,
    page: allOrganizations?.page,
  };

  return (
    <div>
      {/* -- add User Modal -- */}
      <Theme theme="g10">
        <ComposedModal open={isAddModal} onClose={addModalClose}>
          <div className={mhContainer}>
            <h4>{editData?.email ? 'Edit Organization' : 'Add New Organization'}</h4>
            <ModalHeader onClick={addModalClose} />
          </div>

          <ModalBody id={modalBody}>
            <form onSubmit={handleSubmit(handleAddUser)} className={formContainer}>
              <Stack gap={7}>
                {/* first name  */}
                <div>
                  <TextInput
                    defaultValue={editData?.name}
                    type="text"
                    id="org_name"
                    labelText="Organization Name"
                    placeholder="Please enter organization name"
                    {...register('name', { required: true })}
                  />
                  <p className={errText}>{errors.name && 'Invalid Organization Name'}</p>
                </div>

                {/* username  */}
                <div>
                  <TextInput
                    defaultValue={editData?.url}
                    type="text"
                    id="organization_url"
                    labelText="Organization URL"
                    placeholder="Please enter Organization URL"
                    {...register('url', { required: true })}
                  />
                  <p className={errText}>{errors.url && 'Invalid url'}</p>
                </div>

                {/* last name  */}
                <div>
                  <TextArea
                    defaultValue={editData?.description}
                    id="org_description"
                    required={true}
                    onChange={(e) => setOrgDescription(e.target.value)}
                    labelText="Organization description"
                    placeholder="Please enter organization description"
                    // {...register('description', {required:true})}
                  />
                  {/* <p className={errText}>
                    {errors.description && 'Invalid description'}
                  </p> */}
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
      </Theme>

      {isOrgLoading && <ProgressBar label="" />}
      <UseTable props={tableProps} />
    </div>
  );
};

export default Organization;
