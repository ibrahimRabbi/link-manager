import React from 'react';
import ProjectDetails from '../Projects/ProjectDetails/ProjectDetails.jsx';
import { useParams } from 'react-router-dom';
import UserPermissions from '../Projects/UserPermissions/UserPermissions.jsx';

const ResourceDetails = (props) => {
  const { id } = useParams();

  const { type } = props;

  const evaluateResourceType = (resourceType) => {
    if (resourceType === 'project') {
      return <ProjectDetails identifier={id} />;
    }
    if (resourceType === 'project-permissions') {
      return <UserPermissions identifier={id} />;
    }
  };

  return <div>{evaluateResourceType(type)}</div>;
};

export default ResourceDetails;
