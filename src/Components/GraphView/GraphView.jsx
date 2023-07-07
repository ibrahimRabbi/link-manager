import React, { useContext, useEffect } from 'react';
import ReactGraph from 'react-graph';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { handleCurrPageTitle, handleIsProfileOpen } from '../../Redux/slices/navSlice';
import AuthContext from '../../Store/Auth-Context';
import UseLoader from '../Shared/UseLoader';
import { useQuery } from '@tanstack/react-query';
import fetchAPIRequest from '../../apiRequests/apiRequest';

const GraphView = () => {
  const { sourceDataList } = useSelector((state) => state.links);
  const { isProfileOpen } = useSelector((state) => state.nav);
  const authCtx = useContext(AuthContext);
  const dispatch = useDispatch();
  const location = useLocation();
  const wbePath = location.pathname?.includes('wbe');

  let graphData = { nodes: [], relationships: [] };
  let isGraphLoading = false;
  // get data using react-query
  if (sourceDataList?.uri) {
    const { data, isLoading } = useQuery(['graphView'], () =>
      fetchAPIRequest({
        urlPath: `link/visualize/staged?start_node_id=${encodeURIComponent(
          sourceDataList?.uri,
        )}&direction=outgoing&max_depth_outgoing=1`,
        token: authCtx.token,
        method: 'GET',
      }),
    );
    isGraphLoading = isLoading;
    graphData = data?.data;
  }

  // load graph data
  useEffect(() => {
    dispatch(handleIsProfileOpen(isProfileOpen && false));
    dispatch(handleCurrPageTitle('Graph view'));
  }, []);

  const graphViewData = graphData?.nodes?.length
    ? graphData
    : { nodes: [], relationships: [] };

  return (
    <div
      onClick={() => dispatch(handleIsProfileOpen(isProfileOpen && false))}
      className={wbePath ? 'wbeNavSpace' : ''}
    >
      {isGraphLoading ? (
        <UseLoader />
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
    </div>
  );
};

export default GraphView;
