import React, { useState, useContext, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Swal from 'sweetalert2';
import {
  fetchApplicationList,
  fetchDeleteLinkType,
  fetchLinkTypes,
  // fetchCreateLinkType,
  // fetchUpdateLinkType,
} from '../../../Redux/slices/linkTypeSlice';
import AuthContext from '../../../Store/Auth-Context';
import { handleCurrPageTitle, handleIsAddNewModal } from '../../../Redux/slices/navSlice';
import AdminDataTable from '../AdminDataTable';
import { FlexboxGrid, Form, Loader, Schema } from 'rsuite';
import TextField from '../TextField';
import AddNewModal from '../AddNewModal';
import { useRef } from 'react';
import SelectField from '../SelectField';
import CustomSelect from '../CustomSelect';

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
    applicationList,
    isLinkTypeLoading,
    isLinkTypeCreated,
    isLinkTypeUpdated,
    isLinkTypeDeleted,
  } = useSelector((state) => state.linkTypes);
  const [currPage, setCurrPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [formError, setFormError] = useState({});
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
  const handlePagination = (values) => {
    setPageSize(values.pageSize);
    setCurrPage(values.page);
  };

  // handle open add modal
  const handleAddNew = () => {
    dispatch(handleIsAddNewModal(true));
  };

  const handleAddLinkType = () => {
    if (!linkTypeFormRef.current.check()) {
      console.error('Form Error', formError);
      return;
    }

    console.log(formValue);
    setFormValue({
      name: '',
      url: '',
      application_id: '',
      incoming_label: '',
      outgoing_label: '',
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

  // create and edit link type form submit
  // const handleAddLinkType = (data) => {
  //   // update link type
  //   setIsAddModal(false);
  //   if (editData?.name) {
  //     data = {
  //       name: data?.name ? data?.name : editData?.name,
  //       url: data?.url ? data?.url : editData?.url,
  //       application_id: data?.application_id
  //         ? data?.application_id
  //         : editData?.application_id,
  //       incoming_label: data?.incoming_label
  //         ? data?.incoming_label
  //         : editData?.incoming_label,
  //       outgoing_label: data?.outgoing_label
  //         ? data?.outgoing_label
  //         : editData?.outgoing_label,
  //       description: linkDesc ? linkDesc : editData?.description,
  //     };
  //     const putUrl = `${lmApiUrl}/link-type/${editData?.id}`;
  //     dispatch(
  //       fetchUpdateLinkType({
  //         url: putUrl,
  //         token: authCtx.token,
  //         bodyData: data,
  //         reset,
  //       }),
  //     );
  //   }
  //   // create link type
  //   else {
  //     data.description = linkDesc;
  //     const postUrl = `${lmApiUrl}/link-type`;
  //     dispatch(
  //       fetchCreateLinkType({
  //         url: postUrl,
  //         token: authCtx.token,
  //         bodyData: data,
  //         reset,
  //       }),
  //     );
  //   }
  // };

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
  const handleEdit = () => {
    // if (data.length === 1) {
    //   setIsAddModal(true);
    //   const data1 = data[0];
    //   setEditData(data1);
    // } else if (data.length > 1) {
    //   Swal.fire({
    //     title: 'Sorry!!',
    //     icon: 'info',
    //     text: 'You can not edit more than 1 link type at the same time',
    //   });
    // }
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
      <AddNewModal handleSubmit={handleAddLinkType} title="Add New Link Type">
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
                <TextField name="name" label="Link Type Name" />
              </FlexboxGrid.Item>

              <FlexboxGrid.Item colspan={11}>
                <TextField name="url" label="Link Type URL" />
              </FlexboxGrid.Item>

              <FlexboxGrid.Item style={{ margin: '30px 0' }} colspan={11}>
                <TextField name="incoming_label" label="Incoming Label" />
              </FlexboxGrid.Item>

              <FlexboxGrid.Item style={{ margin: '30px 0' }} colspan={11}>
                <TextField name="outgoing_label" label="Outgoing Label" />
              </FlexboxGrid.Item>

              <FlexboxGrid.Item colspan={24}>
                <SelectField
                  name="application_id"
                  label="Application ID"
                  accepter={CustomSelect}
                  options={applicationList?.items ? applicationList?.items : []}
                  error={formError.organization_id}
                />
              </FlexboxGrid.Item>

              <FlexboxGrid.Item colspan={24} style={{ margin: '30px 0' }}>
                <TextField name="description" label="Description" />
              </FlexboxGrid.Item>
            </FlexboxGrid>
          </Form>
        </div>
      </AddNewModal>

      {isLinkTypeLoading && (
        <FlexboxGrid justify="center">
          <Loader size="md" label="" />
        </FlexboxGrid>
      )}
      {/* <UseTable props={tableProps} /> */}
      <AdminDataTable props={tableProps} />
    </div>
  );
};

export default LinkTypes;
