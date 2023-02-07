const rootData = {
  nodes: [
    {
      id: 1,
      labels: ['label'],
      properties: {
        user: 'curran',
        createdAt: '2015-09-06T00:53:52Z',
        updatedAt: '2015-09-12T21:20:28Z',
        name: 'Fundamental Visualizations 1',
      },
    },
    {
      id: 2,
      labels: ['labe2'],
      properties: {
        user: 'curran',
        createdAt: '2015-09-05T23:44:43Z',
        updatedAt: '2015-12-08T03:55:20Z',
        name: 'Chiasm Boilerplate 2',
      },
    },
    {
      id: 3,
      labels: ['labe3'],
      properties: {
        user: 'curran',
        createdAt: '2015-09-05T23:44:43Z',
        updatedAt: '2015-12-08T03:55:20Z',
        name: 'Chiasm Boilerplate 3',
      },
    },
  ],
  relationships: [
    {
      id: 111,
      type: 'affectedBy',
      startNodeId: 1,
      endNodeId: 2,
      properties: {},
    },
    {
      id: 112,
      type: 'implementedBy',
      startNodeId: 1,
      endNodeId: 3,
      properties: {},
    },
  ],
};

export default rootData;
