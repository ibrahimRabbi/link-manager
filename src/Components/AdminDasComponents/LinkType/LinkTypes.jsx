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
  fetchCreateLinkType,
  fetchDeleteLinkType,
  fetchLinkTypes,
  fetchUpdateLinkType,
} from '../../../Redux/slices/linkTypeSlice';
import AuthContext from '../../../Store/Auth-Context';
import UseTable from '../UseTable';
import styles from './LinkTypes.module.scss';
import { handleCurrPageTitle } from '../../../Redux/slices/navSlice';

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
    header: 'Link Type',
    key: 'name',
  },
  {
    header: 'Incoming Label',
    key: 'incoming_label',
  },
  {
    header: 'Outgoing Label',
    key: 'outgoing_label',
  },
  {
    header: 'Url',
    key: 'url',
  },
  {
    header: 'Description',
    key: 'description',
  },
];

const LinkTypes = () => {
  const {
    allLinkTypes,
    isLinkTypeLoading,
    isLinkTypeCreated,
    isLinkTypeUpdated,
    isLinkTypeDeleted,
  } = useSelector((state) => state.linkTypes);
  const [isAddModal, setIsAddModal] = useState(false);
  const [linkDesc, setLinkDesc] = useState('');
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

  // handle open add modal
  const handleAddNew = () => {
    setIsAddModal(true);
  };
  // add modal close
  const addModalClose = () => {
    setEditData({});
    setIsAddModal(false);
    reset();
  };

  // create and edit link type form submit
  const handleAddLinkType = (data) => {
    // update link type
    setIsAddModal(false);
    if (editData?.name) {
      data = {
        name: data?.name ? data?.name : editData?.name,
        url: data?.url ? data?.url : editData?.url,
        application_id: data?.application_id
          ? data?.application_id
          : editData?.application_id,
        incoming_label: data?.incoming_label
          ? data?.incoming_label
          : editData?.incoming_label,
        outgoing_label: data?.outgoing_label
          ? data?.outgoing_label
          : editData?.outgoing_label,
        description: linkDesc ? linkDesc : editData?.description,
      };
      const putUrl = `${lmApiUrl}/link-type/${editData?.id}`;
      dispatch(
        fetchUpdateLinkType({
          url: putUrl,
          token: authCtx.token,
          bodyData: data,
          reset,
        }),
      );
    }
    // create link type
    else {
      data.description = linkDesc;
      const postUrl = `${lmApiUrl}/link-type`;
      dispatch(
        fetchCreateLinkType({
          url: postUrl,
          token: authCtx.token,
          bodyData: data,
          reset,
        }),
      );
    }
  };

  // get all link types
  useEffect(() => {
    dispatch(handleCurrPageTitle('Link Types'));

    const getUrl = `${lmApiUrl}/link-type?page=${currPage}&per_page=${pageSize}`;
    dispatch(fetchLinkTypes({ url: getUrl, token: authCtx.token }));
  }, [isLinkTypeCreated, isLinkTypeUpdated, isLinkTypeDeleted, pageSize, currPage]);

  // handle delete link type
  const handleDelete = (data) => {
    // const idList = data?.map((v) => v.id);
    if (data.length === 1) {
      const id = data[0]?.id;
      Swal.fire({
        title: 'Are you sure',
        icon: 'info',
        text: 'Do you want to delete the link type!!',
        cancelButtonColor: 'red',
        showCancelButton: true,
        confirmButtonText: 'Delete',
        confirmButtonColor: '#3085d6',
        reverseButtons: true,
      }).then((value) => {
        if (value.isConfirmed) {
          const deleteUrl = `${lmApiUrl}/link-type/${id}`;
          dispatch(fetchDeleteLinkType({ url: deleteUrl, token: authCtx.token }));
        }
      });
    } else if (data.length > 1) {
      Swal.fire({
        title: 'Sorry',
        icon: 'info',
        text: 'You can not delete more then 1 link type at the same time',
        confirmButtonColor: '#3085d6',
      });
    }
  };
  // handle Edit link type
  const handleEdit = (data) => {
    if (data.length === 1) {
      setIsAddModal(true);
      const data1 = data[0];
      setEditData(data1);
    } else if (data.length > 1) {
      Swal.fire({
        title: 'Sorry!!',
        icon: 'info',
        text: 'You can not edit more than 1 link type at the same time',
      });
    }
  };

  // send props in the batch action table
  const tableProps = {
    title: 'Link Types',
    rowData: allLinkTypes?.items?.length ? allLinkTypes?.items : [],
    headerData,
    handleEdit,
    handleDelete,
    handleAddNew,
    handlePagination,
    totalItems: allLinkTypes?.total_items,
    totalPages: allLinkTypes?.total_pages,
    pageSize,
    page: allLinkTypes?.page,
    inpPlaceholder: 'Search Link Type',
  };

  return (
    <div>
      {/* -- add Link type Modal -- */}
      <Theme theme="g10">
        <ComposedModal open={isAddModal} onClose={addModalClose}>
          <div className={mhContainer}>
            <h4>{editData?.name ? 'Edit Link Type' : 'Add New Link Type'}</h4>
            <ModalHeader onClick={addModalClose} />
          </div>

          <ModalBody id={modalBody}>
            <form onSubmit={handleSubmit(handleAddLinkType)} className={formContainer}>
              <Stack gap={7}>
                <div className={flNameContainer}>
                  {/* link type name  */}
                  <div>
                    <TextInput
                      defaultValue={editData?.name}
                      type="text"
                      id="Link_type_name"
                      labelText="Link Type Name"
                      placeholder="Please enter link type name"
                      {...register('name', { required: editData?.name ? false : true })}
                    />
                    <p className={errText}>{errors.name && 'Invalid link type Name'}</p>
                  </div>

                  {/* link type url  */}
                  <div>
                    <TextInput
                      defaultValue={editData?.url}
                      type="text"
                      id="link_type_url"
                      labelText="Link Type URL"
                      placeholder="Please enter link type URL"
                      {...register('url', { required: editData?.url ? false : true })}
                    />
                    <p className={errText}>{errors.url && 'Invalid url'}</p>
                  </div>
                </div>

                <div className={flNameContainer}>
                  {/* link type incoming label  */}
                  <div>
                    <TextInput
                      defaultValue={editData?.incoming_label}
                      type="text"
                      id="Link_type_incoming"
                      labelText="Incoming Label"
                      placeholder="Please enter incoming label"
                      {...register('incoming_label', {
                        required: editData?.incoming_label ? false : true,
                      })}
                    />
                    <p className={errText}>
                      {errors.incoming_label && 'Invalid incoming label'}
                    </p>
                  </div>

                  {/* link type outgoing label  */}
                  <div>
                    <TextInput
                      defaultValue={editData?.outgoing_label}
                      type="text"
                      id="link_type_outgoing"
                      labelText="Outgoing Label"
                      placeholder="Please enter outgoing label"
                      {...register('outgoing_label', {
                        required: editData?.outgoing_label ? false : true,
                      })}
                    />
                    <p className={errText}>
                      {errors.outgoing_label && 'Invalid Outgoing Label'}
                    </p>
                  </div>
                </div>

                {/* link type application_id */}
                <div>
                  <TextInput
                    defaultValue={editData?.application_id}
                    type="text"
                    id="link_type_application_id"
                    labelText="Application Id"
                    placeholder="Please enter application id"
                    {...register('application_id', {
                      required: editData?.application_id ? false : true,
                    })}
                  />
                  <p className={errText}>
                    {errors.application_id && 'Invalid application_id'}
                  </p>
                </div>

                {/* link type description  */}
                <div>
                  <TextArea
                    defaultValue={editData?.description}
                    id="link_type_description"
                    required={editData?.description ? false : true}
                    onChange={(e) => setLinkDesc(e.target.value)}
                    labelText="Link Type Description"
                    placeholder="Please enter link type description"
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
      </Theme>

      {isLinkTypeLoading && <ProgressBar label="" />}
      <UseTable props={tableProps} />
    </div>
  );
};

export default LinkTypes;
