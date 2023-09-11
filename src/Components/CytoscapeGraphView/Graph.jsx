import React from 'react';
import Cytoscape from 'react-cytoscapejs';

const Graph = ({ props }) => {
  const { data, graphLayout, graphStyle, contextMenuCommands, cyRef } = props;
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
      }}
    />
  );
};

export default Graph;
