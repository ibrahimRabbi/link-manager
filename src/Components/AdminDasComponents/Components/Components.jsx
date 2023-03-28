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
  fetchComponents,
  fetchCreateComp,
  fetchDeleteComp,
  fetchUpdateComp,
} from '../../../Redux/slices/componentSlice';
import AuthContext from '../../../Store/Auth-Context';
import UseTable from '../UseTable';
import styles from './Components.module.scss';

const { errText, formContainer, modalBtnCon, modalBody, mhContainer } = styles;

const lmApiUrl = process.env.REACT_APP_LM_REST_API_URL;

// demo data
const headerData = [
  {
    header: 'ID',
    key: 'id',
  },
  {
    header: 'Name',
    key: 'name',
  },
  {
    header: 'Component',
    key: 'component',
  },
  {
    header: 'Type',
    key: 'type_',
  },
  {
    header: 'Domain',
    key: 'domain',
  },
  {
    header: 'Description',
    key: 'description',
  },
];

const Application = () => {
  const { allComponents, isCompLoading, isCompUpdated, isCompCreated, isCompDeleted } =
    useSelector((state) => state.components);
  const [isAddModal, setIsAddModal] = useState(false);
  const [componentDesc, setComponentDesc] = useState('');
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

  // handle open add component modal
  const handleAddNew = () => {
    setIsAddModal(true);
  };
  const addModalClose = () => {
    setEditData({});
    setComponentDesc('');
    setIsAddModal(false);
    reset();
  };

  // create and edit component form submit
  const handleAddUser = (data) => {
    setIsAddModal(false);
    // update component
    if (editData?.name) {
      data = {
        name: data?.name ? data?.name : editData?.name,
        project_id: data.project_id ? data.project_id : editData?.project_id,
        description: componentDesc ? componentDesc : editData?.description,
      };
      const putUrl = `${lmApiUrl}/component/${editData?.id}`;
      dispatch(
        fetchUpdateComp({
          url: putUrl,
          token: authCtx.token,
          bodyData: data,
          reset,
        }),
      );
    }
    // Create component
    else {
      data.description = componentDesc;
      const postUrl = `${lmApiUrl}/component`;
      dispatch(
        fetchCreateComp({
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
    const getUrl = `${lmApiUrl}/component?page=${currPage}&per_page=${pageSize}`;
    dispatch(fetchComponents({ url: getUrl, token: authCtx.token }));
  }, [isCompCreated, isCompUpdated, isCompDeleted, pageSize, currPage]);

  // handle delete component
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
          const deleteUrl = `${lmApiUrl}/component/${id}`;
          dispatch(fetchDeleteComp({ url: deleteUrl, token: authCtx.token }));
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
  // handle Edit component
  const handleEdit = (data) => {
    if (data.length === 1) {
      setIsAddModal(true);
      const data1 = data[0];
      setEditData(data1);
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
    rowData: allComponents?.items?.length ? allComponents?.items : [],
    headerData,
    handleEdit,
    handleDelete,
    handleAddNew,
    handlePagination,
    totalItems: allComponents?.total_items,
    totalPages: allComponents?.total_pages,
    pageSize,
    page: allComponents?.page,
    inpPlaceholder: 'Search Component',
  };

  return (
    <div>
      {/* -- add application Modal -- */}
      <Theme theme="g10">
        <ComposedModal open={isAddModal} onClose={addModalClose}>
          <div className={mhContainer}>
            <h4>{editData?.name ? 'Edit Link Constraint' : 'Add New Link Constraint'}</h4>
            <ModalHeader onClick={addModalClose} />
          </div>

          <ModalBody id={modalBody}>
            <form onSubmit={handleSubmit(handleAddUser)} className={formContainer}>
              <Stack gap={7}>
                {/* Component name  */}
                <div>
                  <TextInput
                    defaultValue={editData?.name}
                    type="text"
                    id="component_name"
                    labelText="Component Name"
                    placeholder="Please enter component name"
                    {...register('name', {
                      required: editData?.name ? false : true,
                    })}
                  />
                  <p className={errText}>{errors.name && 'Invalid name'}</p>
                </div>

                {/* project id */}
                <div>
                  <TextInput
                    defaultValue={editData?.project_id}
                    type="text"
                    id="component_project_id"
                    labelText="Project Id"
                    placeholder="Please enter project id"
                    {...register('project_id', {
                      required: editData?.project_id ? false : true,
                    })}
                  />
                  <p className={errText}>{errors.project_id && 'Invalid Project Id'}</p>
                </div>

                {/* Description  */}
                <div>
                  <TextArea
                    defaultValue={editData?.description}
                    id="component_description"
                    required={editData?.description ? false : true}
                    onChange={(e) => setComponentDesc(e.target.value)}
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

      {isCompLoading && <ProgressBar label="" />}
      <UseTable props={tableProps} />
    </div>
  );
};

export default Application;
