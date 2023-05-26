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
      const message = 'consumer-token-data:' + param1;
      window.parent.postMessage(message, '*');
    }
  }, [param1]);

  return (
    <>
      {/* <WbeTopNav /> */}
      <SourceSection />

      <div className="mainContainer">
        <div className="container">
          <h2>User logged in successfully</h2>
        </div>
      </div>
    </>
  );
};

export default Oauth2Success;
