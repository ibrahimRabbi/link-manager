import React, { useContext, useEffect, useState } from 'react';
import ReactGraph from 'react-graph';
import AuthContext from '../../Store/Auth-Context.jsx';
import { useDispatch } from 'react-redux';
import { handleCurrPageTitle } from '../../Redux/slices/navSlice';

const apiURL = `${process.env.REACT_APP_LM_REST_API_URL}/link/visualize`;
const GraphView = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [data, setData] = useState(null);

  const authCtx = useContext(AuthContext);

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(handleCurrPageTitle('Graph view'));
  }, []);

  useEffect(() => {
    fetch(apiURL, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
        authorization: 'Bearer ' + authCtx.token,
      },
      body: JSON.stringify({
        start_node: 'README.md',
        end_node:
          // eslint-disable-next-line max-len
          'https://jira-oslc-api-dev.koneksys.com/oslc/provider/CDID/resources/tasks/CDID-20',
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        setData(data.data);
      })
      .finally(() => {
        setIsLoaded(true);
      });
  }, []);

  return (
    <div style={{ width: '100%', height: '90vh' }}>
      {isLoaded && (
        <ReactGraph
          initialState={data}
          nodes={data.nodes}
          relationships={data.relationships}
          width="100%"
          height="100%"
          hasLegends
          hasInspector
          hasTruncatedFields
        />
      )}
    </div>
  );
};

export default GraphView;
