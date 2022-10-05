import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import NewLink from '../NewLink/NewLink';

const EditLink = () => {
  const navigate=useNavigate();
  const {editLinkData, targetDataArr}=useSelector(state=>state.links);
  console.log(targetDataArr);
  
  if(!editLinkData?.id) {
    navigate('/');
  }
  return (
    <NewLink props={{...editLinkData, pageTitle:'Edit link'}}/>
  );
};

export default EditLink;