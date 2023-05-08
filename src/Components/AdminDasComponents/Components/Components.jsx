import React, { useState, useContext, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Swal from 'sweetalert2';
import {
  fetchComponents,
  fetchCreateComp,
  fetchDeleteComp,
  fetchUpdateComp,
} from '../../../Redux/slices/componentSlice';
import AuthContext from '../../../Store/Auth-Context';
import {
  handleCurrPageTitle,
  handleIsAddNewModal,
  handleIsAdminEditing,
} from '../../../Redux/slices/navSlice';
import AddNewModal from '../AddNewModal';
import AdminDataTable from '../AdminDataTable';
import { FlexboxGrid, Form, Schema } from 'rsuite';
import TextField from '../TextField';
import SelectField from '../SelectField';
import { useRef } from 'react';
import CustomSelect from '../CustomSelect';
import TextArea from '../TextArea';
import UseLoader from '../../Shared/UseLoader';

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
  const { allComponents, isCompLoading, isCompUpdated, isCompCreated, isCompDeleted } =
    useSelector((state) => state.components);
  const { refreshData, isAdminEditing } = useSelector((state) => state.nav);

  const [currPage, setCurrPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [formError, setFormError] = useState({});
  const [editData, setEditData] = useState({});
  const [formValue, setFormValue] = useState({
    name: '',
    project_id: '',
    description: '',
  });

  const componentFormRef = useRef();
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

  // handle open add component modal
  const handleAddNew = () => {
    handleResetForm();
    dispatch(handleIsAddNewModal(true));
  };

  const handleAddLinkComponent = () => {
    if (!componentFormRef.current.check()) {
      console.error('Form Error', formError);
      return;
    } else if (isAdminEditing) {
      const putUrl = `${lmApiUrl}/component/${editData?.id}`;
      dispatch(
        fetchUpdateComp({
          url: putUrl,
          token: authCtx.token,
          bodyData: formValue,
        }),
      );
    } else {
      const postUrl = `${lmApiUrl}/component`;
      dispatch(
        fetchCreateComp({
          url: postUrl,
          token: authCtx.token,
          bodyData: formValue,
          message: 'component',
        }),
      );
    }
    dispatch(handleIsAddNewModal(false));
    if (isAdminEditing) dispatch(handleIsAdminEditing(false));
  };

  // reset form
  const handleResetForm = () => {
    setEditData({});
    setFormValue({
      name: '',
      project_id: '',
      description: '',
    });
  };

  useEffect(() => {
    dispatch(handleCurrPageTitle('Components'));

    const getUrl = `${lmApiUrl}/component?page=${currPage}&per_page=${pageSize}`;
    dispatch(fetchComponents({ url: getUrl, token: authCtx.token }));
  }, [isCompCreated, isCompUpdated, isCompDeleted, pageSize, currPage, refreshData]);

  // handle delete component
  const handleDelete = (data) => {
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
        const deleteUrl = `${lmApiUrl}/component/${data?.id}`;
        dispatch(fetchDeleteComp({ url: deleteUrl, token: authCtx.token }));
      }
    });
  };
  // handle Edit component
  const handleEdit = (data) => {
    setEditData(data);
    dispatch(handleIsAdminEditing(true));
    setFormValue({
      name: data?.name,
      project_id: data?.project_id,
      description: data?.description,
    });
    dispatch(handleIsAddNewModal(true));
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
    handleChangeLimit,
    totalItems: allComponents?.total_items,
    totalPages: allComponents?.total_pages,
    pageSize,
    page: allComponents?.page,
    inpPlaceholder: 'Search Component',
  };

  return (
    <div>
      <AddNewModal
        title={isAdminEditing ? 'Edit Component' : 'Add New Component'}
        handleSubmit={handleAddLinkComponent}
        handleReset={handleResetForm}
      >
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
                <TextField name="name" label="Name" reqText="Name is required" />
              </FlexboxGrid.Item>

              <FlexboxGrid.Item style={{ margin: '30px 0' }} colspan={24}>
                <SelectField
                  placeholder="Select project"
                  name="project_id"
                  label="Project"
                  accepter={CustomSelect}
                  apiURL={`${lmApiUrl}/project`}
                  error={formError.project_id}
                  reqText="Project ID is required"
                />
              </FlexboxGrid.Item>

              <FlexboxGrid.Item colspan={24} style={{ marginBottom: '10px' }}>
                <TextField
                  name="description"
                  label="Description"
                  accepter={TextArea}
                  rows={5}
                  reqText="Description is required"
                />
              </FlexboxGrid.Item>
            </FlexboxGrid>
          </Form>
        </div>
      </AddNewModal>

      {isCompLoading && <UseLoader />}
      <AdminDataTable props={tableProps} />
    </div>
  );
};

export default Components;
