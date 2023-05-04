import React, { useEffect } from 'react';

import SourceSection from '../SourceSection.jsx';
import { useLocation } from 'react-router-dom';

const Oauth2Success = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const param1 = searchParams.get('jwt');
  console.log('Access token:', param1);

  useEffect(() => {
    if (param1) {
      localStorage.setItem('consumerToken', param1);
    }
  }, [param1]);

  return (
    <>
      {/* <WbeTopNav /> */}
      <SourceSection />

      <div className="mainContainer">
        <div className="container">
          <h1>User logged in successfully</h1>
        </div>
      </div>
    </>
  );
};

export default Oauth2Success;
