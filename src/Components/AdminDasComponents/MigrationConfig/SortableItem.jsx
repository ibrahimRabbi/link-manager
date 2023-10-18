import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Panel } from 'rsuite';

const SortableItem = ({ property }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: property.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };
  return (
    <div>
      <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
        <Panel style={{ height: 'fix-content' }} bordered>
          {property.name}
        </Panel>
      </div>
    </div>
  );
};

export default SortableItem;
