import React, { useContext, useEffect, useRef, useState } from 'react';
import Cytoscape from 'react-cytoscapejs';
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
// eslint-disable-next-line max-len
import { showOslcData } from '../AdminDasComponents/ExternalAppIntegrations/ExternalPreview/ExternalPreviewConfig.jsx';

const { nodeInfoContainer, noDataTitle } = styles;
const CytoscapeGraphView = () => {
  const { sourceDataList, isWbe } = useSelector((state) => state.links);
  const authCtx = useContext(AuthContext);
  const [selectedNode, setSelectedNode] = React.useState(null);
  const [nodeData, setNodeData] = React.useState(null);
  const [edgeData, setEdgeData] = React.useState(null);

  const [openedExternalPreview, setOpenedExternalPreview] = useState(false);
  const [expandedNodeData, setExpandedNodeData] = useState(null);
  const [expandNode, setExpandNode] = useState(false);

  const dispatch = useDispatch();
  const containerRef = useRef(null);
  const graphContainerRef = useRef(null);
  const cyRef = useRef(null);

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
        )}&direction=outgoing&max_depth_outgoing=1`,
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
          )}&direction=outgoing&max_depth_outgoing=1`,
          token: authCtx.token,
          showNotification: showNotification,
          method: 'GET',
        });
        setExpandedNodeData(response?.data);
      }
      return null;
    } catch (error) {
      return null;
    }
  };

  const findSelectedNode = (nodeId) => {
    return nodeData?.filter((item) => item?.data?.id === nodeId);
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
        let nodeData = foundGraph[0]?.data?.nodeData;
        if (foundGraph[0]?.data?.nodeData?.koatl_uri) {
          nodeData = showOslcData(nodeData);
        }
        setSelectedNode(nodeData);
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

  useEffect(() => {
    if (expandedNodeData) {
      let updatedNodes = expandedNodeData?.nodes?.map((item) => {
        let nodeStyle = checkNodeStyle(item?.properties?.resource_type);

        return {
          data: {
            id: item.id.toString(),
            label: item.label,
            classes: 'bottom-center',
            nodeData: item?.properties,
          },
          style: nodeStyle ? nodeStyle : {},
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
      setExpandNode(null);
      setExpandedNodeData(null);
      setNodeData([...nodeData, ...updatedNodes]);
      setEdgeData([...edgeData, ...updatedEdges]);
    }
  }, [expandedNodeData]);

  // Request data of the node to expand
  useEffect(() => {
    if (expandNode) {
      let updatedGraphData = nodeData.map((item) => {
        if (item?.data?.id === expandNode?.data?.id) {
          item.data.getChildData = true;
        }
        return item;
      });
      setNodeData(updatedGraphData);
      if (!expandNode?.data?.nodeData?.id.includes('lm-api-dev')) {
        fetchNodeData(expandNode?.data?.nodeData?.id);
      } else {
        fetchNodeData(expandNode?.data?.nodeData?.web_url);
      }
    }
  }, [expandNode]);

  useEffect(() => {
    cytoscape.use(cxtmenu);
    dispatch(handleCurrPageTitle('Graph view'));
    document.addEventListener('click', handleClickOutside);

    return () => {
      // Cleanup: Remove the event listener when the component unmounts
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (data) {
      let nodeData = data?.data?.nodes?.map((item) => {
        let nodeStyle = checkNodeStyle(item?.properties?.resource_type);
        if (sourceDataList?.uri === item?.properties?.id) {
          nodeStyle = null;
          item.expanded = true;
        }
        return {
          data: {
            id: item.id.toString(),
            label: item.label,
            classes: 'bottom-center',
            nodeData: item?.properties,
          },
          style: nodeStyle ? nodeStyle : {},
        };
      });
      let edges = data?.data?.edges?.map((item) => {
        return {
          data: {
            source: item.from.toString(),
            target: item.to.toString(),
            label: item.label,
          },
          classes: 'unbundled-bezier',
        };
      });
      setNodeData(nodeData ? nodeData : []);
      setEdgeData(edges ? edges : []);
    }
  }, [data]);

  return (
    <>
      <div ref={graphContainerRef}>
        {isWbe && isLoading && <UseLoader />}

        {isWbe && data && (
          <>
            {nodeData || edgeData ? (
              <>
                <Cytoscape
                  containerID="cy"
                  elements={nodeData?.concat(edgeData)}
                  layout={graphLayout}
                  stylesheet={graphStyle}
                  // userZoomingEnabled={false}
                  style={{ width: '99%', height: '99vh' }}
                  cy={(cy) => {
                    cyRef.current = cy;
                    cy.cxtmenu({
                      selector: 'node',
                      commands: contextMenuCommands,
                    });
                    cy.layout(graphLayout).run();
                    cy.fit(10); // Adjust the padding as needed
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
