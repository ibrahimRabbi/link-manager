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
  fetchApplications,
  fetchCreateApp,
  fetchDeleteApp,
} from '../../../Redux/slices/applicationSlice';
import AuthContext from '../../../Store/Auth-Context';
import UseTable from '../UseTable';
import styles from './Application.module.scss';

const { errText, formContainer, modalBtnCon, modalBody, mhContainer, flNameContainer } =
  styles;

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
    header: 'Active',
    key: 'active',
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

const Application = () => {
  const { allApplications, isAppLoading, isAppCreated, isAppDeleted } = useSelector(
    (state) => state.applications,
  );
  const [isAddModal, setIsAddModal] = useState(false);
  const [appDescription, setAppDescription] = useState('');
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

  // handle open add user modal
  const handleAddNew = () => {
    setIsAddModal(true);
  };
  const addModalClose = () => {
    setEditData({});
    setIsAddModal(false);
    reset();
  };

  // create user and edit user form submit
  const handleAddUser = (data) => {
    data.description = appDescription;
    console.log(data);
    setIsAddModal(false);
    if (editData?.name) {
      data.name = data.name ? data.name : editData?.name;
      data.oslc_domain = data.oslc_domain ? data.oslc_domain : editData?.oslc_domain;
      data.url = data.url ? data.url : editData?.url;
      data.description = appDescription ? appDescription : editData?.description;
      console.log(data);
    } else {
      const postUrl = `${lmApiUrl}/application`;
      dispatch(
        fetchCreateApp({
          url: postUrl,
          token: authCtx.token,
          bodyData: data,
          reset,
        }),
      );
    }
  };

  // Pagination
  const handlePagination = (values) => {
    setPageSize(values.pageSize);
    setCurrPage(values.page);
  };

  // console.log(allUsers);
  useEffect(() => {
    const getUrl = `${lmApiUrl}/application?page=${currPage}&per_page=${pageSize}`;
    dispatch(fetchApplications({ url: getUrl, token: authCtx.token }));
  }, [isAppCreated, isAppDeleted, pageSize, currPage]);

  // handle delete user
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
        text: 'You can not delete multiple Application at the same time!!',
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
        text: 'You can not edit more than 1 user at the same time',
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
  };

  return (
    <div>
      {/* -- add User Modal -- */}
      <Theme theme="g10">
        <ComposedModal open={isAddModal} onClose={addModalClose}>
          <div className={mhContainer}>
            <h4>{editData?.email ? 'Edit Application' : 'Add New Application'}</h4>
            <ModalHeader onClick={addModalClose} />
          </div>

          <ModalBody id={modalBody}>
            <form onSubmit={handleSubmit(handleAddUser)} className={formContainer}>
              <Stack gap={7}>
                {/* first name  */}
                <div className={flNameContainer}>
                  <div>
                    <TextInput
                      defaultValue={editData?.name}
                      type="text"
                      id="application_name"
                      labelText="Application Name"
                      placeholder="Please enter application name"
                      {...register('name', { required: editData?.name ? false : true })}
                    />
                    <p className={errText}>{errors.name && 'Invalid First Name'}</p>
                  </div>

                  {/* last name  */}
                  <div>
                    <TextInput
                      defaultValue={editData?.url}
                      type="text"
                      id="application_url"
                      labelText="Application Url"
                      placeholder="Please enter Application Url"
                      {...register('url', { required: editData?.url ? false : true })}
                    />
                    <p className={errText}>{errors.url && 'Invalid Last Name'}</p>
                  </div>
                </div>

                {/* Oslc domain  */}
                <div>
                  <TextInput
                    defaultValue={editData?.oslc_domain}
                    type="text"
                    id="organization_id"
                    labelText="OSLC Domain"
                    placeholder="Please enter OSLC domain"
                    {...register('oslc_domain', {
                      required: editData?.oslc_domain ? false : true,
                    })}
                  />
                  <p className={errText}>{errors.oslc_domain && 'Invalid Domain'}</p>
                </div>

                <div>
                  <TextInput
                    defaultValue={editData?.organization_id}
                    type="text"
                    id="organization_id"
                    labelText="Organization Id"
                    placeholder="Please enter Organization Id"
                    {...register('organization_id', {
                      required: editData?.organization_id ? false : true,
                    })}
                  />
                  <p className={errText}>{errors.organization_id && 'Invalid Org Id'}</p>
                </div>

                {/* Description  */}
                <div>
                  <TextArea
                    defaultValue={editData?.description}
                    id="application_description"
                    required={editData?.description ? false : true}
                    onChange={(e) => setAppDescription(e.target.value)}
                    labelText="Application description"
                    placeholder="Please enter Description"
                    // {...register('description')}
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
                    {editData?.name ? 'Save' : 'Ok'}
                  </Button>
                </div>
              </Stack>
            </form>
          </ModalBody>
        </ComposedModal>
      </Theme>

      {isAppLoading && <ProgressBar label="" />}
      <UseTable props={tableProps} />
    </div>
  );
};

export default Application;
