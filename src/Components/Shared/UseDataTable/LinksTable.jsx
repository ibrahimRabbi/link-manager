import React from 'react';

import { useDrag, useDrop, DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Table } from 'rsuite';
import fakeData from './data.js';

const { HeaderCell, Cell, Column } = Table;

const ItemTypes = {
  COLUMN: 'column',
  ROW: 'row',
};

function DraggableHeaderCell({ children, onDrag, id, ...rest }) {
  const ref = React.useRef(null);

  const [{ canDrop, isOver }, drop] = useDrop({
    accept: ItemTypes.COLUMN,
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
    drop(item) {
      // params monitor
      onDrag(item.id, id);
    },
  });

  const [{ isDragging }, drag] = useDrag({
    item: { id },
    type: ItemTypes.COLUMN,
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });
  const isActive = canDrop && isOver;

  drag(drop(ref));

  const styles = {
    padding: '0.6rem 1rem',
    cursor: 'grab',
    opacity: isDragging ? 0 : 1,
    borderLeft: isActive ? '2px solid #2589f5' : null,
    flexGrow: 1,
  };

  return (
    <HeaderCell
      {...rest}
      style={{
        padding: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      <div ref={ref} style={styles}>
        {children}
      </div>
    </HeaderCell>
  );
}

function Row({ children, onDrag, id, rowData, ...rest }) {
  const ref = React.useRef(null);
  console.log('id, reset: ', id, rest);
  const [{ canDrop, isOver }, drop] = useDrop({
    accept: ItemTypes.ROW,
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
    drop(item) {
      // params monitor
      onDrag && onDrag(item.id, rowData.id);
    },
  });

  const [{ isDragging }, drag] = useDrag({
    item: { id: rowData.id },
    type: ItemTypes.ROW,
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });
  const isActive = canDrop && isOver;

  drag(drop(ref));

  const styles = {
    cursor: 'grab',
    opacity: isDragging ? 0.5 : 1,
    background: isActive ? '#ddd' : null,
    width: '100%',
    height: '100%',
    borderTop: isActive ? '2px solid #2589f5' : null,
  };

  return (
    <div ref={ref} style={styles}>
      {children}
    </div>
  );
}

function sort(source, sourceId, targetId) {
  const nextData = source.filter((item) => item.id !== sourceId);
  const dragItem = source.find((item) => item.id === sourceId);
  const index = nextData.findIndex((item) => item.id === targetId);

  nextData.splice(index, 0, dragItem);
  return nextData;
}

const LinksTable = ({ props }) => {
  console.log(props);
  const [data, setData] = React.useState(fakeData.filter((item, index) => index < 20));
  const [columns, setColumns] = React.useState([
    { id: 'id', name: 'Id', width: 80 },
    { id: 'firstName', name: 'First Name', width: 200 },
    { id: 'lastName', name: 'Last Name', width: 200 },
    { id: 'email', name: 'Email', width: 300, flexGrow: 1 },
  ]);

  const handleDragColumn = (sourceId, targetId) => {
    setColumns(sort(columns, sourceId, targetId));
  };

  const handleDragRow = (sourceId, targetId) => {
    setData(sort(data, sourceId, targetId));
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div>
        <Table
          height={400}
          data={data}
          bordered
          rowKey="id"
          renderRow={(children, rowData) => {
            return rowData ? (
              <Row
                key={rowData.id}
                rowData={rowData}
                id={rowData.id}
                onDrag={handleDragRow}
              >
                {children}
              </Row>
            ) : (
              children
            );
          }}
        >
          {columns.map((column) => (
            <Column
              width={column.width}
              key={column.id}
              flexGrow={column.flexGrow}
              sortable
            >
              <DraggableHeaderCell onDrag={handleDragColumn} id={column.id}>
                {column.name}
              </DraggableHeaderCell>
              <Cell dataKey={column.id} />
            </Column>
          ))}
        </Table>
      </div>
    </DndProvider>
  );
};

export default LinksTable;
