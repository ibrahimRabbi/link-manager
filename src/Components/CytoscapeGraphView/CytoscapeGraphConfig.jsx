export const graphLayout = {
  name: 'random',
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
