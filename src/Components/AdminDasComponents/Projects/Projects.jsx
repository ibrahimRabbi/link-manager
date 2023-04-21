import React, { useState, useContext, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Swal from 'sweetalert2';
import {
  fetchCreateProj,
  fetchDeleteProj,
  fetchProjects,
  // fetchCreateProj,
  // fetchUpdateProj,
} from '../../../Redux/slices/projectSlice';
import AuthContext from '../../../Store/Auth-Context';
import { handleCurrPageTitle, handleIsAddNewModal } from '../../../Redux/slices/navSlice';
import { FlexboxGrid, Form, Loader, Schema } from 'rsuite';
import AdminDataTable from '../AdminDataTable';
import AddNewModal from '../AddNewModal';
import TextField from '../TextField';
import TextArea from '../TextArea';

// import UseTable from '../UseTable';
// import styles from './Projects.module.scss';
// const { errText, formContainer, modalBtnCon, modalBody, mhContainer } = styles;

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
    header: 'Description',
    key: 'description',
  },
];

const { StringType } = Schema.Types;

const model = Schema.Model({
  name: StringType().isRequired('This field is required.'),
  description: StringType().isRequired('This field is required.'),
});

const Projects = () => {
  const { allProjects, isProjLoading, isProjCreated, isProjUpdated, isProjDeleted } =
    useSelector((state) => state.projects);
  const { refreshData } = useSelector((state) => state.nav);
  const [currPage, setCurrPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [formError, setFormError] = useState({});
  const [formValue, setFormValue] = useState({
    name: '',
    description: '',
  });

  const projectFormRef = useRef();
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

  // handle open add user modal
  const handleAddNew = () => {
    dispatch(handleIsAddNewModal(true));
  };

  const handleAddProject = () => {
    if (!projectFormRef.current.check()) {
      console.error('Form Error', formError);
      return;
    }

    console.log(formValue);
    const postUrl = `${lmApiUrl}/project`;
    dispatch(
      fetchCreateProj({
        url: postUrl,
        token: authCtx.token,
        bodyData: formValue,
      }),
    );

    setFormValue({
      name: '',
      description: '',
    });
    dispatch(handleIsAddNewModal(false));
  };

  // add modal close
  // const addModalClose = () => {
  //   setEditData({});
  //   setIsAddModal(false);
  //   reset();
  // };

  // create and edit project form submit
  // const handleAddUser = (data) => {
  //   setIsAddModal(false);
  //   // update project
  //   if (editData?.name) {
  //     data = {
  //       name: data?.name ? data?.name : editData?.name,
  //       description: projectDescription ? projectDescription : editData?.description,
  //     };
  //     const putUrl = `${lmApiUrl}/project/${editData?.id}`;
  //     dispatch(
  //       fetchUpdateProj({
  //         url: putUrl,
  //         token: authCtx.token,
  //         bodyData: data,
  //         reset,
  //       }),
  //     );
  //   }
  //   // create project
  //   else {
  //     data.description = projectDescription;
  //     const postUrl = `${lmApiUrl}/project`;
  //     dispatch(
  //       fetchCreateProj({
  //         url: postUrl,
  //         token: authCtx.token,
  //         bodyData: data,
  //         reset,
  //       }),
  //     );
  //   }
  // };

  // get all projects
  useEffect(() => {
    dispatch(handleCurrPageTitle('Projects'));

    const getUrl = `${lmApiUrl}/project?page=${currPage}&per_page=${pageSize}`;
    dispatch(fetchProjects({ url: getUrl, token: authCtx.token }));
  }, [isProjCreated, isProjUpdated, isProjDeleted, pageSize, currPage, refreshData]);

  // handle delete project
  const handleDelete = (data) => {
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
        const deleteUrl = `${lmApiUrl}/project/${data?.id}`;
        dispatch(fetchDeleteProj({ url: deleteUrl, token: authCtx.token }));
      }
    });
  };
  // handle Edit project
  const handleEdit = (data) => {
    console.log(data);
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
    handleChangeLimit,
    totalItems: allProjects?.total_items,
    totalPages: allProjects?.total_pages,
    pageSize,
    page: allProjects?.page,
    inpPlaceholder: 'Search Project',
  };

  return (
    <div>
      <AddNewModal title="Add New Project" handleSubmit={handleAddProject}>
        <Form
          fluid
          ref={projectFormRef}
          onChange={setFormValue}
          onCheck={setFormError}
          formValue={formValue}
          model={model}
        >
          <TextField
            name="name"
            label="Project Name"
            reqText="Project name is required"
          />
          <div style={{ margin: '30px 0 10px' }}>
            <TextField
              name="description"
              label="Project Description"
              accepter={TextArea}
              rows={5}
              reqText="Project description is required"
            />
          </div>
        </Form>
      </AddNewModal>

      {isProjLoading && (
        <FlexboxGrid justify="center">
          <Loader size="md" label="" />
        </FlexboxGrid>
      )}
      {/* <UseTable props={tableProps} /> */}

      <AdminDataTable props={tableProps} />
    </div>
  );
};

export default Projects;
