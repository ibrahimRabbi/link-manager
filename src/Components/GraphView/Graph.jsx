import React, { useContext, useMemo, useState } from 'react';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import visGraphOptions from './visGraphOptions';
import VisGraph from 'react-vis-network-graph';
import { useQuery } from '@tanstack/react-query';
import fetchAPIRequest from '../../apiRequests/apiRequest';
import { handleCurrPageTitle } from '../../Redux/slices/navSlice';
import AuthContext from '../../Store/Auth-Context';
import UseLoader from '../Shared/UseLoader';
import styles from './Graph.module.scss';
import { Col, Grid, Message, Row, toaster } from 'rsuite';

const { nodeInfoContainer, visGraphContainer, noDataTitle, infoRow, firstColumn } =
  styles;

const Graph = () => {
  const { sourceDataList, isWbe } = useSelector((state) => state.links);
  const authCtx = useContext(AuthContext);
  const [selectedNode, setSelectedNode] = useState({});
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(handleCurrPageTitle('Graph View'));
  }, []);

  const showNotification = (type, message) => {
    if (type && message) {
      const messages = (
        <Message closable showIcon type={type}>
          {message}
        </Message>
      );
      toaster.push(messages, { placement: 'bottomCenter', duration: 5000 });
    }
  };

  // get data using react-query
  const { data, isLoading } = useQuery({
    queryKey: ['vis-graph'],
    queryFn: () =>
      fetchAPIRequest({
        urlPath: `link/visualize/staged?start_node_id=${encodeURIComponent(
          sourceDataList?.uri,
        )}&direction=outgoing&max_depth_outgoing=1`,
        token: authCtx.token,
        showNotification: showNotification,
        method: 'GET',
      }),
  });

  const memoizedData = useMemo(() => {
    return data?.data ? data?.data : { nodes: [], edges: [] };
  }, [data]);

  return (
    <>
      <div className={visGraphContainer}>
        {isWbe && isLoading && <UseLoader />}

        {isWbe && data && (
          <>
            {memoizedData?.nodes[0] ? (
              <VisGraph
                graph={memoizedData}
                options={visGraphOptions}
                events={{
                  selectNode: (selected) => {
                    const nodeId = selected?.nodes[0];
                    const node = memoizedData?.nodes?.find(
                      (value) => value.id === nodeId,
                    );
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
            ) : (
              <h5 className={noDataTitle}>
                {isWbe
                  ? 'No content available for this source'
                  : 'No source found to display the graph'}
              </h5>
            )}
          </>
        )}

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
      </div>
    </>
  );
};

export default Graph;
