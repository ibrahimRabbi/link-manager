import React, { useEffect } from 'react';

import SourceSection from '../SourceSection.jsx';
import { useLocation } from 'react-router-dom';

const Oauth2Success = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const jsonData = {
    consumer: searchParams.get('consumer'),
    consumerStatus: searchParams.get('status'),
  };
  const param1 = JSON.stringify(jsonData);

  useEffect(() => {
    if (param1) {
      const message = 'consumer-token-info:' + param1;
      window.parent.postMessage(message, '*');
    }
  }, [param1]);

  return (
    <>
      {/* <WbeTopNav /> */}
      <SourceSection />

      <div className="mainContainer">
        <div className="container">
          <h2>Consumer info:</h2>
          <h3 style={{ marginBottom: '10px' }}>consumer: </h3>
          <p>{jsonData.consumer}</p>
          <h3 style={{ marginBottom: '10px' }}>status: </h3>
          {jsonData.consumerStatus === 'success' ? (
            <p style={{ color: 'green' }}>{jsonData.consumerStatus}</p>
          ) : (
            <p style={{ color: 'red' }}>{jsonData.consumerStatus}</p>
          )}
        </div>
      </div>
    </>
  );
};

export default Oauth2Success;
