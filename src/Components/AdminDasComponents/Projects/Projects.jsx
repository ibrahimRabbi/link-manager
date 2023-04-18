import {
  Button,
  ComposedModal,
  ModalBody,
  ModalHeader,
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
  fetchCreateProj,
  fetchDeleteProj,
  fetchProjects,
  fetchUpdateProj,
} from '../../../Redux/slices/projectSlice';
import AuthContext from '../../../Store/Auth-Context';
import UseTable from '../UseTable';
import styles from './Projects.module.scss';
import { handleCurrPageTitle } from '../../../Redux/slices/navSlice';
import { FlexboxGrid, Loader } from 'rsuite';

const { errText, formContainer, modalBtnCon, modalBody, mhContainer } = styles;

const lmApiUrl = process.env.REACT_APP_LM_REST_API_URL;

// demo data
const headerData = [
  {
    header: 'ID',
    key: 'id',
  },
  {
    header: 'Project',
    key: 'name',
  },
  {
    header: 'Active',
    key: 'active',
  },
  {
    header: 'Description',
    key: 'description',
  },
];

const Projects = () => {
  const { allProjects, isProjLoading, isProjCreated, isProjUpdated, isProjDeleted } =
    useSelector((state) => state.projects);
  const [isAddModal, setIsAddModal] = useState(false);
  const [projectDescription, setProjectDescription] = useState('');
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

  // create and edit project form submit
  const handleAddUser = (data) => {
    setIsAddModal(false);
    // update project
    if (editData?.name) {
      data = {
        name: data?.name ? data?.name : editData?.name,
        description: projectDescription ? projectDescription : editData?.description,
      };
      const putUrl = `${lmApiUrl}/project/${editData?.id}`;
      dispatch(
        fetchUpdateProj({
          url: putUrl,
          token: authCtx.token,
          bodyData: data,
          reset,
        }),
      );
    }
    // create project
    else {
      data.description = projectDescription;
      const postUrl = `${lmApiUrl}/project`;
      dispatch(
        fetchCreateProj({
          url: postUrl,
          token: authCtx.token,
          bodyData: data,
          reset,
        }),
      );
    }
  };

  // get all projects
  useEffect(() => {
    dispatch(handleCurrPageTitle('Projects'));

    const getUrl = `${lmApiUrl}/project?page=${currPage}&per_page=${pageSize}`;
    dispatch(fetchProjects({ url: getUrl, token: authCtx.token }));
  }, [isProjCreated, isProjUpdated, isProjDeleted, pageSize, currPage]);

  // handle delete project
  const handleDelete = (data) => {
    // const idList = data?.map((v) => v.id);
    if (data.length === 1) {
      const id = data[0]?.id;
      Swal.fire({
        title: 'Are you sure',
        icon: 'info',
        text: 'Do you want to delete the project!!',
        cancelButtonColor: 'red',
        showCancelButton: true,
        confirmButtonText: 'Delete',
        confirmButtonColor: '#3085d6',
        reverseButtons: true,
      }).then((value) => {
        if (value.isConfirmed) {
          const deleteUrl = `${lmApiUrl}/project/${id}`;
          dispatch(fetchDeleteProj({ url: deleteUrl, token: authCtx.token }));
        }
      });
    } else if (data.length > 1) {
      Swal.fire({
        title: 'Sorry',
        icon: 'info',
        text: 'You can not delete more then 1 project at the same time',
        confirmButtonColor: '#3085d6',
      });
    }
  };
  // handle Edit project
  const handleEdit = (data) => {
    if (data.length === 1) {
      setIsAddModal(true);
      const data1 = data[0];
      setEditData(data1);
    } else if (data.length > 1) {
      Swal.fire({
        title: 'Sorry!!',
        icon: 'info',
        text: 'You can not edit more than 1 project at the same time',
      });
    }
  };

  // send props in the batch action table
  const tableProps = {
    title: 'Projects',
    rowData: allProjects?.items?.length ? allProjects?.items : [],
    headerData,
    handleEdit,
    handleDelete,
    handleAddNew,
    handlePagination,
    totalItems: allProjects?.total_items,
    totalPages: allProjects?.total_pages,
    pageSize,
    page: allProjects?.page,
    inpPlaceholder: 'Search Project',
  };

  return (
    <div>
      {/* -- add User Modal -- */}
      <Theme theme="g10">
        <ComposedModal open={isAddModal} onClose={addModalClose}>
          <div className={mhContainer}>
            <h4>{editData?.name ? 'Edit Project' : 'Add New Project'}</h4>
            <ModalHeader onClick={addModalClose} />
          </div>

          <ModalBody id={modalBody}>
            <form onSubmit={handleSubmit(handleAddUser)} className={formContainer}>
              <Stack gap={7}>
                {/* Project name  */}
                <div>
                  <TextInput
                    defaultValue={editData?.name}
                    type="text"
                    id="project_name"
                    labelText="Project name"
                    placeholder="Please enter project name"
                    {...register('name', { required: editData?.name ? false : true })}
                  />
                  <p className={errText}>{errors.name && 'Invalid Name'}</p>
                </div>

                {/* project description  */}
                <div>
                  <TextArea
                    defaultValue={editData?.description}
                    id="project_description"
                    required={editData?.description ? false : true}
                    onChange={(e) => setProjectDescription(e.target.value)}
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
      </Theme>

      {isProjLoading && (
        <FlexboxGrid justify="center">
          <Loader size="md" label="" />
        </FlexboxGrid>
      )}
      <UseTable props={tableProps} />
    </div>
  );
};

export default Projects;
