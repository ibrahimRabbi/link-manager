import React from 'react';
import ReactGraph from 'react-graph';
import rootData from './rootData';

const graphApiURL= `${process.env.REACT_APP_REST_API_URL}/visualize`;
const GraphView = () => {
  fetch(graphApiURL)
    .then(res=>console.log(res))
    .catch(er=>console.log(er));

  console.log(rootData);
  console.log(graphApiURL);
  return (
    <div style={{width:'100%', height:'90vh'}}>
      <ReactGraph
        initialState={rootData}
        nodes={rootData.nodes}
        relationships={rootData.relationships}
        width="100%"
        height="100%"
        hasLegends
        hasInspector
        hasTruncatedFields
      />
    </div>
  );
};

export default GraphView;
