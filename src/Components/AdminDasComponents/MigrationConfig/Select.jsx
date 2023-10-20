import React, { useState } from 'react';
import { TreePicker } from 'rsuite';

const transformDataToTree = (values) => {
  const treeData = [];
  values = [values];

  values.forEach((item) => {
    if (item.datatype === 'enum') {
      const enumNode = {
        label: item.name,
        value: item.id,
        children: item.enum_values.map((enumValue) => ({
          label: enumValue.name,
          value: `${item.id}-${enumValue.id}`,
        })),
      };
      treeData.push(enumNode);
    } else {
      treeData.push({
        label: item.name,
        value: item.id,
      });
    }
  });

  return treeData;
};

function Select({ values, onChange }) {
  const [selectedOption, setSelectedOption] = useState(null);

  const treeData = transformDataToTree(values);

  const findNodeByValue = (nodes, targetValue) => {
    for (const node of nodes) {
      if (node.value === targetValue) {
        return node;
      }
      if (node.children) {
        const found = findNodeByValue(node.children, targetValue);
        if (found) {
          return found;
        }
      }
    }
    return null;
  };

  const handleSelect = (value) => {
    const selectedNode = findNodeByValue(treeData, value);

    if (selectedNode) {
      onChange(selectedNode);
    } else {
      // Handle the case when the value is not found
      onChange([]);
    }
  };

  return (
    <TreePicker
      style={{ width: 246 }}
      placement="topStart"
      data={treeData}
      value={selectedOption}
      cascade={false}
      onChange={(v) => {
        handleSelect(v);
        setSelectedOption(v);
      }}
    />
  );
}

export default Select;
