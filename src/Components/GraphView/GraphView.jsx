import React, { useContext, useEffect } from 'react';
import ReactGraph from 'react-graph';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { handleCurrPageTitle, handleIsProfileOpen } from '../../Redux/slices/navSlice';
import AuthContext from '../../Store/Auth-Context';
import UseLoader from '../Shared/UseLoader';
import GraphDashboard from './GraphDashboard';
import { useQuery } from '@tanstack/react-query';
import fetchAPIRequest from '../../apiRequests/apiRequest';

let isGraphDashboard = process.env.REACT_APP_IS_GRAPH_DASHBOARD;
if (isGraphDashboard) isGraphDashboard = JSON.parse(isGraphDashboard);

const GraphView = () => {
  const { sourceDataList } = useSelector((state) => state.links);
  const { isProfileOpen } = useSelector((state) => state.nav);
  const authCtx = useContext(AuthContext);
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const wbePath = location.pathname?.includes('wbe');
  // get data using react-query
  const {
    data,
    isLoading: isGraphLoading,
    refetch: graphDataRefetch,
  } = useQuery(['graphView'], () =>
    fetchAPIRequest({
      urlPath: `link/visualize/staged?start_node_id=${encodeURIComponent(
        sourceDataList?.uri,
      )}&direction=outgoing&max_depth_outgoing=1`,
      token: authCtx.token,
      method: 'GET',
    }),
  );

  // check url location to display graph view and graph dashboard
  const isDashboard =
    // eslint-disable-next-line max-len
    location?.pathname === '/graph-dashboard' ||
    location?.pathname === '/wbe/graph-dashboard';

  // load graph data
  useEffect(() => {
    dispatch(handleIsProfileOpen(isProfileOpen && false));
    dispatch(handleCurrPageTitle('Graph view'));

    if (sourceDataList.uri) {
      graphDataRefetch();
    }
  }, [sourceDataList]);

  // if feature flag is off then user can't see the graph dashboard table page
  useEffect(() => {
    if (isDashboard && !isGraphDashboard) {
      wbePath ? navigate('/wbe') : navigate('/');
    }
  }, [isDashboard, isGraphDashboard]);

  const graphViewData = data ? data?.data : { nodes: [], relationships: [] };

  // map graph nodes
  const nodesIdMap = {};
  graphViewData?.nodes?.forEach((node) => {
    nodesIdMap[node?.id] = node;
  });

  return (
    <div>
      <div
        onClick={() => dispatch(handleIsProfileOpen(isProfileOpen && false))}
        className={wbePath ? 'wbeNavSpace' : ''}
      >
        {isGraphLoading ? (
          <UseLoader />
        ) : (
          <>
            {isDashboard ? (
              <GraphDashboard
                nodesIdMap={nodesIdMap}
                nodes={graphViewData?.nodes}
                relationships={graphViewData?.relationships}
              />
            ) : (
              <div className="graphContainer">
                <ReactGraph
                  initialState={graphViewData}
                  nodes={graphViewData?.nodes}
                  relationships={graphViewData?.relationships}
                  width="100%"
                  height="100%"
                  hasLegends
                  hasInspector
                  hasTruncatedFields
                />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default GraphView;
