/* eslint-disable indent */
/* eslint-disable max-len */
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
import styles from './CytosGraphView.module.scss';

const { nodeInfoContainer } = styles;
const CytoscapeGraphView = () => {
  // Create your graph elements and layout
  cytoscape.use(cxtmenu);
  const authCtx = useContext(AuthContext);
  const [selectedNode, setSelectedNode] = React.useState(null);
  const [isContainerVisible, setIsContainerVisible] = useState(false);
  const containerRef = useRef(null);

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

  // const layout = { name: 'preset' };
  // const layout = { name: 'random' };
  const layout = {
    name: 'random',
    // fit: true, // Adjust the viewport to fit the graph
    // padding: 30, // Padding around the graph
    // boundingBox: { x1: 0, y1: 0, x2: 800, y2: 600 }, // Set the bounds of the layout
    // randomize: true, // Randomize node positions on each render
    // seed: 1234, // Use a specific seed for reproducibility
  };

  const style = [
    {
      selector: 'node',
      style: {
        'background-color': '#666',
        label: 'data(label)',
      },
    },
    {
      selector: 'edge',
      style: {
        width: 3,
        'curve-style': 'straight',
        'target-arrow-shape': 'triangle',
      },
    },
    {
      selector: 'edge[label]',
      style: {
        label: 'data(label)',
        width: 4,
      },
    },
    {
      selector: '.autorotate',
      style: {
        'edge-text-rotation': 'autorotate',
      },
    },
  ];
  // eslint-disable-next-line max-len
  const testUri =
    'https://ui-stage.glideyoke.com/detail/CustomerProject/888d0f20-ff34-4f59-a9d0-0c81f3ea87f6/process?processInstanceId=a3403349-034e-11ee-8633-f62ce1aaf40f';
  const { data } = useQuery({
    queryKey: ['vis-graph'],
    queryFn: () =>
      fetchAPIRequest({
        urlPath: `link/visualize/staged?start_node_id=${encodeURIComponent(
          testUri,
        )}&direction=outgoing&max_depth_outgoing=4`,
        token: authCtx.token,
        showNotification: showNotification,
        method: 'GET',
      }),
  });

  const findSelectedNode = (nodeId) => {
    return memoizedData?.filter((item) => item?.data?.id === nodeId);
  };

  const handleClickOutside = (event) => {
    // Check if the click is outside the div container
    if (containerRef.current && !containerRef.current.contains(event.target)) {
      setIsContainerVisible(false);
    }
  };

  // Define the commands for the context menu
  const contextMenuCommands = [
    {
      content: 'Show data',
      select: function (ele) {
        const foundGraph = findSelectedNode(ele.id());
        console.log('foundGraph', foundGraph);
        setSelectedNode(foundGraph[0]?.data?.nodeData);
        setIsContainerVisible(true);
      },
    },
    {
      content: 'Expand',
      select: function (ele) {
        console.log('Expanding node:', ele.id());
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
            console.log(url);
            window.open(url, '_blank');
          }
        }
      },
    },
  ];

  const memoizedData = useMemo(() => {
    if (data) {
      let nodeData = data?.data?.nodes?.map((item) => {
        return {
          data: {
            id: item.id.toString(),
            label: item.label,
            classes: 'bottom-center',
            nodeData: item?.properties,
          },
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
    // Add a click event listener to the document
    document.addEventListener('click', handleClickOutside);

    return () => {
      // Cleanup: Remove the event listener when the component unmounts
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  return (
    <div style={{ height: '1000px' }}>
      <CytoscapeComponent
        elements={memoizedData}
        layout={layout}
        stylesheet={style}
        style={{ width: '100%', height: '100%' }}
        cy={(cy) => {
          // Add context menu configuration to the Cytoscape instance
          cy.cxtmenu({
            selector: 'node', // Display context menu only for nodes
            commands: contextMenuCommands,
          });
        }}
      />
      {selectedNode && isContainerVisible && (
        <div ref={containerRef} className={nodeInfoContainer}>
          <ExternalPreview nodeData={selectedNode} />
        </div>
      )}
    </div>
  );
};

export default CytoscapeGraphView;
