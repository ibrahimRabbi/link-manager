import React, { useState, useContext, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Swal from 'sweetalert2';
import {
  fetchApplicationList,
  fetchCreateLinkType,
  fetchDeleteLinkType,
  fetchLinkTypes,
  fetchUpdateLinkType,
  // fetchCreateLinkType,
  // fetchUpdateLinkType,
} from '../../../Redux/slices/linkTypeSlice';
import AuthContext from '../../../Store/Auth-Context';
import {
  handleCurrPageTitle,
  handleIsAddNewModal,
  handleIsAdminEditing,
} from '../../../Redux/slices/navSlice';
import AdminDataTable from '../AdminDataTable';
import { FlexboxGrid, Form, Schema } from 'rsuite';
import TextField from '../TextField';
import AddNewModal from '../AddNewModal';
import { useRef } from 'react';
import SelectField from '../SelectField';
import CustomSelect from '../CustomSelect';
import TextArea from '../TextArea';
import UseLoader from '../../Shared/UseLoader';

// import styles from './LinkTypes.module.scss';
// const { errText, formContainer,
// modalBtnCon, modalBody, mhContainer, flNameContainer } =
//   styles;

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

const { StringType, NumberType } = Schema.Types;

const model = Schema.Model({
  name: StringType().isRequired('This field is required.'),
  url: StringType().isRequired('This field is required.'),
  application_id: NumberType().isRequired('This field is required.'),
  incoming_label: StringType().isRequired('This field is required.'),
  outgoing_label: StringType().isRequired('This field is required.'),
  description: StringType().isRequired('This field is required.'),
});

const LinkTypes = () => {
  const {
    allLinkTypes,
    isLinkTypeLoading,
    isLinkTypeCreated,
    isLinkTypeUpdated,
    isLinkTypeDeleted,
  } = useSelector((state) => state.linkTypes);
  const { refreshData, isAdminEditing } = useSelector((state) => state.nav);
  const [currPage, setCurrPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [formError, setFormError] = useState({});
  const [editData, setEditData] = useState({});
  const [formValue, setFormValue] = useState({
    name: '',
    url: '',
    application_id: '',
    incoming_label: '',
    outgoing_label: '',
    description: '',
  });

  const linkTypeFormRef = useRef();
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

  // handle open add modal
  const handleAddNew = () => {
    handleResetForm();
    dispatch(handleIsAddNewModal(true));
  };

  const handleAddLinkType = () => {
    if (!linkTypeFormRef.current.check()) {
      console.error('Form Error', formError);
      return;
    } else if (isAdminEditing) {
      const putUrl = `${lmApiUrl}/link-type/${editData?.id}`;
      dispatch(
        fetchUpdateLinkType({
          url: putUrl,
          token: authCtx.token,
          bodyData: formValue,
        }),
      );
    } else {
      const postUrl = `${lmApiUrl}/link-type`;
      dispatch(
        fetchCreateLinkType({
          url: postUrl,
          token: authCtx.token,
          bodyData: formValue,
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
      url: '',
      application_id: '',
      incoming_label: '',
      outgoing_label: '',
      description: '',
    });
  };

  useEffect(() => {
    dispatch(
      fetchApplicationList({
        url: `${lmApiUrl}/application?page=${'1'}&per_page=${'100'}`,
        token: authCtx.token,
      }),
    );
  }, []);

  // get all link types
  useEffect(() => {
    dispatch(handleCurrPageTitle('Link Types'));

    const getUrl = `${lmApiUrl}/link-type?page=${currPage}&per_page=${pageSize}`;
    dispatch(fetchLinkTypes({ url: getUrl, token: authCtx.token }));
  }, [
    isLinkTypeCreated,
    isLinkTypeUpdated,
    isLinkTypeDeleted,
    pageSize,
    currPage,
    refreshData,
  ]);

  // handle delete link type
  const handleDelete = (data) => {
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
        const deleteUrl = `${lmApiUrl}/link-type/${data?.id}`;
        dispatch(fetchDeleteLinkType({ url: deleteUrl, token: authCtx.token }));
      }
    });
  };
  // handle Edit link type
  const handleEdit = (data) => {
    setEditData(data);
    dispatch(handleIsAdminEditing(true));
    setFormValue({
      name: data?.name,
      url: data?.url,
      application_id: data?.application_id,
      incoming_label: data?.incoming_label,
      outgoing_label: data?.outgoing_label,
      description: data?.description,
    });
    dispatch(handleIsAddNewModal(true));
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
    handleChangeLimit,
    totalItems: allLinkTypes?.total_items,
    totalPages: allLinkTypes?.total_pages,
    pageSize,
    page: allLinkTypes?.page,
    inpPlaceholder: 'Search Link Type',
  };

  return (
    <div>
      <AddNewModal
        title={isAdminEditing ? 'Edit Link Type' : 'Add New Link Type'}
        handleSubmit={handleAddLinkType}
        handleReset={handleResetForm}
      >
        <div className="show-grid">
          <Form
            fluid
            ref={linkTypeFormRef}
            onChange={setFormValue}
            onCheck={setFormError}
            formValue={formValue}
            model={model}
          >
            <FlexboxGrid justify="space-between">
              <FlexboxGrid.Item colspan={11}>
                <TextField name="name" label="Name" reqText="Name is required" />
              </FlexboxGrid.Item>

              <FlexboxGrid.Item colspan={11}>
                <TextField name="url" label="URL" reqText="URL is required" />
              </FlexboxGrid.Item>

              <FlexboxGrid.Item style={{ margin: '30px 0' }} colspan={11}>
                <TextField
                  name="incoming_label"
                  label="Incoming Label"
                  reqText="Incoming label is required"
                />
              </FlexboxGrid.Item>

              <FlexboxGrid.Item style={{ margin: '30px 0' }} colspan={11}>
                <TextField
                  name="outgoing_label"
                  label="Outgoing Label"
                  reqText="Outgoing label is required"
                />
              </FlexboxGrid.Item>

              <FlexboxGrid.Item colspan={24}>
                <SelectField
                  name="application_id"
                  label="Application ID"
                  placeholder="Select application ID"
                  accepter={CustomSelect}
                  apiURL={`${lmApiUrl}/application`}
                  error={formError.organization_id}
                  reqText="Application Id is required"
                />
              </FlexboxGrid.Item>

              <FlexboxGrid.Item colspan={24} style={{ margin: '30px 0 10px' }}>
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

      {isLinkTypeLoading && <UseLoader />}
      {/* <UseTable props={tableProps} /> */}
      <AdminDataTable props={tableProps} />
    </div>
  );
};

export default LinkTypes;
