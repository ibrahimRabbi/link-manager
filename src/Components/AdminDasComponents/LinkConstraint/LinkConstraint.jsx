import React, { useState, useContext, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Swal from 'sweetalert2';
import AuthContext from '../../../Store/Auth-Context';
import {
  handleCurrPageTitle,
  handleIsAddNewModal,
  handleIsAdminEditing,
} from '../../../Redux/slices/navSlice';
import { Button, FlexboxGrid, Form, Schema } from 'rsuite';
import AdminDataTable from '../AdminDataTable';
import AddNewModal from '../AddNewModal';
import { useRef } from 'react';
import SelectField from '../SelectField';
import CustomSelect from '../CustomSelect';
import ConversionIcon from '@rsuite/icons/Conversion';
import UseLoader from '../../Shared/UseLoader';
import {
  fetchCreateData,
  fetchDeleteData,
  fetchGetData,
  fetchUpdateData,
} from '../../../Redux/slices/useCRUDSlice';
import Notification from '../../Shared/Notification';
import PlusRoundIcon from '@rsuite/icons/PlusRound.js';

const lmApiUrl = import.meta.env.VITE_LM_REST_API_URL;

// demo data
const headerData = [
  {
    header: 'ID',
    key: 'id',
  },
  {
    header: 'Link Constraint',
    key: 'name',
  },
  {
    header: 'Source URL',
    key: 'source_url',
  },
  {
    header: 'Target URL',
    key: 'target_url',
  },
  {
    header: 'Description',
    key: 'description',
  },
];

const { StringType, ArrayType } = Schema.Types;

const LinkConstraint = () => {
  const { crudData, isCreated, isDeleted, isUpdated, isCrudLoading } = useSelector(
    (state) => state.crud,
  );

  const { refreshData, isAdminEditing } = useSelector((state) => state.nav);
  const [currPage, setCurrPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [formError, setFormError] = useState({});
  const [editData, setEditData] = useState({});
  const [formValue, setFormValue] = useState({
    source_resource_type_1: '',
    source_label_1: '',
    target_label_1: '',
    target_resource_type_1: '',
  });
  const [notificationType, setNotificationType] = useState('');
  const [notificationMessage, setNotificationMessage] = useState('');
  const showNotification = (type, message) => {
    setNotificationType(type);
    setNotificationMessage(message);
  };

  const [formElements, setFormElements] = useState([1]);
  const [model, setModel] = useState(
    Schema.Model({
      source_resource_type_1: ArrayType().isRequired('This field is required.'),
      source_label_1: StringType().isRequired('This field is required.'),
      target_label_1: StringType().isRequired('This field is required.'),
      target_resource_type_1: ArrayType().isRequired('This field is required.'),
    }),
  );
  const linkConstFormRef = useRef();
  const authCtx = useContext(AuthContext);
  const dispatch = useDispatch();

  const addExtraFormElements = () => {
    let modelData = {};
    let newFormValue = {};
    const lastElement = formElements[formElements.length - 1];

    const newElement = lastElement + 1;
    setFormElements([...formElements, newElement]);
    const newFormElements = [...formElements, newElement];

    newFormElements.forEach((element) => {
      modelData[`source_resource_type_${element}`] = ArrayType().isRequired(
        'This field is required.',
      );
      modelData[`source_label_${element}`] = StringType().isRequired(
        'This field is required.',
      );
      modelData[`target_label_${element}`] = StringType().isRequired(
        'This field is required.',
      );
      modelData[`target_resource_type_${element}`] = ArrayType().isRequired(
        'This field is required.',
      );
    });

    const newModel = Schema.Model(modelData);
    setModel(newModel);

    newFormValue[`source_resource_type_${newElement}`] = '';
    newFormValue[`source_label_${newElement}`] = '';
    newFormValue[`target_label_${newElement}`] = '';
    newFormValue[`target_resource_type_${newElement}`] = '';
    setFormValue({ ...formValue, ...newFormValue });
  };

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
    handleResetForm();
    dispatch(handleIsAddNewModal(true));
  };

  const handleAddLinkConstraint = () => {
    if (!linkConstFormRef.current.check()) {
      console.error('Form Error', formError);
      return;
    } else if (isAdminEditing) {
      const putUrl = `${lmApiUrl}/link-constraint/${editData?.id}`;
      dispatch(
        fetchUpdateData({
          url: putUrl,
          token: authCtx.token,
          bodyData: formValue,
          showNotification: showNotification,
        }),
      );
    } else {
      const postUrl = `${lmApiUrl}/link-constraint`;
      dispatch(
        fetchCreateData({
          url: postUrl,
          token: authCtx.token,
          bodyData: formValue,
          message: 'link constraint',
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
      name: '',
      url: '',
      application_id: '',
      incoming_label: '',
      outgoing_label: '',
      description: '',
    });
  };

  useEffect(() => {
    dispatch(handleCurrPageTitle('Link Constraint'));

    const getUrl = `${lmApiUrl}/link-constraint?page=${currPage}&per_page=${pageSize}`;
    dispatch(
      fetchGetData({
        url: getUrl,
        token: authCtx.token,
        stateName: 'allLinkConstraints',
        showNotification: showNotification,
      }),
    );
  }, [isCreated, isUpdated, isDeleted, pageSize, currPage, refreshData]);

  // handle delete LinkConstraint
  const handleDelete = (data) => {
    Swal.fire({
      title: 'Are you sure',
      icon: 'info',
      text: 'Do you want to delete the this link constraint!!',
      cancelButtonColor: 'red',
      showCancelButton: true,
      confirmButtonText: 'Delete',
      confirmButtonColor: '#3085d6',
      reverseButtons: true,
    }).then((value) => {
      if (value.isConfirmed) {
        const deleteUrl = `${lmApiUrl}/link-constraint/${data?.id}`;
        dispatch(
          fetchDeleteData({
            url: deleteUrl,
            token: authCtx.token,
            showNotification: showNotification,
          }),
        );
      }
    });
  };

  // handle Edit LinkConstraint
  const handleEdit = (data) => {
    setEditData(data);
    dispatch(handleIsAdminEditing(true));
    setFormValue({
      name: data?.name,
      source_url: data?.source_url,
      target_url: data?.target_url,
      application_id: data?.application_id,
      link_type_id: data?.link_type_id,
      description: data?.description,
    });

    dispatch(handleIsAddNewModal(true));
  };

  // send props in the batch action table
  const tableProps = {
    title: 'Link Constraint',
    rowData: crudData?.allLinkConstraints?.items?.length
      ? crudData?.allLinkConstraints?.items
      : [],
    headerData,
    handleEdit,
    handleDelete,
    handleAddNew,
    handlePagination,
    handleChangeLimit,
    totalItems: crudData?.allLinkConstraints?.total_items,
    totalPages: crudData?.allLinkConstraints?.total_pages,
    pageSize,
    page: crudData?.allLinkConstraints?.page,
    inpPlaceholder: 'Search Link Constraint',
  };

  return (
    <div>
      <AddNewModal
        size="lg"
        title={isAdminEditing ? 'Edit Link Constraint' : 'Add Link Constraint'}
        handleSubmit={handleAddLinkConstraint}
        handleReset={handleResetForm}
      >
        <div className="show-grid">
          <Form
            fluid
            ref={linkConstFormRef}
            onChange={setFormValue}
            onCheck={setFormError}
            formValue={formValue}
            model={model}
          >
            {formElements.map((value, index) => (
              <React.Fragment key={index}>
                <FlexboxGrid justify="space-between">
                  <FlexboxGrid.Item colspan={5}>
                    <SelectField
                      name={`source_resource_type_${value}`}
                      label="Resource Types"
                      placeholder="Select resource type"
                      accepter={CustomSelect}
                      apiURL={`${lmApiUrl}/application`}
                      error={formError.application_id}
                      reqText="Application Id is required"
                    />
                  </FlexboxGrid.Item>
                  <FlexboxGrid.Item colspan={5}>
                    <SelectField
                      name={`source_label_${value}`}
                      label="Incoming label"
                      placeholder="Select link type"
                      accepter={CustomSelect}
                      apiURL={`${lmApiUrl}/linkType`}
                      reqText="Link type is required"
                    />
                  </FlexboxGrid.Item>

                  <ConversionIcon
                    fontSize={'2em'}
                    color={'#3498FF'}
                    style={{ marginTop: '35px' }}
                  />

                  <FlexboxGrid.Item colspan={5}>
                    <SelectField
                      name={`target_resource_type_${value}`}
                      label="Outcoming label"
                      placeholder="Select link type"
                      accepter={CustomSelect}
                      apiURL={`${lmApiUrl}/linkType`}
                      reqText="Link type is required"
                    />
                  </FlexboxGrid.Item>
                  <FlexboxGrid.Item colspan={5}>
                    <SelectField
                      name={`target_resource_type_${value}`}
                      label="Resource Types"
                      placeholder="Select resource type"
                      accepter={CustomSelect}
                      apiURL={`${lmApiUrl}/application`}
                      error={formError.application_id}
                      reqText="Application Id is required"
                    />
                  </FlexboxGrid.Item>
                </FlexboxGrid>
              </React.Fragment>
            ))}
            <FlexboxGrid.Item style={{ margin: '30px 0' }} colspan={24}>
              <Button
                appearance="subtle"
                block
                size={'lg'}
                onClick={() => addExtraFormElements()}
              >
                <PlusRoundIcon fontSize={'2em'} color={'gray'} />
                <br />
              </Button>
            </FlexboxGrid.Item>
          </Form>
        </div>
      </AddNewModal>

      {isCrudLoading && <UseLoader />}
      {notificationType && notificationMessage && (
        <Notification
          type={notificationType}
          message={notificationMessage}
          setNotificationType={setNotificationType}
          setNotificationMessage={setNotificationMessage}
        />
      )}
      <AdminDataTable props={tableProps} />
    </div>
  );
};

export default LinkConstraint;
