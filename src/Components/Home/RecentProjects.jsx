import React from 'react';
import { Panel } from 'rsuite';

const RecentProjects = ({ recentProject }) => {
  const Card = (props) => (
    <Panel {...props} bordered shaded>
      <div style={{ margin: '10px 0 10px 0' }}>
        <h6>{props?.project?.name}</h6>
        <p style={{ marginTop: '2px' }}>{props?.project?.organization?.name}</p>
      </div>
    </Panel>
  );
  return (
    <div>
      <div
        style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gridGap: '10px' }}
      >
        {recentProject?.items?.map((project) => (
          <Card key={project?.id} project={project} />
        ))}
      </div>
    </div>
  );
};

export default RecentProjects;
