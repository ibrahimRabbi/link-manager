import React, { useState, useContext, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Swal from 'sweetalert2';
import {
  fetchComponents,
  fetchDeleteComp,
  fetchProjectList,
  // fetchCreateComp,
  // fetchUpdateComp,
} from '../../../Redux/slices/componentSlice';
import AuthContext from '../../../Store/Auth-Context';
import { handleCurrPageTitle, handleIsAddNewModal } from '../../../Redux/slices/navSlice';
import AddNewModal from '../AddNewModal';
import AdminDataTable from '../AdminDataTable';
import { FlexboxGrid, Form, Loader, Schema } from 'rsuite';
import TextField from '../TextField';
import SelectField from '../SelectField';
import { useRef } from 'react';
import CustomSelect from '../CustomSelect';

// import styles from './Components.module.scss';
// const { errText, formContainer, modalBtnCon, modalBody, mhContainer } = styles;

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

const { StringType, NumberType } = Schema.Types;

const model = Schema.Model({
  name: StringType().isRequired('This field is required.'),
  project_id: NumberType().isRequired('This field is required.'),
  description: StringType().isRequired('This field is required.'),
});

const Components = () => {
  const {
    allComponents,
    isCompLoading,
    isCompUpdated,
    isCompCreated,
    isCompDeleted,
    projectList,
  } = useSelector((state) => state.components);

  const [currPage, setCurrPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [formError, setFormError] = useState({});
  const [formValue, setFormValue] = useState({
    name: '',
    project_id: '',
    description: '',
  });

  const componentFormRef = useRef();
  const authCtx = useContext(AuthContext);
  const dispatch = useDispatch();

  // handle open add component modal
  const handleAddNew = () => {
    dispatch(handleIsAddNewModal(true));
  };

  const handleAddLinkComponent = () => {
    if (!componentFormRef.current.check()) {
      console.error('Form Error', formError);
      return;
    }

    console.log(formValue);
    setFormValue({
      name: '',
      source_url: '',
      target_url: '',
      application_id: '',
      link_type_id: '',
      description: '',
    });
    dispatch(handleIsAddNewModal(false));
  };

  // create and edit component form submit
  // const handleAddUser = (data) => {
  //   setIsAddModal(false);
  //   // update component
  //   if (editData?.name) {
  //     data = {
  //       name: data?.name ? data?.name : editData?.name,
  //       project_id: data.project_id ? data.project_id : editData?.project_id,
  //       description: componentDesc ? componentDesc : editData?.description,
  //     };
  //     const putUrl = `${lmApiUrl}/component/${editData?.id}`;
  //     dispatch(
  //       fetchUpdateComp({
  //         url: putUrl,
  //         token: authCtx.token,
  //         bodyData: data,
  //         reset,
  //       }),
  //     );
  //   }
  //   // Create component
  //   else {
  //     data.description = componentDesc;
  //     const postUrl = `${lmApiUrl}/component`;
  //     dispatch(
  //       fetchCreateComp({
  //         url: postUrl,
  //         token: authCtx.token,
  //         bodyData: data,
  //         reset,
  //       }),
  //     );
  //   }
  // };

  // Pagination
  const handlePagination = (values) => {
    setPageSize(values.pageSize);
    setCurrPage(values.page);
  };

  useEffect(() => {
    dispatch(
      fetchProjectList({
        url: `${lmApiUrl}/project?page=${'1'}&per_page=${'100'}`,
        token: authCtx.token,
      }),
    );
  }, []);

  useEffect(() => {
    dispatch(handleCurrPageTitle('Components'));

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
  const handleEdit = () => {
    // if (data.length === 1) {
    //   setIsAddModal(true);
    //   const data1 = data[0];
    //   setEditData(data1);
    // } else if (data.length > 1) {
    //   Swal.fire({
    //     title: 'Sorry!!',
    //     icon: 'info',
    //     text: 'You can not edit more than 1 application at the same time',
    //   });
    // }
  };

  // send props in the batch action table
  const tableProps = {
    title: 'Components',
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
      <AddNewModal title="Add New Component" handleSubmit={handleAddLinkComponent}>
        <div className="show-grid">
          <Form
            fluid
            ref={componentFormRef}
            onChange={setFormValue}
            onCheck={setFormError}
            formValue={formValue}
            model={model}
          >
            <FlexboxGrid justify="space-between">
              <FlexboxGrid.Item colspan={24}>
                <TextField name="name" label="Link Component Name" />
              </FlexboxGrid.Item>

              <FlexboxGrid.Item style={{ margin: '30px 0' }} colspan={24}>
                <SelectField
                  placeholder="Select project"
                  name="project_id"
                  label="Project"
                  accepter={CustomSelect}
                  options={projectList?.items ? projectList?.items : []}
                  error={formError.project_id}
                />
              </FlexboxGrid.Item>

              <FlexboxGrid.Item colspan={24} style={{ marginBottom: '30px' }}>
                <TextField name="description" label="Description" />
              </FlexboxGrid.Item>
            </FlexboxGrid>
          </Form>
        </div>
      </AddNewModal>

      {isCompLoading && (
        <FlexboxGrid justify="center">
          <Loader size="md" label="" />
        </FlexboxGrid>
      )}
      <AdminDataTable props={tableProps} />
    </div>
  );
};

export default Components;
