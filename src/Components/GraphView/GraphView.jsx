import { ProgressBar } from '@carbon/react';
import React, { useContext, useEffect } from 'react';
import ReactGraph from 'react-graph';
import { useDispatch, useSelector } from 'react-redux';
import { fetchGraphData } from '../../Redux/slices/graphSlice';
import { handleCurrPageTitle } from '../../Redux/slices/navSlice';
import AuthContext from '../../Store/Auth-Context';

const apiURL = `${process.env.REACT_APP_LM_REST_API_URL}/link/visualize/staged`;

const GraphView = () => {
  const { graphData, graphLoading } = useSelector((state) => state.graph);
  const { sourceDataList } = useSelector((state) => state.links);
  const authCtx = useContext(AuthContext);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(handleCurrPageTitle('Graph view'));
    if (sourceDataList.uri) {
      dispatch(
        fetchGraphData({
          url: `${apiURL}?start_node_id=${encodeURIComponent(sourceDataList?.uri)}`,
          token: authCtx.token,
        }),
      );
    }
  }, [sourceDataList]);

  console.log(graphData);

  if (graphLoading) return  <ProgressBar />;

  return (
    <div style={{ width: '100%', height: '95vh' }}>
      <ReactGraph
        initialState={graphData}
        nodes={graphData.nodes}
        relationships={graphData.relationships}
        width="100%"
        height="100%"
        // hasLegends
        hasInspector
        hasTruncatedFields
      />
    </div>
  );
};

export default GraphView;
