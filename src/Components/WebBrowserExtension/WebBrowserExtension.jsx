import React, { useEffect } from 'react';
import { handleCurrPageTitle } from '../../Redux/slices/navSlice';
import { useDispatch } from 'react-redux';

const WebBrowserExtension = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(handleCurrPageTitle('Link Manager Extension'));
  }, []);

  return <div></div>;
};

export default WebBrowserExtension;
