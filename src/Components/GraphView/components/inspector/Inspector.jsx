import React, { useState, useEffect } from 'react';
import {
  StyledStatusBar,
  StatusItem,
  ContextMenuItem,
  CanvasItem,
  NodeItem,
  RelationshipItem,
} from './Organisms';

export const InspectorComponent = (props) => {
  const [graphStyle, setGraphStyle] = useState(props.graphStyle);
  const [item, setItem] = useState({
    id: '',
    label: '',
    labels: '',
    content: {},
    nodeCount: 0,
    relationshipCount: 0,
    type: '',
    properties: null,
  });
  const [type, setType] = useState('');

  useEffect(() => {
    if (props.hoveredItem && props.hoveredItem.type !== 'canvas') {
      setItem(props.hoveredItem.item);
      setType(props.hoveredItem.type);
    } else if (props.selectedItem) {
      setItem(props.selectedItem.item);
      setType(props.selectedItem.type);
    } else if (props.hoveredItem) {
      // Canvas
      setItem(props.hoveredItem.item);
      setType(props.hoveredItem.type);
    }
  }, [props.hoveredItem, props.selectedItem]);

  useEffect(() => {
    setGraphStyle(props.graphStyle);
  }, [props.graphStyle]);

  const renderInspectorContent = () => {
    if (item && type) {
      if (type === 'status-item') {
        return <StatusItem item={item} />;
      } else if (type === 'context-menu-item') {
        return <ContextMenuItem item={item} />;
      } else if (type === 'canvas') {
        return <CanvasItem item={item} hasTruncatedFields={props.hasTruncatedFields} />;
      } else if (type === 'node') {
        return <NodeItem item={item} graphStyle={graphStyle} />;
      } else if (type === 'relationship') {
        return <RelationshipItem item={item} graphStyle={graphStyle} />;
      } else {
        return 'Nothing to see here!!';
      }
    } else {
      return 'Select an element to start.';
    }
  };

  return (
    <StyledStatusBar className="status-bar">{renderInspectorContent()}</StyledStatusBar>
  );
};
