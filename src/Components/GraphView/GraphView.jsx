import React from 'react';
// import ReactGraph from 'react-graph';
import nodesData from './nodesData';
import relationshipsData from './relationshipsData';
import rootData from './rootData';

const GraphView = () => {
  console.log(rootData);
  console.log(nodesData);
  console.log(relationshipsData);
  return (
    <div>
      <h3>This is Graph view</h3>
      <div>
        {/* <ReactGraph
          initialState={rootData}
          nodes={nodesData}
          relationships={relationshipsData}
          width="100%"
          height="100%"
          hasLegends
          hasInspector
          hasTruncatedFields
        /> */}
        {/* <iframe src={'http://localhost:3000'} width={'100%'} height={'700px'}></iframe> */}
      </div>
    </div>
  );
};

export default GraphView;