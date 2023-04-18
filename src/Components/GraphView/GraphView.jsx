import { ProgressBar } from '@carbon/react';
import React, { useContext, useEffect } from 'react';
import ReactGraph from 'react-graph';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { fetchGraphData } from '../../Redux/slices/graphSlice';
import { handleCurrPageTitle, handleIsProfileOpen } from '../../Redux/slices/navSlice';
import AuthContext from '../../Store/Auth-Context';

const apiURL = `${process.env.REACT_APP_LM_REST_API_URL}/link/visualize/staged`;

const GraphView = () => {
  const { graphData, graphLoading } = useSelector((state) => state.graph);
  const { sourceDataList } = useSelector((state) => state.links);
  const { isProfileOpen } = useSelector((state) => state.nav);
  const authCtx = useContext(AuthContext);
  const dispatch = useDispatch();
  const location = useLocation();
  const wbePath = location.pathname?.includes('wbe');

  useEffect(() => {
    dispatch(handleIsProfileOpen(isProfileOpen && false));
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

  return (
    <div>
      <div
        onClick={() => dispatch(handleIsProfileOpen(isProfileOpen && false))}
        className={wbePath ? 'wbeNavSpace' : ''}
      >
        {graphLoading ? (
          <ProgressBar label="" />
        ) : (
          <div className="graphContainer">
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
        )}
      </div>
    </div>
  );
};

export default GraphView;
