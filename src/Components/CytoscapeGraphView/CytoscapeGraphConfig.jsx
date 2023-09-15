export const graphLayout = {
  name: 'breadthfirst',
  spacingFactor: 1.85, // Adjust this value to control node separation
  padding: 150,
  avoidOverlap: true,
};

export const graphStyle = [
  {
    selector: 'node',
    style: {
      label: 'data(label)',
      width: 50,
      height: 50,
      'text-valign': 'bottom',
      'background-color': '#fff',
      'background-image': 'data(nodeData.image)',
      'border-color': '#2c4dc0',
      'border-width': 0,
      'border-opacity': 0.5,
      'background-size': 'contain',
    },
  },
  {
    selector: 'node[label]',
    style: {
      label: 'data(label)',
      'text-background-color': '#ffffff',
      'text-background-opacity': 0.8,
      'text-background-padding': '5px',
    },
  },
  {
    selector: 'edge',
    style: {
      width: 3,
      'curve-style': 'straight',
      'target-arrow-shape': 'triangle',
      'edge-text-rotation': 'autorotate',
    },
  },
  {
    selector: 'edge[label]',
    style: {
      label: 'data(label)',
      width: 4,
      'text-background-color': '#ffffff', // Set the background color
      'text-background-opacity': 0.8, // Make the background opaque
      'text-background-padding': '5px',
    },
  },
  {
    selector: 'edge.bezier',
    style: {
      'curve-style': 'bezier',
      'control-point-step-size': 40,
    },
  },
  {
    selector: 'edge.unbundled-bezier',
    style: {
      'curve-style': 'unbundled-bezier',
      'control-point-distances': 40,
      'control-point-weights': 0.5,
    },
  },
  {
    selector: 'edge.multi-unbundled-bezier',
    style: {
      'curve-style': 'unbundled-bezier',
      'control-point-distances': [40, -40],
      'control-point-weights': [0.25, 0.75],
    },
  },
  {
    selector: 'edge.haystack',
    style: {
      'curve-style': 'haystack',
      'haystack-radius': 0.5,
    },
  },
  {
    selector: 'edge.segments',
    style: {
      'curve-style': 'segments',
      'segment-distances': [40, -40],
      'segment-weights': [0.25, 0.75],
    },
  },
  {
    selector: 'edge.taxi',
    style: {
      'curve-style': 'taxi',
      'taxi-direction': 'downward',
      'taxi-turn': 20,
      'taxi-turn-min-distance': 5,
    },
  },
  {
    selector: 'edge.straight-triangle',
    style: {
      'curve-style': 'straight-triangle',
      width: 10,
    },
  },
];
