import React from 'react';
import Cytoscape from 'react-cytoscapejs';

export const addNodeLabel = (nodeLabel, codeBlock, graphView = false) => {
  let MAX_LENGTH = 30;
  if (graphView) {
    MAX_LENGTH = 7;
  }
  if (codeBlock && codeBlock !== '' && codeBlock !== 'None') {
    if (nodeLabel && nodeLabel?.length > MAX_LENGTH) {
      return nodeLabel.slice(0, MAX_LENGTH - 1) + '... [' + codeBlock + ']';
    } else {
      return nodeLabel + ' [' + codeBlock + ']';
    }
  }
  if (nodeLabel) {
    if (nodeLabel?.length > MAX_LENGTH) {
      return nodeLabel.slice(0, MAX_LENGTH - 1) + '...';
    } else {
      return nodeLabel;
    }
  }
  return '...';
};

const Graph = ({ props }) => {
  const { data, graphLayout, graphStyle, contextMenuCommands, cyRef } = props;

  // Define your function to be executed when the cursor is placed on a node
  const handleMouseOver = (node) => {
    // Update the label with the property
    if (node?._private?.data?.nodeData?.name) {
      node.data('label', node?._private?.data?.nodeData?.name);
      node.emit('data');
    }
  };

  // Define your function to be executed when the cursor moves away from a node
  const handleMouseOut = (node) => {
    // Revert the label to the original value
    const originalLabel = node?._private?.data?.nodeData?.name;
    const codeBlock = node?._private?.data?.nodeData?.selected_lines;
    node.data('label', addNodeLabel(originalLabel, codeBlock, true));
    // Refresh the node to apply the label change
    node.emit('data');
  };

  return (
    <Cytoscape
      containerID="cy"
      elements={data}
      layout={graphLayout}
      stylesheet={graphStyle}
      style={{ width: '99%', height: '99vh' }}
      cy={(cy) => {
        cyRef.current = cy;
        cy.minZoom(0.1);
        cy.maxZoom(10);
        cy.cxtmenu({
          selector: 'node',
          commands: contextMenuCommands,
        });
        cy.layout(graphLayout).run();
        cy.fit(10); // Adjust the padding as needed

        // Bind the functions to the 'mouseover' and 'mouseout' events on nodes
        cy.on('mouseover', 'node', (event) => {
          const node = event.target;
          handleMouseOver(node);
        });

        cy.on('mouseout', 'node', (event) => {
          const node = event.target;
          handleMouseOut(node);
        });
      }}
    />
  );
};

export default Graph;
