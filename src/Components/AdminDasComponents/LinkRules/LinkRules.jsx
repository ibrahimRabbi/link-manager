import React, { useState, useContext, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import AuthContext from '../../../Store/Auth-Context';
import {
  handleCurrPageTitle,
  handleIsAddNewModal,
  handleIsAdminEditing,
} from '../../../Redux/slices/navSlice';
import AdminDataTable from '../AdminDataTable';
import { FlexboxGrid, Form, Schema, Message, toaster } from 'rsuite';
import AddNewModal from '../AddNewModal';
import SelectField from '../SelectField';
import { PiArrowsClockwiseFill } from 'react-icons/pi';
import UseLoader from '../../Shared/UseLoader';
import {
  fetchCreateData,
  fetchDeleteData,
  fetchGetData,
  fetchUpdateData,
} from '../../../Redux/slices/useCRUDSlice';

import TextField from '../TextField.jsx';
import CustomReactSelect from '../../Shared/Dropdowns/CustomReactSelect';
import AlertModal from '../../Shared/AlertModal';

const lmApiUrl = import.meta.env.VITE_LM_REST_API_URL;

// demo data
const headerData = [
  {
    header: 'Link Type',
    key: 'link_type',
  },
  {
    header: 'Backward Link Type',
    key: 'backward_link_type',
  },
  {
    header: 'Updated',
    updatedTime: 'updated',
  },
];

const requiredLabel = 'This field is required.';
const regexLabel = 'Please try to enter a label without spaces nor special characters.';

const { StringType, ArrayType } = Schema.Types;

const model = Schema.Model({
  source_resource_id: ArrayType().isRequired(requiredLabel),
  label: StringType()
    .addRule((value) => {
      const regex = /^[A-Za-z]+$/;
      return regex.test(value);
    }, regexLabel)
    .isRequired(requiredLabel),
  target_resource_id: ArrayType().isRequired(requiredLabel),
  inverse_label: StringType()
    .addRule((value) => {
      const regex = /^[A-Za-z]+$/;
      return regex.test(value);
    }, regexLabel)
    .isRequired(requiredLabel),
});

const LinkRoles = () => {
  const { crudData, isCreated, isDeleted, isUpdated, isCrudLoading } = useSelector(
    (state) => state.crud,
  );
  const { isDark } = useSelector((state) => state.nav);
  const { refreshData, isAdminEditing } = useSelector((state) => state.nav);
  const [currPage, setCurrPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [formError, setFormError] = useState({});
  const [editData, setEditData] = useState({});
  const [open, setOpen] = useState(false);
  const [deleteData, setDeleteData] = useState({});
  const [mappedLinkTypes, setMappedLinkTypes] = useState([]);
  const [formValue, setFormValue] = useState({
    source_resource_id: '',
    label: '',
    target_resource_id: '',
    inverse_label: '',
  });
  const linkTypeFormRef = useRef();
  const authCtx = useContext(AuthContext);
  const dispatch = useDispatch();

  const showNotification = (type, message) => {
    if (type && message) {
      const messages = (
        <Message closable showIcon type={type}>
          {message}
        </Message>
      );
      toaster.push(messages, { placement: 'bottomCenter', duration: 5000 });
    }
  };

  // get all link types
  useEffect(() => {
    dispatch(handleCurrPageTitle('Link Rules'));

    const getUrl = `${lmApiUrl}/link-type?page=${currPage}&per_page=${pageSize}`;
    dispatch(
      fetchGetData({
        url: getUrl,
        token: authCtx.token,
        stateName: 'allLinkTypes',
        showNotification: showNotification,
      }),
    );
  }, [isCreated, isUpdated, isDeleted, pageSize, currPage, refreshData]);

  // map link types to display labels in the table from nested object
  useEffect(() => {
    if (crudData?.allLinkTypes) {
      const mappedData = crudData?.allLinkTypes?.items?.reduce((accumulator, item) => {
        if (item?.id) {
          const newItem = {
            ...item,
            link_type: item?.source_link?.name,
            backward_link_type: item?.target_link?.name,
          };
          accumulator?.push(newItem);
        }
        return accumulator;
      }, []);
      setMappedLinkTypes(mappedData);
    }
  }, [crudData?.allLinkTypes]);

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

  // handle submit create and edit link rules
  const handleAddLinkRoles = () => {
    if (!linkTypeFormRef.current.check()) {
      console.error('Form Error', formError);
      return;
    }

    // map source and target to send only id list
    const source_resource_id = formValue?.source_resource_id?.map((v) => v?.id);
    const target_resource_id = formValue?.target_resource_id?.map((v) => v?.id);
    const bodyData = {
      source_resource_id: source_resource_id,
      label: formValue.label,
      target_resource_id: target_resource_id,
      inverse_label: formValue.inverse_label,
    };

    if (isAdminEditing) {
      const putUrl = `${lmApiUrl}/link-type/${editData?.id}`;
      dispatch(
        fetchUpdateData({
          url: putUrl,
          token: authCtx.token,
          bodyData: bodyData,
          showNotification: showNotification,
        }),
      );
    } else {
      const postUrl = `${lmApiUrl}/link-type`;
      dispatch(
        fetchCreateData({
          url: postUrl,
          token: authCtx.token,
          bodyData: bodyData,
          message: 'link roles',
          showNotification: showNotification,
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
      source_resource_id: '',
      label: '',
      target_resource_id: '',
      inverse_label: '',
    });
  };

  // handle delete link type
  const handleDelete = (data) => {
    setDeleteData(data);
    setOpen(true);
  };
  const handleConfirmed = (value) => {
    if (value) {
      const deleteUrl = `${lmApiUrl}/link-type/${deleteData?.id}`;
      dispatch(
        fetchDeleteData({
          url: deleteUrl,
          token: authCtx.token,
          showNotification: showNotification,
        }),
      );
    }
  };
  // handle Edit link type
  const handleEdit = async (data) => {
    setEditData(data);
    dispatch(handleIsAdminEditing(true));
    const sourceLinks = data?.source_link?.constraints;
    const targetLinks = data?.target_link?.constraints;

    // set source id list to display default value in the dropdown
    const source_links = sourceLinks?.reduce((accumulator, item) => {
      accumulator.push({
        ...item,
        name: item?.title,
        label: item?.title,
        value: item?.id,
      });
      return accumulator;
    }, []);

    // set target id list to display default value in the dropdown
    const target_links = targetLinks?.reduce((accumulator, item) => {
      accumulator.push({
        ...item,
        name: item?.title,
        label: item?.title,
        value: item?.id,
      });
      return accumulator;
    }, []);

    setFormValue({
      label: data?.source_link?.name,
      source_resource_id: source_links,
      inverse_label: data?.target_link?.name,
      target_resource_id: target_links,
    });
    dispatch(handleIsAddNewModal(true));
  };

  // send props in the batch action table
  const tableProps = {
    rowData: crudData?.allLinkTypes?.items?.length ? mappedLinkTypes : [],
    headerData,
    handleEdit,
    handleDelete,
    handleAddNew,
    handlePagination,
    handleChangeLimit,
    totalItems: crudData?.allLinkTypes?.total_items,
    totalPages: crudData?.allLinkTypes?.total_pages,
    pageSize,
    page: crudData?.allLinkTypes?.page,
  };

  return (
    <div>
      <AddNewModal
        size={'lg'}
        title={isAdminEditing ? 'Edit link rules' : 'Add new link rules'}
        handleSubmit={handleAddLinkRoles}
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
                <SelectField
                  name="source_resource_id"
                  label="Source Resource Type"
                  placeholder="Select Resource Type"
                  accepter={CustomReactSelect}
                  apiURL={`${lmApiUrl}/resource-type/web-resource`}
                  isMulti={true}
                  isResourceType={true}
                />
              </FlexboxGrid.Item>

              <FlexboxGrid.Item style={{ marginTop: '-5px' }} colspan={11}>
                <TextField
                  name={'label'}
                  label="Link Type"
                  reqText="Link type label is required"
                />
              </FlexboxGrid.Item>

              {/* -- by directional arrow --  */}
              <FlexboxGrid.Item colspan={24} style={{ textAlign: 'center', margin: '0' }}>
                <PiArrowsClockwiseFill
                  size={50}
                  color={isDark === 'dark' ? '#169de0' : '#3498ff'}
                />
              </FlexboxGrid.Item>

              <FlexboxGrid.Item colspan={11}>
                <SelectField
                  name="target_resource_id"
                  label="Target Resource Type"
                  placeholder="Select Resource Type"
                  accepter={CustomReactSelect}
                  apiURL={`${lmApiUrl}/resource-type/web-resource`}
                  isMulti={true}
                  isResourceType={true}
                />
              </FlexboxGrid.Item>

              <FlexboxGrid.Item style={{ marginTop: '-5px' }} colspan={11}>
                <TextField
                  name={'inverse_label'}
                  label="Backward Link Type"
                  reqText="URL domain is required"
                />
              </FlexboxGrid.Item>
            </FlexboxGrid>
          </Form>
        </div>
      </AddNewModal>

      {isCrudLoading && <UseLoader />}

      {/* confirmation modal  */}
      <AlertModal
        open={open}
        setOpen={setOpen}
        content={'Do you want to delete the this link type?'}
        handleConfirmed={handleConfirmed}
      />

      <AdminDataTable props={tableProps} />
    </div>
  );
};

export default LinkRoles;
