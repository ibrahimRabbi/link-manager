const treeData = [
  {
    id: '1',
    labelName: 'Category 1',
    status: 'ENABLED',
    children: [
      {
        id: '1-1',
        labelName: 'Category 1-1',
        status: 'ENABLED',
        count: 100,
        children: [
          {
            id: '1-1-1',
            labelName: 'Category 1-1-1',
            status: 'ENABLED',
            count: 50,
            children: [
              {
                id: '1-1-1-1',
                labelName: 'Category 1-1-1-1',
                status: 'ENABLED',
                count: 25,
                children: [
                  {
                    id: '1-1-1-1-1',
                    labelName: 'Category 1-1-1-1-1',
                    status: 'ENABLED',
                    count: 12,
                    children: [
                      {
                        id: '1-1-1-1-1-1',
                        labelName: 'Category 1-1-1-1-1-1',
                        status: 'ENABLED',
                        count: 6,
                        children: [
                          {
                            id: '1-1-1-1-1-1-1',
                            labelName: 'Category 1-1-1-1-1-1-1',
                            status: 'ENABLED',
                            count: 3,
                            children: [
                              {
                                id: '1-1-1-1-1-1-1-1',
                                labelName: 'Category 1-1-1-1-1-1-1-1',
                                status: 'ENABLED',
                                count: 1,
                                children: [
                                  {
                                    id: '1-1-1-1-1-1-1-1-1',
                                    labelName: 'Category 1-1-1-1-1-1-1-1-1',
                                    status: 'ENABLED',
                                    count: 1,
                                    children: [
                                      {
                                        id: '1-1-1-1-1-1-1-1-1-1',
                                        labelName: 'Category 1-1-1-1-1-1-1-1-1-1',
                                        status: 'ENABLED',
                                        count: 1,
                                        children: [],
                                      },
                                    ],
                                  },
                                ],
                              },
                            ],
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
];
export default treeData;
