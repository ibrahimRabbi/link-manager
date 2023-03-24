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
  fetchUpdateApp,
} from '../../../Redux/slices/applicationSlice';
import AuthContext from '../../../Store/Auth-Context';
import UseTable from '../UseTable';
import styles from './LinkConstraint.module.scss';

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

const LinkConstraint = () => {
  const {
    allLinkConstraints,
    isLinkConsLoading,
    isLinkConsUpdated,
    isLinkConsCreated,
    isLinkConsDeleted,
  } = useSelector((state) => state.linkConstraints);
  const [isAddModal, setIsAddModal] = useState(false);
  const [linkConsDesc, setLinkConsDesc] = useState('');
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
    setLinkConsDesc('');
    setIsAddModal(false);
    reset();
  };

  // create and edit link cons form submit
  const handleAddLinkCons = (data) => {
    setIsAddModal(false);
    // update link cons
    if (editData?.name) {
      console.log(data);
      data = {
        name: data?.name ? data?.name : editData?.name,
        url: data.url ? data.url : editData?.url,
        description: linkConsDesc ? linkConsDesc : editData?.description,
        oslc_domain: data.oslc_domain ? data.oslc_domain : editData?.oslc_domain,
        organization_id: data?.organization_id
          ? data?.organization_id
          : editData?.organization_id,
      };
      const putUrl = `${lmApiUrl}/link-constraint/${editData?.id}`;
      dispatch(
        fetchUpdateApp({
          url: putUrl,
          token: authCtx.token,
          bodyData: data,
          reset,
        }),
      );
    }
    // Create LinkConstraint
    else {
      data.description = linkConsDesc;
      console.log(data);
      const postUrl = `${lmApiUrl}/link-constraint`;
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

  useEffect(() => {
    const getUrl = `${lmApiUrl}/link-constraint?page=${currPage}&per_page=${pageSize}`;
    dispatch(fetchApplications({ url: getUrl, token: authCtx.token }));
  }, [isLinkConsCreated, isLinkConsUpdated, isLinkConsDeleted, pageSize, currPage]);

  // handle delete LinkConstraint
  const handleDelete = (data) => {
    // const idList = data?.map((v) => v.id);
    if (data.length === 1) {
      const id = data[0]?.id;
      Swal.fire({
        title: 'Are you sure',
        icon: 'info',
        text: 'Do you want to delete the this link constraint!!',
        cancelButtonColor: 'red',
        showCancelButton: true,
        confirmButtonText: 'Delete',
        confirmButtonColor: '#3085d6',
        reverseButtons: true,
      }).then((value) => {
        if (value.isConfirmed) {
          const deleteUrl = `${lmApiUrl}/link-constraint/${id}`;
          dispatch(fetchDeleteApp({ url: deleteUrl, token: authCtx.token }));
        }
      });
    } else if (data.length > 1) {
      Swal.fire({
        title: 'Sorry',
        icon: 'info',
        text: 'You can not delete multiple link constraint at the same time!!',
        confirmButtonColor: '#3085d6',
      });
    }
  };
  // handle Edit LinkConstraint
  const handleEdit = (data) => {
    if (data.length === 1) {
      setIsAddModal(true);
      const data1 = data[0];
      setEditData(data1);
    } else if (data.length > 1) {
      Swal.fire({
        title: 'Sorry!!',
        icon: 'info',
        text: 'You can not edit more than 1 link constraint at the same time',
      });
    }
  };

  // send props in the batch action table
  const tableProps = {
    title: 'Link Constraint',
    rowData: allLinkConstraints?.items?.length ? allLinkConstraints?.items : [],
    headerData,
    handleEdit,
    handleDelete,
    handleAddNew,
    handlePagination,
    totalItems: allLinkConstraints?.total_items,
    totalPages: allLinkConstraints?.total_pages,
    pageSize,
    page: allLinkConstraints?.page,
  };

  return (
    <div>
      {/* -- add LinkConstraint Modal -- */}
      <Theme theme="g10">
        <ComposedModal open={isAddModal} onClose={addModalClose}>
          <div className={mhContainer}>
            <h4>
              {editData?.email ? 'Edit link constraint' : 'Add New link constraint'}
            </h4>
            <ModalHeader onClick={addModalClose} />
          </div>

          <ModalBody id={modalBody}>
            <form onSubmit={handleSubmit(handleAddLinkCons)} className={formContainer}>
              <Stack gap={7}>
                {/* LinkConstraint name  */}
                <div>
                  <TextInput
                    defaultValue={editData?.name}
                    type="text"
                    id="link-constraint_name"
                    labelText="Link Constraint Name"
                    placeholder="Please enter link constraint name"
                    {...register('name', { required: editData?.name ? false : true })}
                  />
                  <p className={errText}>{errors.name && 'Invalid Name'}</p>
                </div>

                <div className={flNameContainer}>
                  {/* application_id  */}
                  <div>
                    <TextInput
                      defaultValue={editData?.application_id}
                      type="number"
                      id="link-constraint_application_id"
                      labelText="Application Id"
                      placeholder="Please enter link application id"
                      {...register('application_id', {
                        required: editData?.application_id ? false : true,
                      })}
                    />
                    <p className={errText}>
                      {errors.application_id && 'Invalid application id'}
                    </p>
                  </div>

                  {/*  link_type_id  */}
                  <div>
                    <TextInput
                      defaultValue={editData?.link_type_id}
                      type="number"
                      id="link_cons_link_type_id"
                      labelText="Link Type Id"
                      placeholder="Please enter link type id"
                      {...register('link_type_id', {
                        required: editData?.link_type_id ? false : true,
                      })}
                    />
                    <p className={errText}>{errors.url && 'Invalid link type id'}</p>
                  </div>
                </div>

                <div className={flNameContainer}>
                  {/* source_url  */}
                  <div>
                    <TextInput
                      defaultValue={editData?.source_url}
                      type="text"
                      id="link-constraint_source_url"
                      labelText="Source Url"
                      placeholder="Please enter link source url"
                      {...register('source_url', {
                        required: editData?.source_url ? false : true,
                      })}
                    />
                    <p className={errText}>{errors.source_url && 'Invalid source url'}</p>
                  </div>

                  {/*  target_url  */}
                  <div>
                    <TextInput
                      defaultValue={editData?.target_url}
                      type="text"
                      id="link_cons_target_url"
                      labelText="Target Url"
                      placeholder="Please enter target url"
                      {...register('target_url', {
                        required: editData?.target_url ? false : true,
                      })}
                    />
                    <p className={errText}>
                      {errors.target_url && 'Invalid link type id'}
                    </p>
                  </div>
                </div>

                {/* Description  */}
                <div>
                  <TextArea
                    defaultValue={editData?.description}
                    id="linkCons_description"
                    required={editData?.description ? false : true}
                    onChange={(e) => setLinkConsDesc(e.target.value)}
                    labelText="Application description"
                    placeholder="Please enter Description"
                  />
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

      {isLinkConsLoading && <ProgressBar label="" />}
      <UseTable props={tableProps} />
    </div>
  );
};

export default LinkConstraint;
