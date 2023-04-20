import React, { useState, useContext, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Swal from 'sweetalert2';
import AuthContext from '../../../Store/Auth-Context';
import { handleCurrPageTitle, handleIsAddNewModal } from '../../../Redux/slices/navSlice';
import { FlexboxGrid, Form, Loader, Schema } from 'rsuite';
import AdminDataTable from '../AdminDataTable';
import AddNewModal from '../AddNewModal';
import TextField from '../TextField';
import { useRef } from 'react';
import SelectField from '../SelectField';
import {
  fetchDeleteLinkCons,
  fetchLinkConstraints,
} from '../../../Redux/slices/linkConstraintSlice';
import {
  fetchApplicationList,
  fetchLinkTypes,
} from '../../../Redux/slices/linkTypeSlice';
import CustomSelect from '../CustomSelect';

// import styles from './LinkConstraint.module.scss';
// const { errText, formContainer, modalBtnCon,
//  modalBody, mhContainer, flNameContainer } =styles;

const lmApiUrl = process.env.REACT_APP_LM_REST_API_URL;

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
    header: 'Source Url',
    key: 'source_url',
  },
  {
    header: 'Target Url',
    key: 'target_url',
  },
  {
    header: 'Description',
    key: 'description',
  },
];

const { StringType, NumberType } = Schema.Types;

const model = Schema.Model({
  name: StringType().isRequired('This field is required.'),
  source_url: StringType().isRequired('This field is required.'),
  target_url: StringType().isRequired('This field is required.'),
  application_id: NumberType().isRequired('This field is required.'),
  link_type_id: NumberType().isRequired('This field is required.'),
  description: StringType().isRequired('This field is required.'),
});

const LinkConstraint = () => {
  const {
    allLinkConstraints,
    isLinkConsLoading,
    isLinkConsUpdated,
    isLinkConsCreated,
    isLinkConsDeleted,
  } = useSelector((state) => state.linkConstraints);
  const { applicationList, allLinkTypes } = useSelector((state) => state.linkTypes);
  const [currPage, setCurrPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [formError, setFormError] = useState({});
  const [formValue, setFormValue] = useState({
    name: '',
    source_url: '',
    target_url: '',
    application_id: '',
    link_type_id: '',
    description: '',
  });

  const linkConstFormRef = useRef();
  const authCtx = useContext(AuthContext);
  const dispatch = useDispatch();

  // handle open add user modal
  const handleAddNew = () => {
    dispatch(handleIsAddNewModal(true));
  };

  const handleAddLinkConstraint = () => {
    if (!linkConstFormRef.current.check()) {
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

  // create and edit link cons form submit
  // const handleAddLinkCons = (data) => {
  //   // update link cons
  //   if (editData?.name) {
  //     console.log(data);
  //     data = {
  //       name: data?.name ? data?.name : editData?.name,
  //       source_url: data.source_url ? data.source_url : editData?.source_url,
  //       target_url: data.target_url ? data.target_url : editData?.target_url,
  //       link_type_id: data?.link_type_id ? data?.link_type_id : editData?.link_type_id,
  //       application_id: data?.application_id
  //         ? data?.application_id
  //         : editData?.application_id,
  //       description: linkConsDesc ? linkConsDesc : editData?.description,
  //     };
  //     const putUrl = `${lmApiUrl}/link-constraint/${editData?.id}`;
  //     dispatch(
  //       fetchUpdateApp({
  //         url: putUrl,
  //         token: authCtx.token,
  //         bodyData: data,
  //         reset,
  //       }),
  //     );
  //   }
  //   // Create LinkConstraint
  //   else {
  //     data.description = linkConsDesc;
  //     console.log(data);
  //     const postUrl = `${lmApiUrl}/link-constraint`;
  //     dispatch(
  //       fetchCreateApp({
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

  // fetch application list for create link constraint
  useEffect(() => {
    // get application list
    dispatch(
      fetchApplicationList({
        url: `${lmApiUrl}/application?page=${'1'}&per_page=${'100'}`,
        token: authCtx.token,
      }),
    );
    // get link type list
    dispatch(
      fetchLinkTypes({
        url: `${lmApiUrl}/link-type?page=${'1'}&per_page=${'100'}`,
        token: authCtx.token,
      }),
    );
  }, []);

  useEffect(() => {
    dispatch(handleCurrPageTitle('Link Constraint'));

    const getUrl = `${lmApiUrl}/link-constraint?page=${currPage}&per_page=${pageSize}`;
    dispatch(fetchLinkConstraints({ url: getUrl, token: authCtx.token }));
  }, [isLinkConsCreated, isLinkConsUpdated, isLinkConsDeleted, pageSize, currPage]);

  // handle delete LinkConstraint
  const handleDelete = (data) => {
    // const idList = data?.map((v) => v.id);
    if (data.length === 1) {
      const id = data[0]?.id;
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
          const deleteUrl = `${lmApiUrl}/link-constraint/${id}`;
          dispatch(fetchDeleteLinkCons({ url: deleteUrl, token: authCtx.token }));
        }
      });
    } else if (data.length > 1) {
      Swal.fire({
        title: 'Sorry',
        icon: 'info',
        text: 'You can not delete multiple link constraint at the same time!!',
        confirmButtonColor: '#3085d6',
      });
    }
  };
  // handle Edit LinkConstraint
  const handleEdit = () => {
    // if (data.length === 1) {
    //   setIsAddModal(true);
    //   const data1 = data[0];
    //   setEditData(data1);
    // } else if (data.length > 1) {
    //   Swal.fire({
    //     title: 'Sorry!!',
    //     icon: 'info',
    //     text: 'You can not edit more than 1 link constraint at the same time',
    //   });
    // }
  };

  // send props in the batch action table
  const tableProps = {
    title: 'Link Constraint',
    rowData: allLinkConstraints?.items?.length ? allLinkConstraints?.items : [],
    headerData,
    handleEdit,
    handleDelete,
    handleAddNew,
    handlePagination,
    totalItems: allLinkConstraints?.total_items,
    totalPages: allLinkConstraints?.total_pages,
    pageSize,
    page: allLinkConstraints?.page,
    inpPlaceholder: 'Search Link Constraint',
  };

  return (
    <div>
      <AddNewModal title="Add New Link Constraint" handleSubmit={handleAddLinkConstraint}>
        <div className="show-grid">
          <Form
            fluid
            ref={linkConstFormRef}
            onChange={setFormValue}
            onCheck={setFormError}
            formValue={formValue}
            model={model}
          >
            <FlexboxGrid justify="space-between">
              <FlexboxGrid.Item colspan={11}>
                <TextField name="source_url" label="Source URL" />
              </FlexboxGrid.Item>

              <FlexboxGrid.Item colspan={11}>
                <TextField name="target_url" label="Target URL" />
              </FlexboxGrid.Item>

              <FlexboxGrid.Item style={{ margin: '30px 0' }} colspan={24}>
                <TextField name="name" label="Link Constraint Name" />
              </FlexboxGrid.Item>

              <FlexboxGrid.Item colspan={24}>
                <SelectField
                  placeholder="Select application id"
                  name="application_id"
                  label="Application ID"
                  accepter={CustomSelect}
                  options={applicationList?.items ? applicationList?.items : []}
                  error={formError.organization_id}
                />
              </FlexboxGrid.Item>

              <FlexboxGrid.Item style={{ margin: '30px 0' }} colspan={24}>
                <SelectField
                  placeholder="Select link type id"
                  name="link_type_id"
                  label="Link Type ID"
                  accepter={CustomSelect}
                  options={allLinkTypes?.items ? allLinkTypes?.items : []}
                  error={formError.organization_id}
                />
              </FlexboxGrid.Item>

              <FlexboxGrid.Item colspan={24} style={{ marginBottom: '30px' }}>
                <TextField name="description" label="Description" />
              </FlexboxGrid.Item>
            </FlexboxGrid>
          </Form>
        </div>
      </AddNewModal>

      {/* -- add LinkConstraint Modal -- */}
      {/* <Theme theme="g10">
        <ComposedModal open={isAddModal} onClose={addModalClose}>
          <div className={mhContainer}>
            <h4>{editData?.name ? 'Edit link constraint' : 'Add New link constraint'}</h4>
            <ModalHeader onClick={addModalClose} />
          </div>

          <ModalBody id={modalBody}>
            <form onSubmit={handleSubmit(handleAddLinkCons)} className={formContainer}>
              <Stack gap={7}>
                <div>
                  <TextInput
                    defaultValue={editData?.name}
                    type="text"
                    id="link-constraint_name"
                    labelText="Link Constraint Name"
                    placeholder="Please enter link constraint name"
                    {...register('name', { required: editData?.name ? false : true })}
                  />
                  <p className={errText}>{errors.name && 'Invalid Name'}</p>
                </div>

                <div className={flNameContainer}>
                  <div>
                    <TextInput
                      defaultValue={editData?.application_id}
                      type="number"
                      id="link-constraint_application_id"
                      labelText="Application Id"
                      placeholder="Please enter link application id"
                      {...register('application_id', {
                        required: editData?.application_id ? false : true,
                      })}
                    />
                    <p className={errText}>
                      {errors.application_id && 'Invalid application id'}
                    </p>
                  </div>

                  <div>
                    <TextInput
                      defaultValue={editData?.link_type_id}
                      type="number"
                      id="link_cons_link_type_id"
                      labelText="Link Type Id"
                      placeholder="Please enter link type id"
                      {...register('link_type_id', {
                        required: editData?.link_type_id ? false : true,
                      })}
                    />
                    <p className={errText}>{errors.url && 'Invalid link type id'}</p>
                  </div>
                </div>

                <div className={flNameContainer}>
                  <div>
                    <TextInput
                      defaultValue={editData?.source_url}
                      type="text"
                      id="link-constraint_source_url"
                      labelText="Source Url"
                      placeholder="Please enter link source url"
                      {...register('source_url', {
                        required: editData?.source_url ? false : true,
                      })}
                    />
                    <p className={errText}>{errors.source_url && 'Invalid source url'}</p>
                  </div>

                  <div>
                    <TextInput
                      defaultValue={editData?.target_url}
                      type="text"
                      id="link_cons_target_url"
                      labelText="Target Url"
                      placeholder="Please enter target url"
                      {...register('target_url', {
                        required: editData?.target_url ? false : true,
                      })}
                    />
                    <p className={errText}>
                      {errors.target_url && 'Invalid link type id'}
                    </p>
                  </div>
                </div>

                <div>
                  <TextArea
                    defaultValue={editData?.description}
                    id="linkCons_description"
                    required={editData?.description ? false : true}
                    onChange={(e) => setLinkConsDesc(e.target.value)}
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
      </Theme> */}

      {isLinkConsLoading && (
        <FlexboxGrid justify="center">
          <Loader size="md" label="" />
        </FlexboxGrid>
      )}
      <AdminDataTable props={tableProps} />
    </div>
  );
};

export default LinkConstraint;
