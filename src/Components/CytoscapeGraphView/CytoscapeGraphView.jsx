import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
import CytoscapeComponent from 'react-cytoscapejs';
import cytoscape from 'cytoscape';
import cxtmenu from 'cytoscape-cxtmenu';
import { useQuery } from '@tanstack/react-query';
import fetchAPIRequest from '../../apiRequests/apiRequest.js';
import AuthContext from '../../Store/Auth-Context.jsx';
import { Message, toaster } from 'rsuite';

// eslint-disable-next-line max-len
import ExternalPreview from '../AdminDasComponents/ExternalAppIntegrations/ExternalPreview/ExternalPreview.jsx';
import styles from './CytoscapeGraphView.module.scss';
import { useDispatch, useSelector } from 'react-redux';
import { handleCurrPageTitle } from '../../Redux/slices/navSlice.jsx';
import { graphLayout, graphStyle } from './CytoscapeGraphConfig.jsx';
import UseLoader from '../Shared/UseLoader.jsx';
import { nodeColorStyles } from './NodeStyles.jsx';

const { nodeInfoContainer, noDataTitle } = styles;
const CytoscapeGraphView = () => {
  const { sourceDataList, isWbe } = useSelector((state) => state.links);
  const authCtx = useContext(AuthContext);
  const [selectedNode, setSelectedNode] = React.useState(null);
  const [graphData, setGraphData] = React.useState([]);

  const [openedExternalPreview, setOpenedExternalPreview] = useState(false);
  const [expandedNodeData, setExpandedNodeData] = useState(null);
  const [expandNode, setExpandNode] = useState(false);

  const [updatedGraphLayout, setUpdatedGraphLayout] = useState(graphLayout);
  const dispatch = useDispatch();
  const containerRef = useRef(null);
  const graphContainerRef = useRef(null);

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

  const { data, isLoading } = useQuery({
    queryKey: ['vis-graph'],
    queryFn: () =>
      fetchAPIRequest({
        urlPath: `link/visualize/staged?start_node_id=${encodeURIComponent(
          sourceDataList?.uri,
        )}&direction=outgoing&max_depth_outgoing=2`,
        token: authCtx.token,
        showNotification: showNotification,
        method: 'GET',
      }),
  });

  const fetchNodeData = async (nodeId) => {
    try {
      if (nodeId) {
        // Make an API request to get the data for the node
        const response = await fetchAPIRequest({
          urlPath: `link/visualize/staged?start_node_id=${encodeURIComponent(
            nodeId,
          )}&direction=outgoing`,
          token: authCtx.token,
          showNotification: showNotification,
          method: 'GET',
        });
        setExpandedNodeData(response.data);
      }
      return null;
    } catch (error) {
      console.error('Error fetching node data:', error);
      return null;
    }
  };

  const findSelectedNode = (nodeId) => {
    return graphData?.filter((item) => item?.data?.id === nodeId);
  };

  const handleClickOutside = (event) => {
    // Check if the click is outside the div container
    if (containerRef.current && !containerRef.current.contains(event.target)) {
      setOpenedExternalPreview(false);
    }
  };

  // Define the commands for the cytoscape context menu
  const contextMenuCommands = [
    {
      content: 'Show data',
      select: function (ele) {
        const foundGraph = findSelectedNode(ele.id());
        setSelectedNode(foundGraph[0]?.data?.nodeData);
        setOpenedExternalPreview(true);
      },
    },
    {
      content: 'Expand',
      select: function (ele) {
        const foundNode = findSelectedNode(ele.id());
        setExpandNode(foundNode[0]);
      },
    },
    {
      content: 'Go to web app',
      select: function (ele) {
        const selectedNode = findSelectedNode(ele.id());
        if (selectedNode) {
          const url = selectedNode[0]?.data?.nodeData.id;
          if (url) {
            window.open(url, '_blank');
          }
        }
      },
    },
  ];

  // Set a node color and shape based on resource type
  const checkNodeStyle = (value) => {
    if (value) {
      const resourceType = value?.split('#')[1];
      for (const key in nodeColorStyles) {
        if (key === resourceType) {
          return nodeColorStyles[key];
        }
      }
    }
    return nodeColorStyles['default'];
  };

  const memoizedData = useMemo(() => {
    if (data) {
      let nodeData = data?.data?.nodes?.map((item) => {
        let nodeStyle = checkNodeStyle(item?.properties?.resource_type);
        if (sourceDataList?.uri === item?.properties?.id) {
          nodeStyle = null;
          item.expanded = true;
        }
        const randomX = Math.random() * 720;
        const randomY = Math.random() * 980;
        return {
          data: {
            id: item.id.toString(),
            label: item.label,
            classes: 'bottom-center',
            nodeData: item?.properties,
          },
          style: nodeStyle ? nodeStyle : {},
          position: { x: randomX, y: randomY },
        };
      });
      let edges = data?.data?.edges?.map((item) => {
        return {
          data: {
            source: item.from.toString(),
            target: item.to.toString(),
            label: item.label,
            classes: 'autorotate',
          },
        };
      });
      nodeData = nodeData.concat(edges);
      return nodeData ? nodeData : [];
    }
    return [];
  }, [data]);

  useEffect(() => {
    if (expandedNodeData) {
      let updatedNodes = expandedNodeData?.nodes?.map((item) => {
        let nodeStyle = checkNodeStyle(item?.properties?.resource_type);
        const randomX = Math.random() * 720;
        const randomY = Math.random() * 980;

        let position = { x: randomX, y: randomY };
        if (expandNode?.data?.nodeData.id === item?.properties?.id) {
          position = {};
        }

        return {
          data: {
            id: item.id.toString(),
            label: item.label,
            classes: 'bottom-center',
            nodeData: item?.properties,
          },
          style: nodeStyle ? nodeStyle : {},
          position: position,
        };
      });

      let updatedEdges = expandedNodeData?.edges?.map((item) => {
        return {
          data: {
            source: item.from.toString(),
            target: item.to.toString(),
            label: item.label,
            classes: 'autorotate',
          },
        };
      });
      setExpandedNodeData(null);
      setGraphData([...graphData, ...updatedNodes, ...updatedEdges]);
    }
  }, [expandedNodeData]);

  // Request data of the node to expand
  useEffect(() => {
    if (expandNode) {
      let updatedGraphData = graphData.map((item) => {
        if (item?.data?.id === expandNode?.data?.id) {
          item.data.getChildData = true;
        }
        return item;
      });
      setGraphData(updatedGraphData);
      if (!expandNode?.data?.nodeData?.id.includes('lm-api-dev')) {
        fetchNodeData(expandNode?.data?.nodeData?.id);
      } else {
        fetchNodeData(expandNode?.data?.nodeData?.web_url);
      }
    }
  }, [expandNode]);

  // Store the graph data in the state
  useEffect(() => {
    setGraphData(memoizedData);
  }, [memoizedData]);

  useEffect(() => {
    cytoscape.use(cxtmenu);
    dispatch(handleCurrPageTitle('Graph view'));

    const graphContainer = graphContainerRef.current;
    const graphContainerRect = graphContainer.getBoundingClientRect();
    setUpdatedGraphLayout({
      ...graphLayout,
      width: graphContainerRect.width,
      height: graphContainerRect.height,
    });
    // Add a click event listener to the document
    document.addEventListener('click', handleClickOutside);

    return () => {
      // Cleanup: Remove the event listener when the component unmounts
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  return (
    <>
      <div ref={graphContainerRef}>
        {isWbe && isLoading && <UseLoader />}

        {isWbe && data && (
          <>
            {memoizedData ? (
              <>
                <CytoscapeComponent
                  elements={graphData}
                  layout={updatedGraphLayout}
                  stylesheet={graphStyle}
                  style={{ width: '99%', height: '99vh' }}
                  cy={(cy) => {
                    // Add context menu configuration to the Cytoscape instance
                    cy.cxtmenu({
                      selector: 'node', // Display context menu only for nodes
                      commands: contextMenuCommands,
                    });
                  }}
                />
              </>
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
        {selectedNode && openedExternalPreview && (
          <div ref={containerRef} className={nodeInfoContainer}>
            <ExternalPreview nodeData={selectedNode} fromGraphView={true} />
          </div>
        )}
      </div>
    </>
  );
};

export default CytoscapeGraphView;
