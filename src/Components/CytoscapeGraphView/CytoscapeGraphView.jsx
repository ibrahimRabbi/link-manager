import React, { useContext, useEffect, useRef, useState } from 'react';
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
import { nodeColorStyles, nodeImageStyle } from './NodeStyles.jsx';
// eslint-disable-next-line max-len
import { showOslcData } from '../AdminDasComponents/ExternalAppIntegrations/ExternalPreview/ExternalPreviewConfig.jsx';
import UseReactSelect from '../Shared/Dropdowns/UseReactSelect.jsx';
import Graph from './Graph.jsx';
const { nodeInfoContainer } = styles;

const CytoscapeGraphView = () => {
  const { sourceDataList, isWbe } = useSelector((state) => state.links);
  const authCtx = useContext(AuthContext);
  const [selectedNode, setSelectedNode] = useState(null);
  const [nodeData, setNodeData] = useState(null);
  const [edgeData, setEdgeData] = useState([]);
  const [openedExternalPreview, setOpenedExternalPreview] = useState(false);
  const [expandedNodeData, setExpandedNodeData] = useState(null);
  const [expandNode, setExpandNode] = useState(false);
  const [filteredElements, setFilteredElements] = useState([]);

  const [selectedResourceType, setSelectedResourceType] = useState([]);
  const [selectedApplications, setSelectedApplications] = useState([]);

  const dispatch = useDispatch();
  const containerRef = useRef(null);
  const graphContainerRef = useRef(null);
  const cyRef = useRef(null);
  const useNodeColors = false;

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
    queryKey: ['cytoscape-graph'],
    queryFn: () =>
      fetchAPIRequest({
        urlPath: `link/visualize/staged?start_node_id=${encodeURIComponent(
          sourceDataList?.uri ? sourceDataList?.uri : '',
        )}&direction=outgoing&max_depth_outgoing=1`,
        token: authCtx.token,
        showNotification: showNotification,
        method: 'GET',
      }),
  });

  const [node_id, setNodeId] = useState('');
  const fetchNodeData = async (nodeId) => {
    setNodeId(nodeId);
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
    return nodeData?.find((item) => item?.data?.id === nodeId);
  };

  const handleClickOutside = (event) => {
    // Check if the click is outside the div container
    if (containerRef.current && !containerRef.current.contains(event.target)) {
      setOpenedExternalPreview(false);
    }
  };

  const contextMenuCommands = [
    {
      content: 'Show data',
      select: function (ele) {
        const foundGraph = findSelectedNode(ele.id());
        let nodeData = foundGraph?.data?.nodeData;
        if (foundGraph?.data?.nodeData?.koatl_uri) {
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
        setExpandNode(foundNode);

        // get child edges for selected node
        const childEdges = edgeData?.reduce((accumulator, item) => {
          if (foundNode?.data?.id === item?.data?.source) {
            accumulator.push(item);
          }
          return accumulator;
        }, []);

        if (childEdges?.length) {
          console.log(childEdges);

          childEdges?.forEach((item) => {
            console.log(item);

            if (filteredElements.length) {
              // eslint-disable-next-line max-len
              const filteredData = filteredElements?.filter(
                (value) => value?.data?.source !== item?.data?.source,
              );
              setFilteredElements(filteredData);
            } else {
              // eslint-disable-next-line max-len
              const filteredEdge = edgeData?.filter(
                (value) => value?.data?.source !== item?.data?.source,
              );
              setNodeData(nodeData);
              setEdgeData(filteredEdge);
            }
          });
        }
      },
    },
    {
      content: 'Go to web app',
      select: function (ele) {
        const selectedNode = findSelectedNode(ele.id());
        if (selectedNode) {
          const url = selectedNode?.data?.nodeData?.web_url
            ? selectedNode?.data?.nodeData?.web_url
            : selectedNode?.data?.nodeData?.id;
          if (url) {
            window.open(url, '_blank');
          }
        }
      },
    },
  ];

  // Set a node color and shape based on resource type
  const checkNodeStyle = (value) => {
    if (useNodeColors) {
      if (value) {
        const resourceType = value?.split('#')[1];
        for (const key in nodeColorStyles) {
          if (key === resourceType) {
            return nodeColorStyles[key];
          }
        }
      }
      return nodeColorStyles['default'];
    }
    return {};
  };

  const checkNodeImage = (value) => {
    if (!useNodeColors) {
      if (value) {
        for (const key in nodeImageStyle) {
          if (key === value) {
            return nodeImageStyle[key];
          }
        }
      }
      return nodeImageStyle['default'];
    }
    return {};
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
            nodeData: {
              ...item?.properties,
              ...checkNodeImage(
                item?.properties?.api
                  ? item?.properties?.api
                  : item?.properties?.provider,
              ),
            },
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
          },
          classes: 'unbundled-bezier',
        };
      });
      updatedNodes?.reduce((accumulator, item) => {
        if (node_id === item?.data?.nodeData?.id) {
          //
        }
        return accumulator;
      }, []);

      setExpandNode(null);
      setExpandedNodeData(null);
      setNodeData([...nodeData, ...updatedNodes]);
      setEdgeData([...edgeData, ...updatedEdges]);
    }
  }, [expandedNodeData]);

  // Request data of the node to expand
  useEffect(() => {
    if (expandNode && !expandNode?.data?.nodeData?.childData) {
      let updatedGraphData = nodeData.map((item) => {
        if (item?.data?.id === expandNode?.data?.id) {
          item.data.nodeData.childData = true;
        }
        return item;
      });
      setNodeData(updatedGraphData);
      fetchNodeData(expandNode?.data?.nodeData?.id);
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
      // map nodes
      let nodes = data?.data?.nodes?.map((item) => {
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
            nodeData: {
              ...item?.properties,
              childData: sourceDataList?.uri === item?.properties?.id,
              ...checkNodeImage(
                item?.properties?.api
                  ? item?.properties?.api
                  : item?.properties?.provider,
              ),
            },
          },
          style: nodeStyle ? nodeStyle : {},
        };
      });

      // map edges
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

      setNodeData(nodes ? nodes : []);
      setEdgeData(edges ? edges : []);
    }
  }, [data]);

  // handle select onChange
  const performFiltering = () => {
    const sourceData = {};
    let filteredNodes = [];
    filteredNodes = nodeData?.reduce((accumulator, item) => {
      // get source node
      if (item?.data?.nodeData?.id === sourceDataList?.uri) {
        sourceData['sourceNode'] = item;
      }
      return accumulator;
    }, []);

    if (selectedApplications?.length > 0) {
      filteredNodes = nodeData?.reduce((accumulator, item) => {
        selectedApplications?.forEach((value) => {
          // filter nodes and edges
          if (value?.name === item?.data?.nodeData?.api) {
            accumulator.push(item);
          }
        });
        return accumulator;
      }, []);
    } else {
      filteredNodes = nodeData;
    }

    if (selectedResourceType?.length > 0) {
      filteredNodes = filteredNodes?.reduce((accumulator, item) => {
        selectedResourceType?.forEach((value) => {
          if (value?.name === item?.data?.nodeData?.resource_type) {
            accumulator.push(item);
          }
        });
        return accumulator;
      }, []);
    }

    filteredNodes = [sourceData?.sourceNode, ...filteredNodes];

    const filteredNodeIds = filteredNodes?.map((item) => item?.data?.id);

    const filteredEdges = edgeData?.reduce((accumulator, item) => {
      if (
        filteredNodeIds.includes(item?.data?.source) &&
        filteredNodeIds.includes(item?.data?.target)
      ) {
        accumulator.push(item);
      }
      return accumulator;
    }, []);
    if (
      filteredNodes.length &&
      (selectedApplications?.length > 0 || selectedResourceType?.length > 0)
    )
      setFilteredElements([...filteredNodes, ...filteredEdges]);
    else {
      setFilteredElements([]);
    }
  };

  // filter target application dropdown item dynamically
  const targetDropdownItem = nodeData?.reduce((accumulator, item) => {
    const isObjectInArray = accumulator.some((value) => {
      return item?.data?.nodeData?.api === value?.name;
    });

    if (!isObjectInArray) {
      if (item?.data?.nodeData?.api) {
        accumulator.push({
          name: item?.data?.nodeData?.api,
          icon: checkNodeImage(item?.data?.nodeData?.api)?.image,
        });
      }
    }
    return accumulator;
  }, []);

  //filter resource type dropdown item dynamically
  const resourceTypeDropdownItem = nodeData?.reduce((accumulator, item) => {
    const isObjectInArray = accumulator.some((value) => {
      return item?.data?.nodeData?.resource_type === value?.name;
    });

    if (!isObjectInArray) {
      if (item?.data?.nodeData?.resource_type) {
        accumulator.push({
          name: item?.data?.nodeData?.resource_type,
          // eslint-disable-next-line max-len
          // icon: getIcon(item?.data?.nodeData?.api, item?.data?.nodeData?.resource_type),
        });
      }
    }
    return accumulator;
  }, []);

  const filterByApp = (selectedItems) => {
    setSelectedApplications(selectedItems);
  };

  const filterByResourceType = (selectedItems) => {
    setSelectedResourceType(selectedItems);
  };

  useEffect(() => {
    if (selectedApplications?.length || selectedResourceType?.length) performFiltering();
    else {
      setFilteredElements([]);
    }
  }, [selectedApplications, selectedResourceType]);

  // graph props
  const graphProps = {
    data: filteredElements.length ? filteredElements : nodeData?.concat(edgeData),
    graphLayout,
    graphStyle,
    cyRef,
    contextMenuCommands,
  };

  return (
    <div ref={graphContainerRef}>
      {isWbe && isLoading && <UseLoader />}

      {(!isWbe || (isWbe && !nodeData?.length)) && (
        <h2 className="cy_graph_empty_title">
          {isWbe ? 'No content available for this source' : 'No links created until now.'}
        </h2>
      )}

      {isWbe && data && (
        <>
          {nodeData && (
            <>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '50% 50%',
                  gap: '10px',
                  width: '95%',
                  margin: '10px auto',
                }}
              >
                <UseReactSelect
                  name="node_filter-application"
                  items={targetDropdownItem}
                  onChange={filterByApp}
                  placeholder="Filter data by target applications..."
                  isMulti={true}
                />
                <UseReactSelect
                  name="node_filter-resource-type"
                  items={resourceTypeDropdownItem}
                  onChange={filterByResourceType}
                  placeholder="Filter data by resource type..."
                  isMulti={true}
                />
              </div>

              <Graph props={graphProps} />
            </>
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
  );
};

export default CytoscapeGraphView;
