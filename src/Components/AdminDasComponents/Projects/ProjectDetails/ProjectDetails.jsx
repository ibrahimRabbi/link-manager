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
import { useDispatch } from 'react-redux';
import { handleCurrPageTitle } from '../../../../Redux/slices/navSlice.jsx';
import { FiUsers } from 'react-icons/fi';
import { formatDistanceToNow } from 'date-fns';
import styles from './ProjectDetails.module.scss';
import ProjectOptions from '../ProjectOptions/ProjectOptions.jsx';
import { useLocation, useNavigate } from 'react-router-dom';
import AlertModal from '../../../Shared/AlertModal.jsx';
import TextField from '../../TextField.jsx';
import TextArea from '../../TextArea.jsx';

const { StringType, NumberType, ArrayType } = Schema.Types;

const model = Schema.Model({
  name: StringType().isRequired('This field is required.'),
  description: StringType(),
  organization_id: NumberType(),
  users: ArrayType(),
});

const ProjectDetails = (props) => {
  const location = useLocation();
  const navigate = useNavigate();
  const projectFormRef = useRef();

  const DELETION_ALERT_MESSAGE = 'Deleting a project cannot be undone.';

  const { identifier } = props;
  const {
    resourceButton,
    mainSection,
    summarySection,
    summarySectionEdit,
    descriptionSection,
    editButtonSection,
    detailsSection,
    detailsTitle,
    detailsSubTitle,
    editButton,
    detailsContent,
    detailsLabel,
  } = styles;
  const authCtx = useContext(AuthContext);
  const dispatch = useDispatch();

  const [projectData, setProjectData] = useState({});
  const [editData, setEditData] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);

  const [formValue, setFormValue] = useState({
    name: '',
    description: '',
    organization_id: '',
    users: [],
  });
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
    } else {
      updateMutate();
    }
  };

  const resetProjectData = () => {
    setEditData(false);
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

  const {
    // eslint-disable-next-line no-unused-vars
    data: singleProject,
    refetch: refetchSingleProject,
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

  useEffect(() => {
    dispatch(handleCurrPageTitle(''));
  }, []);

  useEffect(() => {
    if (editData) {
      dispatch(handleCurrPageTitle('Edit project'));
    } else {
      dispatch(handleCurrPageTitle(''));
    }
  }, [editData]);

  useEffect(() => {
    const newFormValue = {
      name: projectData.name,
      description: projectData.description,
      organization_id: projectData.organization_id,
      users: projectData.users,
    };
    setFormValue(newFormValue);
  }, [projectData]);

  return (
    <FlexboxGrid>
      <FlexboxGrid.Item colspan={18} className={mainSection}>
        <FlexboxGrid className={editData ? summarySectionEdit : summarySection}>
          {editData ? (
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
            </Form>
          ) : (
            <>
              <FlexboxGrid.Item colspan={15}>
                <h2>{projectData?.name ? projectData.name : 'Project info'}</h2>
              </FlexboxGrid.Item>
              <FlexboxGrid.Item colspan={6}></FlexboxGrid.Item>
              <FlexboxGrid.Item colspan={2}>
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
                <ProjectOptions
                  handleEdit={() => setEditData(!editData)}
                  handleDelete={() => setOpenDeleteModal(true)}
                />
              </FlexboxGrid.Item>
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

        {editData && (
          <FlexboxGrid className={editButtonSection} colspan={23}>
            <FlexboxGrid.Item colspan={19}></FlexboxGrid.Item>
            <FlexboxGrid.Item colspan={5}>
              <Button
                appearance="primary"
                onClick={() => updateProject()}
                className={editButton}
              >
                Save
              </Button>
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

      <FlexboxGrid.Item colspan={6} className={detailsSection}>
        <h3 className={detailsTitle}>Project details</h3>
        <Divider />
        <div className={detailsContent}>
          {projectData?.updated && (
            <>
              <p className={detailsSubTitle}>Last updated:</p>
              <p className={detailsLabel}>{convertTime(projectData.updated)}</p>
            </>
          )}
          {projectData?.created && (
            <>
              <p className={detailsSubTitle}>Created:</p>
              <p className={detailsLabel}>Created: {convertTime(projectData.created)}</p>
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
