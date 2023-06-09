import React, { useState, useContext, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import AppSelectIcon from '@rsuite/icons/AppSelect';
import ScatterIcon from '@rsuite/icons/Scatter';
import Swal from 'sweetalert2';
import AuthContext from '../../../Store/Auth-Context';
import {
  handleCurrPageTitle,
  handleIsAddNewModal,
  handleIsAdminEditing,
} from '../../../Redux/slices/navSlice';
import AdminDataTable from '../AdminDataTable';
import { FlexboxGrid, Form, Schema, Col, Button } from 'rsuite';
import AddNewModal from '../AddNewModal';
import { useRef } from 'react';
import SelectField from '../SelectField';
import CustomSelect from '../CustomSelect';
import UseLoader from '../../Shared/UseLoader';
import {
  fetchCreateData,
  fetchDeleteData,
  fetchGetData,
  fetchUpdateData,
} from '../../../Redux/slices/useCRUDSlice';

import { actions as linkTypeActions } from '../../../Redux/slices/linkTypeSlice';

const lmApiUrl = process.env.REACT_APP_LM_REST_API_URL;

// demo data
const headerData = [
  {
    header: 'ID',
    key: 'id',
  },
  {
    header: 'Link Type',
    key: 'label',
  },
  {
    header: 'Domain',
    key: 'oslc_domain',
  },
  {
    header: 'Updated',
    key: 'updated',
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
  const { crudData, isCreated, isDeleted, isUpdated, isCrudLoading } = useSelector(
    (state) => state.crud,
  );

  const { selectedLinkTypeCreationMethod, applicationType } = useSelector(
    (state) => state.linkTypes,
  );

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

  const handleSelectedNewLinkTypeMethod = (value) => {
    console.log('value', value);
    dispatch(linkTypeActions.handleSelectedLinkTypeCreationMethod(value));
  };

  const handleApplication = (value) => {
    console.log('value', value);
    dispatch(linkTypeActions.handleApplicationType(value));
  };

  useEffect(() => {
    // If application exists then fetch link types for that application
    // Get rootservicesUrl
    // Get instanceShapes of all OSLC QC services
    // Request data from all instanceShapes to display the external link types in the UI
    // Here I need to take the OSLC domain provided by those external values
  }, [applicationType]);

  const handleAddLinkType = () => {
    if (!linkTypeFormRef.current.check()) {
      console.error('Form Error', formError);
      return;
    } else if (isAdminEditing) {
      const putUrl = `${lmApiUrl}/link-type/${editData?.id}`;
      dispatch(
        fetchUpdateData({
          url: putUrl,
          token: authCtx.token,
          bodyData: formValue,
        }),
      );
    } else {
      const postUrl = `${lmApiUrl}/link-type`;
      dispatch(
        fetchCreateData({
          url: postUrl,
          token: authCtx.token,
          bodyData: formValue,
          message: 'link type',
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
    dispatch(linkTypeActions.resetSelectedLinkTypeCreationMethod());
  };

  // get all link types
  useEffect(() => {
    dispatch(handleCurrPageTitle('Link Types'));

    const getUrl = `${lmApiUrl}/link-type?page=${currPage}&per_page=${pageSize}`;
    dispatch(
      fetchGetData({
        url: getUrl,
        token: authCtx.token,
        stateName: 'allLinkTypes',
      }),
    );
  }, [isCreated, isUpdated, isDeleted, pageSize, currPage, refreshData]);

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
        dispatch(fetchDeleteData({ url: deleteUrl, token: authCtx.token }));
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
    rowData: crudData?.allLinkTypes?.items?.length ? crudData?.allLinkTypes?.items : [],
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
    inpPlaceholder: 'Search Link Type',
  };

  return (
    <div>
      <AddNewModal
        title={selectedLinkTypeCreationMethod ? 'Add link types' : 'Choose an option'}
        handleSubmit={handleAddLinkType}
        handleReset={handleResetForm}
      >
        <div className="show-grid">
          {!selectedLinkTypeCreationMethod ? (
            <FlexboxGrid justify="space-around">
              <FlexboxGrid.Item as={Col} colspan={24} md={10}>
                <Button
                  appearance="subtle"
                  block
                  size={'lg'}
                  onClick={() => handleSelectedNewLinkTypeMethod('external')}
                >
                  <AppSelectIcon fontSize={'6em'} color={'#3498FF'} />
                  <br />
                  <p style={{ marginTop: '10px' }}>Add from external application</p>
                </Button>
              </FlexboxGrid.Item>
              <FlexboxGrid.Item as={Col} colspan={24} md={10}>
                <Button
                  appearance="subtle"
                  block
                  size={'lg'}
                  onClick={() => handleSelectedNewLinkTypeMethod('custom')}
                >
                  <ScatterIcon fontSize={'6em'} color={'#3498FF'} />
                  <br />
                  <p style={{ marginTop: '10px' }}>Add your own link type</p>
                </Button>
              </FlexboxGrid.Item>
            </FlexboxGrid>
          ) : (
            <Form
              fluid
              ref={linkTypeFormRef}
              onChange={setFormValue}
              onCheck={setFormError}
              formValue={formValue}
              model={model}
            >
              <FlexboxGrid justify="space-between">
                <FlexboxGrid.Item style={{ margin: '30px 0' }} colspan={24}>
                  <SelectField
                    name="application_id"
                    label="Application"
                    placeholder="Select Application"
                    accepter={CustomSelect}
                    apiURL={`${lmApiUrl}/application`}
                    onChange={handleApplication}
                    // error={formError.application_id}
                    // reqText="Organization Id is required"
                  />
                </FlexboxGrid.Item>

                <FlexboxGrid.Item style={{ margin: '30px 0' }} colspan={24}>
                  <SelectField
                    name="resource_type"
                    label="Resource type"
                    placeholder="Select resource type"
                    accepter={CustomSelect}
                  />
                </FlexboxGrid.Item>
              </FlexboxGrid>
            </Form>
          )}
        </div>
      </AddNewModal>

      {isCrudLoading && <UseLoader />}

      <AdminDataTable props={tableProps} />
    </div>
  );
};

export default LinkTypes;
