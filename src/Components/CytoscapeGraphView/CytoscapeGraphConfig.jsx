export const graphLayout = {
  name: 'random',
  fit: true, // Adjust the viewport to fit the graph
  // padding: 30, // Padding around the graph
  // boundingBox: { x1: 0, y1: 0, x2: 750, y2: 1000 }, // Set the bounds of the layout
  // randomize: true, // Randomize node positions on each render
  // seed: 1234, // Use a specific seed for reproducibility
};

export const graphStyle = [
  {
    selector: 'node',
    style: {
      'background-color': '#666',
      label: 'data(label)',
      width: 50,
      height: 50,
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
