import React, { useContext, useEffect, useState } from 'react';
import ReactGraph from 'react-graph';
import { useDispatch, useSelector } from 'react-redux';
import { handleCurrPageTitle } from '../../Redux/slices/navSlice';
import AuthContext from '../../Store/Auth-Context';

const apiURL= `${process.env.REACT_APP_LM_REST_API_URL}/link/visualize`;

const GraphView = ({uri}) => {
  const {graphData, isLoading}=useSelector(state=>state.graph);
  // const {sourceDataList}=useSelector(state=>state.links);
  const authCtx = useContext(AuthContext);
  const dispatch =useDispatch();
  console.log(uri);
  useEffect(()=>{
    dispatch(handleCurrPageTitle('Graph view'));
    // dispatch(fetchGraphData({url:graphApiURL, token:authCtx.token}));
  },[]);

  console.log('Loading: ', isLoading, graphData);
  const [isLoaded, setIsLoaded] = useState(false);
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch(`${apiURL}?start_node_id=${encodeURIComponent(uri)}`, {
      method: 'GET',
      headers: {
        'Content-type': 'application/json',
        authorization: 'Bearer ' + authCtx.token,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setData(data.data);
      })
      .finally(() => {
        setIsLoaded(true);
      });
  }, []);
  console.log(data);
  console.log(isLoaded);
  return (
    <div style={{ width: '100%', height: '90vh' }}>
      {isLoaded && data?.nodes[0] && (
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
