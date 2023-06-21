import React from 'react';
import { LabelsWrapper, LabelsList } from './Organisms';

const NodesLabels = (props) => (
  <LabelsWrapper>
    <LabelsList
      labels={props.nodesLabels}
      checkedLabels={props.checkedNodesLabels}
      styles={props.styles}
      handleCheckBoxChange={props.handleCheckBoxChange}
    />
  </LabelsWrapper>
);

const RelationshipsLabels = (props) => (
  <LabelsWrapper>
    <LabelsList
      labels={props.relationshipsLabels}
      checkedLabels={props.checkedRelationshipsLabels}
      styles={props.styles}
      handleCheckBoxChange={props.handleCheckBoxChange}
      borderRadius="3px"
    />
  </LabelsWrapper>
);

export { NodesLabels, RelationshipsLabels };
