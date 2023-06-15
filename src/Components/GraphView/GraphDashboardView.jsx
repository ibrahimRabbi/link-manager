import React from 'react';
import GraphDashboard from './GraphDashboard';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { handleCurrPageTitle } from '../../Redux/slices/navSlice';
import { useContext } from 'react';
import AuthContext from '../../Store/Auth-Context';
import { fetchGraphData } from '../../Redux/slices/graphSlice';

const apiURL = `${process.env.REACT_APP_LM_REST_API_URL}/link/visualize/staged`;

const GraphDashboardView = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(handleCurrPageTitle('Graph dashboard view'));
  }, []);

  const { graphData, graphLoading } = useSelector((state) => state.graph);
  const { sourceDataList } = useSelector((state) => state.links);
  const authCtx = useContext(AuthContext);

  useEffect(() => {
    dispatch(handleCurrPageTitle('Graph view'));
    if (sourceDataList.uri) {
      dispatch(
        fetchGraphData({
          url: `${apiURL}?start_node_id=${encodeURIComponent(
            sourceDataList?.uri,
          )}&direction=outgoing`,
          token: authCtx.token,
        }),
      );
    }
  }, [sourceDataList]);

  // map graph nodes
  const nodesIdMap = {};
  graphData?.nodes.forEach((node) => {
    nodesIdMap[node.id] = node;
  });

  return (
    <GraphDashboard
      loading={graphLoading}
      nodesIdMap={nodesIdMap}
      nodes={graphData?.nodes}
      relationships={graphData?.relationships}
    />
  );
};

export default GraphDashboardView;
