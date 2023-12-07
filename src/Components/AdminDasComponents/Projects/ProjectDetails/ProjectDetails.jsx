import React, { useContext, useEffect, useState } from 'react';
import { Divider, FlexboxGrid, IconButton, Message, toaster } from 'rsuite';
import { useQuery } from '@tanstack/react-query';
import fetchAPIRequest from '../../../../apiRequests/apiRequest.js';
import AuthContext from '../../../../Store/Auth-Context.jsx';
import { useDispatch } from 'react-redux';
import { handleCurrPageTitle } from '../../../../Redux/slices/navSlice.jsx';
import { FiUsers } from 'react-icons/fi';
import { formatDistanceToNow } from 'date-fns';
import styles from './ProjectDetails.module.scss';

const ProjectDetails = (props) => {
  const { identifier } = props;
  const {
    resourceButton,
    mainSection,
    summarySection,
    subtitles,
    detailsSection,
    detailsTitle,
  } = styles;
  const authCtx = useContext(AuthContext);
  const dispatch = useDispatch();

  const [projectData, setProjectData] = useState({});

  console.log('authCtx', authCtx);
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

  console.log('identifier', identifier);
  const {
    // eslint-disable-next-line no-unused-vars
    data: singleProject,
  } = useQuery(
    ['project'],
    () =>
      fetchAPIRequest({
        // eslint-disable-next-line max-len
        urlPath: `${authCtx.organization_id}/project/${identifier}`,
        token: authCtx.token,
        method: 'GET',
        showNotification: showNotification,
      }),
    {
      onSuccess: (singleProject) => {
        setProjectData(singleProject);
      },
    },
  );

  // const { refreshData, isAdminEditing } = useSelector((state) => state.nav);
  // const [currPage, setCurrPage] = useState(1);
  // const [pageSize, setPageSize] = useState(10);
  // const [formError, setFormError] = useState({});
  // const [editData, setEditData] = useState({});
  // const [deleteData, setDeleteData] = useState({});
  // const authCtx = useContext(AuthContext);
  // const dispatch = useDispatch();
  // const userInfo = jwt_decode(authCtx?.token);
  // const projectFormRef = useRef();
  // const [formValue, setFormValue] = useState({
  //     name: '',
  //     description: '',
  //     organization_id: '',
  //     users: [],
  // });
  // const [open, setOpen] = useState(false);
  // const showNotification = (type, message) => {
  //     if (type && message) {
  //         const messages = (
  //             <Message closable showIcon type={type}>
  //                 {message}
  //             </Message>
  //         );
  //         toaster.push(messages, { placement: 'bottomCenter', duration: 5000 });
  //     }
  // };
  //
  // // get projects using react-query
  // const {
  //     data: allProjects,
  //     isLoading,
  //     refetch: refetchProjects,
  // } = useQuery(
  //     ['project'],
  //     () =>
  //         fetchAPIRequest({
  //             // eslint-disable-next-line max-len
  //urlPath: `${authCtx.organization_id}/project?page=${currPage}&per_page=${pageSize}`,
  //             token: authCtx.token,
  //             method: 'GET',
  //             showNotification: showNotification,
  //         }),
  //     {
  //         onSuccess: (allProjects) => {
  //             for (let i = 0; i < allProjects.items.length; i++) {
  //                 allProjects.items[i]['organization_name'] =
  //                     allProjects.items[i].organization.name;
  //             }
  //         },
  //     },
  // );
  //
  // // create project using react query
  // const {
  //     isLoading: createLoading,
  //     isSuccess: createSuccess,
  //     mutate: createMutate,
  // } = useMutation(
  //     () =>
  //         fetchAPIRequest({
  //             urlPath: `${authCtx.organization_id}/project`,
  //             token: authCtx.token,
  //             method: 'POST',
  //             body: formValue,
  //             showNotification: showNotification,
  //         }),
  //     {
  //         onSuccess: (value) => {
  //             if (value?.message) {
  //                 Mixpanel.track('Project created success.', {
  //                     username: userInfo?.preferred_username,
  //                 });
  //             } else {
  //                 Mixpanel.track('Project created failed.', {
  //                     username: userInfo?.preferred_username,
  //                 });
  //             }
  //             showNotification(value?.status, value?.message);
  //         },
  //     },
  // );
  //
  // // update project using react query
  // const {
  //     isLoading: updateLoading,
  //     isSuccess: updateSuccess,
  //     mutate: updateMutate,
  // } = useMutation(
  //     () =>
  //         fetchAPIRequest({
  //             urlPath: `${authCtx.organization_id}/project/${editData?.id}`,
  //             token: authCtx.token,
  //             method: 'PUT',
  //             body: formValue,
  //             showNotification: showNotification,
  //         }),
  //     {
  //         onSuccess: (value) => {
  //             if (value?.message) {
  //                 Mixpanel.track('Project updated success', {
  //                     username: userInfo?.preferred_username,
  //                 });
  //             } else {
  //                 Mixpanel.track('Project updated failed', {
  //                     username: userInfo?.preferred_username,
  //                 });
  //             }
  //             showNotification(value?.status, value?.message);
  //         },
  //     },
  // );
  //
  // // Delete project using react query
  // const {
  //     isLoading: deleteLoading,
  //     isSuccess: deleteSuccess,
  //     mutate: deleteMutate,
  // } = useMutation(
  //     () =>
  //         fetchAPIRequest({
  //             urlPath: `${authCtx.organization_id}/project/${deleteData?.id}`,
  //             token: authCtx.token,
  //             method: 'DELETE',
  //             showNotification: showNotification,
  //         }),
  //     {
  //         onSuccess: (value) => {
  //             if (value?.message) {
  //                 Mixpanel.track('Project deleted success.', {
  //                     username: userInfo?.preferred_username,
  //                 });
  //             } else {
  //                 Mixpanel.track('Project deleted failed.', {
  //                     username: userInfo?.preferred_username,
  //                 });
  //             }
  //             showNotification(value?.status, value?.message);
  //         },
  //     },
  // );
  //
  // // Pagination
  // const handlePagination = (value) => {
  //     setCurrPage(value);
  // };
  //
  // const handleChangeLimit = (dataKey) => {
  //     setCurrPage(1);
  //     setPageSize(dataKey);
  // };
  //
  // const handleAddProject = () => {
  //     if (!projectFormRef.current.check()) {
  //         console.error('Form Error', formError);
  //         return;
  //     } else if (isAdminEditing) {
  //         updateMutate();
  //     } else {
  //         createMutate();
  //     }
  //
  //     dispatch(handleIsAddNewModal(false));
  //     if (isAdminEditing) dispatch(handleIsAdminEditing(false));
  // };
  //
  // // reset form
  // const handleResetForm = () => {
  //     setTimeout(() => {
  //         setEditData({});
  //         setFormValue({
  //             name: '',
  //             description: '',
  //             organization_id: '',
  //             users: [],
  //         });
  //     }, 500);
  // };
  //
  // // get all projects
  // useEffect(() => {
  //     dispatch(handleCurrPageTitle('Projects'));
  //
  //     refetchProjects();
  // }, [createSuccess, updateSuccess, deleteSuccess, pageSize, currPage, refreshData]);
  //
  // // handle open add user modal
  // const handleAddNew = () => {
  //     handleResetForm();
  //     dispatch(handleIsAddNewModal(true));
  // };
  //
  // // handle delete project
  // const handleDelete = (data) => {
  //     setDeleteData(data);
  //     setOpen(true);
  // };
  // const handleConfirmed = (value) => {
  //     if (value) {
  //         deleteMutate();
  //     }
  // };
  //
  // // handle Edit project
  // const handleEdit = async (data) => {
  //     setEditData(data);
  //     dispatch(handleIsAdminEditing(true));
  //     // map user data to display in the dropdown
  //     const mappedUserList = data?.users?.reduce((accumulator, user) => {
  //         accumulator.push({
  //             ...user,
  //             label: user?.email,
  //             value: user?.id,
  //         });
  //         return accumulator;
  //     }, []);
  //
  //     setFormValue({
  //         name: data?.name,
  //         description: data?.description,
  //         organization_id: data?.organization_id,
  //         users: mappedUserList,
  //     });
  //
  //     dispatch(handleIsAddNewModal(true));
  // };
  //
  // // send props in the batch action table
  // const tableProps = {
  //     title: 'Projects',
  //     rowData: allProjects ? allProjects?.items : [],
  //     headerData,
  //     handleEdit,
  //     handleDelete,
  //     handleAddNew,
  //     handlePagination,
  //     handleChangeLimit,
  //     totalItems: allProjects?.total_items,
  //     totalPages: allProjects?.total_pages,
  //     pageSize,
  //     page: allProjects?.page,
  //     inpPlaceholder: 'Search Project',
  // };

  const convertTime = (time) => {
    const dateTime = new Date(time);
    const relativeTime = formatDistanceToNow(dateTime, { addSuffix: true });
    return relativeTime;
  };

  useEffect(() => {
    dispatch(handleCurrPageTitle(''));
  }, []);

  return (
    <FlexboxGrid>
      <FlexboxGrid.Item colspan={18} className={mainSection}>
        <FlexboxGrid className={summarySection}>
          <FlexboxGrid.Item colspan={22}>
            <h2>{projectData?.name ? projectData.name : 'Project info'}</h2>
          </FlexboxGrid.Item>
          <FlexboxGrid.Item colspan={2}>
            <IconButton
              size="md"
              title="Invite users"
              icon={<FiUsers />}
              className={resourceButton}
            />
          </FlexboxGrid.Item>
        </FlexboxGrid>

        <p> {projectData?.description ? projectData.description : ''} </p>

        <h5 className={subtitles}>Integrations:</h5>

        <p>Add integration icons here</p>

        <h5 className={subtitles}>Users:</h5>

        <p>Add integration icons here</p>
      </FlexboxGrid.Item>
      <FlexboxGrid.Item colspan={6} className={detailsSection}>
        <h3 className={detailsTitle}>Project details</h3>
        <Divider />
        <div className={styles.detailsContent}>
          {projectData?.updated && (
            <p className={styles.detailsLabel}>
              Last updated: {convertTime(projectData.updated)}
            </p>
          )}
          {projectData?.created && (
            <p className={styles.detailsLabel}>
              Created: {convertTime(projectData.created)}
            </p>
          )}
          {projectData?.organization?.name && (
            <p className={styles.detailsLabel}>
              Organization: {projectData?.organization?.name}
            </p>
          )}
          {authCtx?.user?.role && (
            <p className={styles.detailsLabel}>Access level: {authCtx?.user?.role}</p>
          )}
        </div>
      </FlexboxGrid.Item>
    </FlexboxGrid>
  );
};

export default ProjectDetails;
