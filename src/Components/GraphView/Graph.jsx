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

const Graph = () => {
  const { sourceDataList } = useSelector((state) => state.links);
  const authCtx = useContext(AuthContext);
  const dispatch = useDispatch();
  const [notificationType, setNotificationType] = useState('');
  const [notificationMessage, setNotificationMessage] = useState('');
  const showNotification = (type, message) => {
    setNotificationType(type);
    setNotificationMessage(message);
  };
  useEffect(() => {
    dispatch(handleCurrPageTitle('Graph view'));
  }, []);

  // gen a number persistent color from around the palette
  const getColor = (n) =>
    '#' + ((n * 1234567) % Math.pow(2, 24)).toString(16).padStart(6, '0');

  let graphData = { nodes: [], edges: [] };

  // get data using react-query
  if (sourceDataList?.uri) {
    const { data } = useQuery(['vis-graph'], () =>
      fetchAPIRequest({
        urlPath: `link/visualize/staged?start_node_id=${encodeURIComponent(
          sourceDataList?.uri,
        )}&direction=outgoing&max_depth_outgoing=1`,
        token: authCtx.token,
        method: 'GET',
        showNotification: showNotification,
      }),
    );

    const nodes = data?.data?.nodes?.reduce((accumulator, node) => {
      const name = node?.properties?.name;

      const newNode = {
        ...node,
        ...node.properties,
        id: node?.id,
        label: name?.slice(0, 20),
        color: getColor(node.id),
      };

      // delete newNode.properties;
      accumulator.push(newNode);
      return accumulator;
    }, []);

    const edges = data?.data?.relationships?.reduce((accumulator, edge) => {
      const newEdge = {
        from: edge?.startNodeId,
        to: edge?.endNodeId,
        label: edge?.type,
        ...edge.properties,
      };
      accumulator.push(newEdge);
      return accumulator;
    }, []);
    graphData = { nodes, edges };
  }
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
  if (graphData.nodes?.length) {
    return (
      <div className="vis-graph-container">
        <VisGraph
          graph={graphData}
          options={visGraphOptions}
          events={{
            click: () => {},
            doubleClick: () => {},
          }}
          getNetwork={() => {}}
        />
        {notification()}
      </div>
    );
  }

  return (
    <div className="vis-graph-container">
      <h5 className="no-data-title">No data found</h5>
      {notification()}
    </div>
  );
};

export default React.memo(Graph);
