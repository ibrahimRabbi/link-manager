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
          value: `${item.id}-${enumValue.id}-${Math.random()}`,
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

  // Filter the treeData to only include child nodes
  const childNodes = treeData.reduce((accumulator, currentNode) => {
    if (currentNode.children) {
      return [...accumulator, ...currentNode.children];
    }
    return accumulator;
  }, []);

  const handleSelect = (value) => {
    const selectedNode = childNodes.find((node) => node.value === value);

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
      data={childNodes}
      defaultExpandAll
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
