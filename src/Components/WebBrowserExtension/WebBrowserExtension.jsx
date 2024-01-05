import React, { useEffect } from 'react';
import { handleCurrPageTitle } from '../../Redux/slices/navSlice';
import { useDispatch } from 'react-redux';
const wbeUrl = import.meta.env.VITE_GENERIC_WBE;

const WebBrowserExtension = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(handleCurrPageTitle('Link Manager Extension'));
  }, []);

  return (
    <div>
      <div>
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '50px' }}>
          <h5>
            To download generic web browser extension, please download by
            <a
              href={wbeUrl}
              target="_blank"
              rel="noreferrer"
              style={{ marginLeft: '2px' }}
            >
              click here
            </a>
            .
          </h5>
        </div>
      </div>
    </div>
  );
};

export default WebBrowserExtension;
