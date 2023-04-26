import {
  Button,
  ComboBox,
  ComposedModal,
  ModalBody,
  ModalHeader,
  ProgressBar,
  Stack,
  TextArea,
  TextInput,
  Theme,
} from '@carbon/react';
import React, { useState, useContext, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import Swal from 'sweetalert2';
import {
  fetchApplications,
  fetchCreateApp,
  fetchDeleteApp,
  fetchOrg,
  fetchUpdateApp,
} from '../../../Redux/slices/applicationSlice';
import AuthContext from '../../../Store/Auth-Context';
import UseTable from '../UseTable';
import styles from './Application.module.scss';

const { errText, formContainer, modalBtnCon, modalBody, mhContainer, flNameContainer } =
  styles;

const lmApiUrl = process.env.REACT_APP_LM_REST_API_URL;

// demo data
const headerData = [
  {
    header: 'ID',
    key: 'id',
  },
  {
    header: 'Application',
    key: 'name',
  },
  {
    header: 'Active',
    key: 'active',
  },
  {
    header: 'OSLC Domain',
    key: 'oslc_domain',
  },
  {
    header: 'URL',
    key: 'url',
  },
  {
    header: 'Description',
    key: 'description',
  },
];

const Application = () => {
  const {
    allApplications,
    organizationList,
    isAppLoading,
    isAppUpdated,
    isAppCreated,
    isAppDeleted,
  } = useSelector((state) => state.applications);
  const [isAddModal, setIsAddModal] = useState(false);
  const [appDescription, setAppDescription] = useState('');
  const [selectedItem, setSelectedItem] = useState({});
  const [filInput, setFilInput] = useState('');
  const [editData, setEditData] = useState({});
  const [currPage, setCurrPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const {
    handleSubmit,
    register,
    control,
    reset,
    formState: { errors },
  } = useForm({ defaultValues: { organization_id: {} } });
  const authCtx = useContext(AuthContext);
  const dispatch = useDispatch();

  // get organizations for create application
  useEffect(() => {
    dispatch(
      fetchOrg({
        url: `${lmApiUrl}/organization?page=${'1'}&per_page=${'50'}`,
        token: authCtx.token,
      }),
    );
  }, []);

  // handle open add user modal
  const handleAddNew = () => {
    setIsAddModal(true);
  };
  const addModalClose = () => {
    setEditData({});
    setAppDescription('');
    setIsAddModal(false);
    reset();
  };

  // create and edit application form submit
  const handleAddApplication = (data) => {
    setIsAddModal(false);
    // update application
    if (editData?.name) {
      data = {
        name: data?.name ? data?.name : editData?.name,
        url: data.url ? data.url : editData?.url,
        description: appDescription ? appDescription : editData?.description,
        oslc_domain: data.oslc_domain ? data.oslc_domain : editData?.oslc_domain,
        organization_id: selectedItem?.id ? selectedItem?.id : editData?.organization_id,
      };
      console.log('edit submit: ', data);
      const putUrl = `${lmApiUrl}/application/${editData?.id}`;
      dispatch(
        fetchUpdateApp({
          url: putUrl,
          token: authCtx.token,
          bodyData: data,
          reset,
        }),
      );
    }
    // Create application
    else {
      const appData = {
        name: data.name,
        url: data.url,
        description: appDescription,
        oslc_domain: data.oslc_domain,
        organization_id: selectedItem?.id,
      };
      console.log('app submit: ', appData);
      const postUrl = `${lmApiUrl}/application`;
      dispatch(
        fetchCreateApp({
          url: postUrl,
          token: authCtx.token,
          bodyData: appData,
          reset,
        }),
      );
    }
    setFilInput('');
    setSelectedItem({});
    // setOrgData({});
  };

  // Pagination
  const handlePagination = (values) => {
    setPageSize(values.pageSize);
    setCurrPage(values.page);
  };

  useEffect(() => {
    const getUrl = `${lmApiUrl}/application?page=${currPage}&per_page=${pageSize}`;
    dispatch(fetchApplications({ url: getUrl, token: authCtx.token }));
  }, [isAppCreated, isAppUpdated, isAppDeleted, pageSize, currPage]);

  // handle delete application
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
          const deleteUrl = `${lmApiUrl}/application/${id}`;
          dispatch(fetchDeleteApp({ url: deleteUrl, token: authCtx.token }));
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
  // handle Edit application
  const handleEdit = (data) => {
    if (data.length === 1) {
      setIsAddModal(true);
      const data1 = data[0];
      setEditData(data1);
    } else if (data.length > 1) {
      Swal.fire({
        title: 'Sorry!!',
        icon: 'info',
        text: 'You can not edit more than 1 application at the same time',
      });
    }
  };

  // send props in the batch action table
  const tableProps = {
    title: 'Applications',
    rowData: allApplications?.items?.length ? allApplications?.items : [],
    headerData,
    handleEdit,
    handleDelete,
    handleAddNew,
    handlePagination,
    totalItems: allApplications?.total_items,
    totalPages: allApplications?.total_pages,
    pageSize,
    page: allApplications?.page,
    inpPlaceholder: 'Search Application',
  };

  const handleScroll = (e) => {
    console.log(e.target);
  };

  return (
    <div>
      {/* -- add application Modal -- */}
      <Theme theme="g10">
        <ComposedModal open={isAddModal} onClose={addModalClose}>
          <div className={mhContainer}>
            <h4>{editData?.name ? 'Edit Application' : 'Add New Application'}</h4>
            <ModalHeader onClick={addModalClose} />
          </div>

          <ModalBody id={modalBody} onScroll={(e) => handleScroll(e)}>
            <form
              onSubmit={handleSubmit(handleAddApplication)}
              className={formContainer}
              onScroll={(e) => handleScroll(e)}
            >
              <Stack gap={7}>
                {/* Application name  */}
                <div className={flNameContainer}>
                  <div>
                    <TextInput
                      defaultValue={editData?.name}
                      type="text"
                      id="application_name"
                      labelText="Application Name"
                      placeholder="Please enter application name"
                      {...register('name', { required: editData?.name ? false : true })}
                    />
                    <p className={errText}>{errors.name && 'Invalid Name'}</p>
                  </div>

                  {/* application URL  */}
                  <div>
                    <TextInput
                      defaultValue={editData?.url}
                      type="text"
                      id="application_url"
                      labelText="Application Url"
                      placeholder="Please enter Application Url"
                      {...register('url', { required: editData?.url ? false : true })}
                    />
                    <p className={errText}>{errors.url && 'Invalid url'}</p>
                  </div>
                </div>

                {/* Oslc domain  */}
                <div>
                  <TextInput
                    defaultValue={editData?.oslc_domain}
                    type="text"
                    id="organization_id"
                    labelText="OSLC Domain"
                    placeholder="Please enter OSLC domain"
                    {...register('oslc_domain', {
                      required: editData?.oslc_domain ? false : true,
                    })}
                  />
                  <p className={errText}>{errors.oslc_domain && 'Invalid Domain'}</p>
                </div>

                {/* --- Select organization ---  */}
                <div>
                  <Controller
                    name="select"
                    control={control}
                    render={({ field }) => (
                      <ComboBox
                        onScroll={(e) => handleScroll(e)}
                        {...field}
                        {...register('select', {
                          required: editData?.organization_id ? false : true,
                        })}
                        downshiftProps={selectedItem}
                        placeholder="Please search or select organization"
                        value={filInput}
                        id="organization_id_dropdown"
                        items={organizationList?.items ? organizationList?.items : []}
                        label="Combo box menu options"
                        titleText="Organization"
                        onInputChange={(e) => setFilInput(e)}
                        onChange={(v) => setSelectedItem(v.selectedItem)}
                        itemToString={(item) => (item ? item?.name : '')}
                        itemToElement={(item) => (item ? <p>{item?.name}</p> : '')}
                      />
                    )}
                  />
                  <p className={errText}>{errors.select && 'Invalid organization'}</p>
                </div>

                {/* Description  */}
                <div>
                  <TextArea
                    defaultValue={editData?.description}
                    id="application_description"
                    required={editData?.description ? false : true}
                    onChange={(e) => setAppDescription(e.target.value)}
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
      </Theme>

      {isAppLoading && <ProgressBar label="" />}
      <UseTable props={tableProps} />
    </div>
  );
};

export default Application;
