import React, { useContext, useState } from 'react';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import visGraphOptions from './visGraphOptions';
import VisGraph from 'react-graph-vis';
import { useQuery } from '@tanstack/react-query';
import fetchAPIRequest from '../../apiRequests/apiRequest';
import { handleCurrPageTitle } from '../../Redux/slices/navSlice';
import AuthContext from '../../Store/Auth-Context';
import Notification from '../Shared/Notification';
import UseLoader from '../Shared/UseLoader';

const Graph = () => {
  const { sourceDataList, isWbe } = useSelector((state) => state.links);
  const authCtx = useContext(AuthContext);
  const [displayGraph, setDisplayGraph] = useState({ nodes: [], edges: [] });
  const dispatch = useDispatch();
  const [processLoading, setProcessLoading] = useState(false);
  const [notificationType, setNotificationType] = useState('');
  const [notificationMessage, setNotificationMessage] = useState('');

  useEffect(() => {
    dispatch(handleCurrPageTitle('Graph view'));
  }, []);

  const showNotification = (type, message) => {
    setNotificationType(type);
    setNotificationMessage(message);
  };

  // gen a number persistent color from around the palette
  const getColor = (n) =>
    '#' + ((n * 1234567) % Math.pow(2, 24)).toString(16).padStart(6, '0');

  // get data using react-query
  const { data: graphData, isLoading } = useQuery(['vis-graph'], () =>
    fetchAPIRequest({
      urlPath: `link/visualize/staged?start_node_id=${encodeURIComponent(
        sourceDataList?.uri,
      )}&direction=outgoing&max_depth_outgoing=1`,
      token: authCtx.token,
      showNotification: showNotification,
      method: 'GET',
    }),
  );

  useEffect(() => {
    let isMounted = true;
    if (isWbe && graphData?.data?.nodes) {
      setProcessLoading(true);
      const nodes = graphData?.data?.nodes?.reduce((accumulator, node) => {
        const name = node?.properties?.name;

        const newNode = {
          ...node,
          ...node.properties,
          id: node?.id,
          label: name?.slice(0, 20),
          color: getColor(node.id),
        };
        accumulator.push(newNode);
        return accumulator;
      }, []);

      const edges = graphData?.data?.relationships?.reduce((accumulator, edge) => {
        const newEdge = {
          from: edge?.startNodeId,
          to: edge?.endNodeId,
          label: edge?.type,
          ...edge.properties,
        };
        accumulator.push(newEdge);
        return accumulator;
      }, []);

      if (isMounted) setDisplayGraph({ nodes, edges });
    }
    setProcessLoading(false);
    return () => {
      isMounted = false;
    };
  }, [graphData]);

  // notification component
  const notification = () => {
    return (
      notificationType &&
      notificationMessage && (
        <Notification
          type={notificationType}
          message={notificationMessage}
          setNotificationType={setNotificationType}
          setNotificationMessage={setNotificationMessage}
        />
      )
    );
  };

  if ((isWbe && isLoading) || processLoading) {
    return (
      <div className="vis-graph-container">
        <UseLoader />
      </div>
    );
  } else if (isWbe && displayGraph.nodes?.length) {
    return (
      <div className="vis-graph-container">
        <VisGraph
          graph={displayGraph}
          options={visGraphOptions}
          events={{
            click: () => {},
            doubleClick: () => {},
          }}
          getNetwork={() => {}}
        />

        {isWbe ? notification() : ''}
      </div>
    );
  }

  return (
    <div className="vis-graph-container">
      <h5 className="no-data-title">
        {isWbe
          ? 'No content available for this source'
          : 'No source found to display the graph'}
      </h5>
      {isWbe ? notification() : ''}
    </div>
  );
};

export default React.memo(Graph);
