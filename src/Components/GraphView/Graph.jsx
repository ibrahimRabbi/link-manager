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
import styles from './Graph.module.scss';
import { Col, Grid, Row } from 'rsuite';

const { nodeInfoContainer, visGraphContainer, noDataTitle, infoRow, firstColumn } =
  styles;

const Graph = () => {
  const { sourceDataList, isWbe } = useSelector((state) => state.links);
  const authCtx = useContext(AuthContext);
  const [selectedNode, setSelectedNode] = useState({});
  const dispatch = useDispatch();
  const [notificationType, setNotificationType] = useState('');
  const [notificationMessage, setNotificationMessage] = useState('');

  useEffect(() => {
    dispatch(handleCurrPageTitle('Graph view'));
  }, []);

  const showNotification = (type, message) => {
    setNotificationType(type);
    setNotificationMessage(message);
  };

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

  if (isWbe && isLoading) {
    return (
      <div className={visGraphContainer}>
        {' '}
        <UseLoader />{' '}
      </div>
    );
  } else if (isWbe && graphData) {
    if (graphData?.data?.nodes?.length) {
      return (
        <div className={visGraphContainer}>
          <VisGraph
            graph={graphData?.data}
            options={visGraphOptions}
            events={{
              selectNode: (selected) => {
                const nodeId = selected?.nodes[0];
                const node = graphData?.data?.nodes?.find((value) => value.id === nodeId);
                setSelectedNode({
                  node_id: nodeId,
                  id: node?.id,
                  label: node?.label,
                  ...node?.properties,
                });
              },
              deselectNode: () => {
                setSelectedNode({});
              },
              click: () => {},
              doubleClick: () => {},
            }}
            getNetwork={() => {}}
          />

          {/* node details section  */}
          {selectedNode?.node_id && (
            <div className={nodeInfoContainer}>
              <h6>Selected node details.</h6>
              <Grid fluid>
                {Object.keys(selectedNode)?.map((key, i) => {
                  if (!selectedNode[key]) return null;
                  return (
                    <Row className={`show-grid ${infoRow}`} key={i}>
                      <Col xs={8} className={firstColumn}>
                        <p>
                          <span>{key}</span>
                        </p>
                      </Col>
                      <Col xs={16}>
                        <p>{selectedNode[key]}</p>{' '}
                      </Col>
                    </Row>
                  );
                })}
              </Grid>
            </div>
          )}

          {isWbe ? notification() : ''}
        </div>
      );
    }
  }

  return (
    <div className={visGraphContainer}>
      <h5 className={noDataTitle}>
        {isWbe
          ? 'No content available for this source'
          : 'No source found to display the graph'}
      </h5>
      {isWbe ? notification() : ''}
    </div>
  );
};

export default React.memo(Graph);
