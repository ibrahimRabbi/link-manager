import React from 'react';
import ProjectDetails from '../Projects/ProjectDetails/ProjectDetails.jsx';
import { useParams } from 'react-router-dom';

const ResourceDetails = (props) => {
  const { id } = useParams();

  const { type } = props;

  return <div>{type === 'project' && <ProjectDetails identifier={id} />}</div>;
};

export default ResourceDetails;
