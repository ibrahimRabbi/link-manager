import React, { useContext, useEffect, useRef, useState } from 'react';
import {
  Button,
  Divider,
  FlexboxGrid,
  Form,
  IconButton,
  Message,
  Schema,
  toaster,
} from 'rsuite';
import { useMutation, useQuery } from '@tanstack/react-query';
import fetchAPIRequest from '../../../../apiRequests/apiRequest.js';
import AuthContext from '../../../../Store/Auth-Context.jsx';
import { useDispatch, useSelector } from 'react-redux';
import { handleCurrPageTitle } from '../../../../Redux/slices/navSlice.jsx';
import { FiUsers } from 'react-icons/fi';
import { formatDistanceToNow } from 'date-fns';
import styles from './ProjectDetails.module.scss';
import ProjectOptions from '../ProjectOptions/ProjectOptions.jsx';
import { useLocation, useNavigate } from 'react-router-dom';
import AlertModal from '../../../Shared/AlertModal.jsx';
import TextField from '../../TextField.jsx';
import TextArea from '../../TextArea.jsx';
import CustomReactSelect from '../../../Shared/Dropdowns/CustomReactSelect.jsx';
import SelectField from '../../SelectField.jsx';
import { FaCircleInfo } from 'react-icons/fa6';
import { GoProjectTemplate } from 'react-icons/go';
import { darkBgColor } from '../../../../App.jsx';

const lmApiUrl = import.meta.env.VITE_LM_REST_API_URL;
const { StringType, NumberType, ArrayType } = Schema.Types;

const model = Schema.Model({
  name: StringType().isRequired('This field is required.'),
  description: StringType(),
  organization_id: NumberType(),
  users: ArrayType(),
  applications: ArrayType(),
});

const ProjectDetails = (props) => {
  const { isDark } = useSelector((state) => state.nav);
  const location = useLocation();
  const navigate = useNavigate();
  const projectFormRef = useRef();

  const DELETION_ALERT_MESSAGE = 'Deleting a project cannot be undone.';

  const { identifier, newResource } = props;

  const {
    resourceButton,
    mainSection,
    summarySection,
    summarySectionEdit,
    descriptionSection,
    editButtonSection,
    detailsSection,
    detailsTitle,
    detailsTitleIcon,
    detailsSubTitle,
    editButton,
    detailsContent,
    detailsLabel,
    newProjectDescription,
  } = styles;
  const authCtx = useContext(AuthContext);
  const dispatch = useDispatch();
  const PROJECT_FORM = {
    name: '',
    description: '',
    organization_id: '',
    users: [],
    applications: [],
  };
  const [projectData, setProjectData] = useState({});
  const [editData, setEditData] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [newProject, setNewProject] = useState(newResource ? true : false);
  const [formValue, setFormValue] = useState(PROJECT_FORM);
  const [formError, setFormError] = useState({});

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

  const handleDeleteConfirmed = (value) => {
    if (value) {
      deleteMutate();
    }
  };

  const convertTime = (time) => {
    const dateTime = new Date(time);
    const relativeTime = formatDistanceToNow(dateTime, { addSuffix: true });
    return relativeTime;
  };

  const updateProject = () => {
    if (!projectFormRef.current.check()) {
      console.error('Form Error', formError);
      return;
    } else if (newProject) {
      createMutate();
    } else {
      updateMutate();
    }
  };

  const resetProjectData = () => {
    if (newProject) {
      const pathSegments = location.pathname.split('/');
      const newPathSegments = pathSegments.slice(0, -2).join('/');
      navigate(newPathSegments + '/projects');
    } else {
      setEditData(false);
    }
  };

  const { mutate: updateMutate } = useMutation(
    () =>
      fetchAPIRequest({
        urlPath: `${authCtx.organization_id}/project/${identifier}`,
        token: authCtx.token,
        method: 'PUT',
        body: formValue,
        showNotification: showNotification,
      }),
    {
      onSuccess: () => {
        setEditData(false);
        refetchSingleProject();
      },
    },
  );

  // create project using react query
  const { mutate: createMutate } = useMutation(
    () =>
      fetchAPIRequest({
        urlPath: `${authCtx.organization_id}/project`,
        token: authCtx.token,
        method: 'POST',
        body: formValue,
        showNotification: showNotification,
        responseHeaders: true,
      }),
    {
      onSuccess: (value) => {
        if (value?.status === 'success') {
          setNewProject(false);
          setEditData(false);
          const pathSegments = location.pathname.split('/');
          const newPathSegments = pathSegments.slice(0, -2).join('/');
          navigate(newPathSegments + '/project/' + value?.id);
        }
      },
    },
  );

  const { mutate: deleteMutate } = useMutation(
    () =>
      fetchAPIRequest({
        urlPath: `${authCtx.organization_id}/project/${identifier}`,
        token: authCtx.token,
        method: 'DELETE',
        showNotification: showNotification,
      }),
    {
      onSuccess: () => {
        setOpenDeleteModal(false);
        const pathSegments = location.pathname.split('/');
        const newPathSegments = pathSegments.slice(0, -2).join('/');
        navigate(newPathSegments + '/projects');
      },
    },
  );

  //prettier-ignore
  const {
    // eslint-disable-next-line no-unused-vars
    data: singleProject,
    refetch: refetchSingleProject,
  } = useQuery(
    ['project'],
    () =>
      newProject
        ? {
          ...PROJECT_FORM,
          organization_id: authCtx.organization_id,
        }
        : fetchAPIRequest({
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

  useEffect(() => {
    dispatch(handleCurrPageTitle(''));
  }, []);

  useEffect(() => {
    if (!newProject) {
      refetchSingleProject();
    }
  }, [newProject]);
  -useEffect(() => {
    if (newProject) {
      dispatch(handleCurrPageTitle('New project'));
    } else if (editData) {
      dispatch(handleCurrPageTitle('Edit project'));
    } else {
      dispatch(handleCurrPageTitle(''));
    }
  }, [editData, newProject]);

  useEffect(() => {
    const applicationsObtained = projectData?.applications?.reduce((accumulator, app) => {
      accumulator.push({
        ...app,
        label: app?.name,
        value: app?.id,
      });
      return accumulator;
    }, []);

    const newFormValue = {
      name: projectData.name,
      description: projectData.description,
      organization_id: projectData.organization_id,
      users: projectData.users,
      applications: applicationsObtained,
    };
    setFormValue(newFormValue);
  }, [projectData]);

  return (
    <FlexboxGrid>
      {(editData || newProject) && <FlexboxGrid.Item colspan={2}></FlexboxGrid.Item>}
      <FlexboxGrid.Item
        colspan={editData || newProject ? 20 : 18}
        className={mainSection}
      >
        {editData && (
          <p>Update the project details and click save to apply the changes.</p>
        )}
        {newProject && (
          <FlexboxGrid>
            <FlexboxGrid.Item colspan={2}>
              <GoProjectTemplate size={100} />
            </FlexboxGrid.Item>
            <FlexboxGrid.Item colspan={18}>
              <p className={newProjectDescription}>
                Create a blank project to group link nodes, plan your work, among other
                things.
              </p>
            </FlexboxGrid.Item>
          </FlexboxGrid>
        )}
        <FlexboxGrid className={editData ? summarySectionEdit : summarySection}>
          {editData || newProject ? (
            <Form
              fluid
              style={{ width: '100%' }}
              ref={projectFormRef}
              onChange={setFormValue}
              onCheck={setFormError}
              formValue={formValue}
              model={model}
            >
              <FlexboxGrid.Item colspan={23} style={{ margin: '25px 0' }}>
                <TextField name="name" label="Project name" reqText="Required" />
              </FlexboxGrid.Item>

              <FlexboxGrid.Item colspan={23}>
                <TextField
                  name="description"
                  label="Description"
                  accepter={TextArea}
                  rows={3}
                />
              </FlexboxGrid.Item>

              <FlexboxGrid.Item colspan={23} style={{ margin: '25px 0' }}>
                <SelectField
                  name="applications"
                  label="Application"
                  placeholder="Select Application"
                  accepter={CustomReactSelect}
                  apiURL={`${lmApiUrl}/${authCtx.organization_id}/application`}
                  error={formError.applications}
                  isMulti={true}
                />
              </FlexboxGrid.Item>
              {newProject && (
                <FlexboxGrid.Item colspan={23}>
                  <SelectField
                    name="users"
                    label="Assign users"
                    placeholder="Select Users"
                    accepter={CustomReactSelect}
                    apiURL={`${lmApiUrl}/user`}
                    error={formError.users}
                    isMulti={true}
                    closeMenuOnSelect={false}
                  />
                </FlexboxGrid.Item>
              )}
            </Form>
          ) : (
            <>
              <FlexboxGrid.Item colspan={15}>
                <h2>{projectData?.name ? projectData.name : 'Project info'}</h2>
              </FlexboxGrid.Item>
              <FlexboxGrid.Item colspan={5}></FlexboxGrid.Item>
              <FlexboxGrid>
                <FlexboxGrid.Item>
                  <IconButton
                    size="md"
                    title="Invite users"
                    icon={<FiUsers />}
                    onClick={() => {
                      const link = location.pathname;
                      navigate(`${link}/user-permissions`);
                    }}
                    className={resourceButton}
                  />
                </FlexboxGrid.Item>
                <FlexboxGrid.Item>
                  <ProjectOptions
                    handleEdit={() => setEditData(true)}
                    handleDelete={() => setOpenDeleteModal(true)}
                  />
                </FlexboxGrid.Item>
              </FlexboxGrid>
              <FlexboxGrid.Item colspan={23}>
                <Divider style={{ margin: '5px 0' }} />
              </FlexboxGrid.Item>
              <FlexboxGrid.Item colspan={23} className={descriptionSection}>
                <p>
                  {projectData?.description ? projectData.description : 'No description'}
                </p>
              </FlexboxGrid.Item>
            </>
          )}
        </FlexboxGrid>

        {(editData || newProject) && (
          <FlexboxGrid className={editButtonSection} colspan={20}>
            <FlexboxGrid.Item colspan={19}></FlexboxGrid.Item>
            <FlexboxGrid.Item colspan={2}>
              <Button
                appearance="primary"
                onClick={() => updateProject()}
                className={editButton}
              >
                Save
              </Button>
            </FlexboxGrid.Item>
            <FlexboxGrid.Item colspan={3}>
              <Button
                appearance="subtle"
                onClick={() => resetProjectData()}
                className={editButton}
              >
                Cancel
              </Button>
            </FlexboxGrid.Item>
          </FlexboxGrid>
        )}
      </FlexboxGrid.Item>
      {!editData && !newProject && (
        <FlexboxGrid.Item
          colspan={6}
          className={detailsSection}
          style={{ backgroundColor: isDark === 'dark' && darkBgColor }}
        >
          <FlexboxGrid className={detailsTitle} align="middle">
            <FlexboxGrid.Item colspan={2} className={detailsTitleIcon}>
              <FaCircleInfo />
            </FlexboxGrid.Item>
            <FlexboxGrid.Item colspan={15}>
              <h3>Project details</h3>
            </FlexboxGrid.Item>
          </FlexboxGrid>
          <Divider style={{ marginTop: '13px' }} />
          <div
            className={detailsContent}
            style={{ backgroundColor: isDark === 'dark' && darkBgColor }}
          >
            {projectData?.updated && (
              <>
                <p className={detailsSubTitle}>Last updated:</p>
                <p className={detailsLabel}>{convertTime(projectData.updated)}</p>
              </>
            )}
            {projectData?.created && (
              <>
                <p className={detailsSubTitle}>Created:</p>
                <p className={detailsLabel}>
                  Created: {convertTime(projectData.created)}
                </p>
              </>
            )}
            {projectData?.organization?.name && (
              <>
                <p className={detailsSubTitle}>Organization:</p>
                <p className={detailsLabel}>{projectData?.organization?.name}</p>
              </>
            )}
            {authCtx?.user?.role && (
              <>
                <p className={detailsSubTitle}>Access level:</p>
                <p className={detailsLabel}>{authCtx?.user?.role}</p>
              </>
            )}
          </div>
        </FlexboxGrid.Item>
      )}

      <AlertModal
        open={openDeleteModal}
        setOpen={setOpenDeleteModal}
        content={DELETION_ALERT_MESSAGE}
        handleConfirmed={handleDeleteConfirmed}
      />
    </FlexboxGrid>
  );
};

export default ProjectDetails;
