import React, { useContext, useEffect, useState } from 'react';
import ReactGraph from 'react-graph';
import { useDispatch, useSelector } from 'react-redux';
import { fetchGraphData } from '../../Redux/slices/graphSlice';
import { handleCurrPageTitle } from '../../Redux/slices/navSlice';
import AuthContext from '../../Store/Auth-Context';
import rootData from './rootData';
const apiURL = `${process.env.REACT_APP_LM_REST_API_URL}/link/visualize`;

const GraphView = () => {
  let showData = {};
  const { graphData, graphLoading } = useSelector((state) => state.graph);
  const { sourceDataList } = useSelector((state) => state.links);
  const authCtx = useContext(AuthContext);
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    dispatch(handleCurrPageTitle('Graph view'));
    if (sourceDataList.uri) {
      dispatch(
        fetchGraphData({
          url: `${apiURL}?start_node_id=${encodeURIComponent(sourceDataList?.uri)}`,
          token: authCtx.token,
        }),
      );
      setIsLoading(false);
    }
  }, []);

  console.log('fake data: ', rootData);
  console.log('API data: ', graphLoading, graphData);
  console.log('API isLoading: ', isLoading);

  if (isLoading) showData = rootData;
  if (!isLoading) showData = graphData;

  return (
    <div style={{ width: '100%', height: '90vh' }}>
      {!isLoading && (
        <ReactGraph
          initialState={showData}
          nodes={showData.nodes}
          relationships={showData.relationships}
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
