import React, {useContext, useEffect, useState} from 'react';
import ReactGraph from 'react-graph';
import AuthContext from '../../Store/Auth-Context.jsx';

const apiURL = `${process.env.REACT_APP_LM_REST_API_URL}/link/visualize`;
const GraphView = () => {

  const [isLoaded, setIsLoaded] = useState(false);
  const [data, setData] = useState(null);

  const authCtx = useContext(AuthContext);

  useEffect(() => {
    fetch(apiURL, {
      method:'POST',
      headers:{
        'Content-type':'application/json',
        'authorization':'Bearer ' + authCtx.token,
      },
      body:JSON.stringify({
        start_node: 'README.md',
        end_node: 'https://jira-oslc-api-dev.koneksys.com/oslc/provider/CDID/resources/tasks/CDID-20'
      }),
    }).then(res => res.json()).then(data => {
      setData(data.data);

    }).finally(() => {
      setIsLoaded(true);
    });

  }, []);

  return (
    <div>
      <h3>This is Graph view</h3>
      <div>
        <h1>hi</h1>
        {isLoaded && (
          <ReactGraph
            initialState={data}
            nodes={data.nodes}
            relationships={data.relationships}
            width="50%"
            height="10%"
            // hasLegends={true}
            // hasInspector={true}
            // hasTruncatedFields={true}
          />
        )}
      </div>
    </div>
  );
};

export default GraphView;
