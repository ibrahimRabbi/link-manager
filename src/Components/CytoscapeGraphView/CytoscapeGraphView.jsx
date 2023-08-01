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
  // Create your graph elements and layout

  const { sourceDataList, isWbe } = useSelector((state) => state.links);
  const authCtx = useContext(AuthContext);
  const [selectedNode, setSelectedNode] = React.useState(null);
  const [nodeToExpand, setNodeToExpand] = React.useState(null);

  const [isContainerVisible, setIsContainerVisible] = useState(false);
  const [updatedGraphLayout, setUpdatedGraphLayout] = useState(graphLayout);
  const dispatch = useDispatch();
  const containerRef = useRef(null);
  const graphContainerRef = useRef(null);
  let contextMenuLoaded = useRef(false);

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

  // eslint-disable-next-line max-len

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
      console.log('Fetching node data for node:', nodeId);
      // Make an API request to get the data for the node
      const response = await fetchAPIRequest({
        urlPath: `link/visualize/staged?start_node_id=${encodeURIComponent(nodeId)}`,
        token: authCtx.token,
        showNotification: showNotification,
        method: 'GET',
      });

      // Return the data for the node
      return response.data;
    } catch (error) {
      console.error('Error fetching node data:', error);
      return null;
    }
  };

  const { data: nodeData } = useQuery({
    queryKey: [nodeToExpand?.data?.nodeData?.id], // Use the node ID as the query key
    queryFn: () => fetchNodeData(nodeToExpand?.data?.nodeData?.id),
  });

  useEffect(() => {
    // console.log('nodeToExpand', nodeToExpand);
    if (nodeToExpand) {
      fetchNodeData(nodeToExpand?.data?.nodeData?.id).then(r => console.log('r', r));
    }
  }, [nodeToExpand]);

  // useEffect(() => {
  //   if (nodeData && nodeToExpand) {
  //     console.log('isNodeDataLoading', isNodeDataLoading);
  //     console.log('nodeData', nodeData);
  //
  //     console.log('data', data);
  //
  //   }
  //
  // }, [nodeData, nodeToExpand]);

  const findSelectedNode = (nodeId) => {
    return memoizedData?.filter((item) => item?.data?.id === nodeId);
  };



  const handleClickOutside = (event) => {
    // Check if the click is outside the div container
    if (containerRef.current && !containerRef.current.contains(event.target)) {
      setIsContainerVisible(false);
    }
  };

  // Define the commands for the cytoscape context menu
  const contextMenuCommands = [
    {
      content: 'Show data',
      select: function (ele) {
        const foundGraph = findSelectedNode(ele.id());
        setSelectedNode(foundGraph[0]?.data?.nodeData);
        setIsContainerVisible(true);
      },
    },
    {
      content: 'Expand',
      select: function (ele) {
        // console.log('Expanding node:', ele.id());
        const foundNode = findSelectedNode(ele.id());
        // console.log('foundNode', foundNode);
        // console.log('foundNode[0]?.data?.nodeData', foundNode[0]?.data?.nodeData);
        setNodeToExpand(foundNode[0]);
      },
    },
    {
      content: 'Go to web app',
      select: function (ele) {
        const selectedNode = findSelectedNode(ele.id());
        if (selectedNode) {
          // Todo: replace it by web_url from nodeData
          const url = selectedNode[0]?.data?.nodeData.id;
          if (url) {
            window.open(url, '_blank');
          }
        }
      },
    },
  ];

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
    if (nodeData && nodeToExpand){
      console.log('nodeData', nodeData);
      console.log('nodeToExpand', nodeToExpand);
      console.log('data', data);
      // const foundNode = findSelectedNode(nodeToExpand?.data?.nodeData?.id);
      // console.log('foundNode', foundNode);

      // let newNodes = nodeData?.nodes?.map((item) => {
      //   let nodeStyle = checkNodeStyle(item?.properties?.resource_type);
      //   if (sourceDataList?.uri === item?.properties?.id) {
      //     item.expanded = true;
      //   }
      //   return {
      //     data: {
      //       id: item.id.toString(),
      //       label: item.label,
      //       classes: 'bottom-center',
      //       nodeData: item?.properties,
      //     },
      //     style: nodeStyle ? nodeStyle : {},
      //   };
      // });
      // console.log('newNodes', newNodes);
      //
      // let newEdges = nodeData?.edges?.map((item) => {
      //   return {
      //     data: {
      //       source: item.from.toString(),
      //       target: item.to.toString(),
      //       label: item.label,
      //       classes: 'autorotate',
      //     },
      //   };
      // });
      // newNodes = newNodes.concat(newEdges);
      //
      // return newNodes ? newNodes : [];
    }
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
          // style: {
          //   'background-color': 'red',
          // },
        };
      });
      // console.log('nodeData', nodeData);
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
  }, [data, nodeData, nodeToExpand]);

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
                  elements={memoizedData}
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
        {selectedNode && isContainerVisible && (
          <div ref={containerRef} className={nodeInfoContainer}>
            <ExternalPreview nodeData={selectedNode} fromGraphView={true} />
          </div>
        )}
      </div>
    </>
  );
};

export default CytoscapeGraphView;
