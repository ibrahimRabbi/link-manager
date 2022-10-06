import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import NewLink from '../NewLink/NewLink';

const EditLink = () => {
  const navigate=useNavigate();
  const {editLinkData}=useSelector(state=>state.links);
  if(!editLinkData?.id)  navigate('/');
  
  return (
    <NewLink props={{...editLinkData, pageTitle:'Edit link'}}/>
  );
};

export default EditLink;