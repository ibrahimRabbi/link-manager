const treeData = [
  {
    id: '1',
    labelName: 'Category 1',
    status: 'valid',
    link_type: 'SatisfiedBy',
    children: [
      {
        id: '1-1',
        labelName: 'Category 1-1',
        link_type: 'ElaboratedBy',
        count: 100,
        children: [
          {
            id: '1-1-1',
            labelName: 'Category 1-1-1',
            link_type: 'AffectedBy',
            count: 50,
            children: [
              {
                id: '1-1-1-1',
                labelName: 'Category 1-1-1-1',
                link_type: 'AffectedBy',
                count: 25,
                children: [
                  {
                    id: '1-1-1-1-1',
                    labelName: 'Category 1-1-1-1-1',
                    link_type: 'ValidatedBy',
                    count: 12,
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
  {
    id: '2',
    labelName: 'Category 2',
    status: 'valid',
    link_type: 'ConstraintBy',
    children: [
      {
        id: '2-1',
        labelName: 'Category 2-1',
        link_type: 'ElaboratedBy',
        count: 2100,
        children: [
          {
            id: '2-1-1',
            labelName: 'Category 2-1-1',
            link_type: 'AffectedBy',
            count: 250,
            children: [
              {
                id: '2-1-1-1',
                labelName: 'Category 2-1-1-1',
                link_type: 'AffectedBy',
                count: 225,
                children: [
                  {
                    id: '2-1-1-1-1',
                    labelName: 'Category 2-1-1-1-1',
                    link_type: 'ValidatedBy',
                    count: 212,
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
];
export default treeData;
