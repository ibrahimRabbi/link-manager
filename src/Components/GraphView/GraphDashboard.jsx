import React, { useMemo, useState } from 'react';
import ReactGraph from 'react-graph';
// import { PageWrapper, ReactGraphWrapper } from './components/common/Organisms';
import { SideBar } from './components/sidebar/Sidebar';
import { SearchBar } from './components/searchBar/SearchBar';
import { InspectorBar as InfoPanel } from './components/inspector/InspectorBar';

const GraphDashboard = (props) => {
  const [graphState, setGraphState] = useState({
    nodes: [],
    relationships: [],
  });
  const [addedNodes, setAddedNodes] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState(null);
  const [checkedNodesLabels, setCheckedNodesLabels] = useState([]);
  const [checkedRelationshipsLabels, setCheckedRelationshipsLabels] = useState([]);
  const [dataOnInspect, setDataOnInspect] = useState({
    hoveredItem: {},
    selectedItem: {},
  });

  const [styles, setStyles] = useState({ nodes: {}, relationships: {} });

  const selectOptions = useMemo(
    () =>
      props.nodes.map((node) => {
        if (node.properties && node.properties.name) {
          return {
            label: node.properties.name,
            value: node.id,
          };
        }
      }),
    // TODO: Optimize deep comparison to big data
    [JSON.stringify(props.nodes)],
  );

  const nodesLabels = useMemo(() => {
    const labels = new Set();
    props.nodes.map((node) => {
      if (node.labels) {
        node.labels.map((label) => {
          labels.add(label);
        });
      }
    });

    return Array.from(labels);
    // TODO: Optimize deep comparison to big data
  }, [JSON.stringify(props.nodes)]);

  const relationshipsLabels = useMemo(() => {
    const labels = new Set();
    props.relationships.map((relationship) => {
      if (relationship.type) {
        labels.add(relationship.type);
      }
    });

    return Array.from(labels);
    // TODO: Optimize deep comparison to big data
  }, [JSON.stringify(props.relationships)]);

  const handleSelectChange = (selectedOption) => {
    let selectedNodes;

    if (selectedOption) {
      selectedNodes = selectedOption.map((option) => props.nodesIdMap[option.value]);
    }
    setSelectedOptions(selectedOption);
    setAddedNodes(selectedNodes);
  };

  const handleNodeLabelsCheckBoxChange = (event) => {
    const { value, checked } = event.target;
    let stateChecked = checkedNodesLabels;

    if (checked) {
      // @ts-ignore
      stateChecked.push(value);
    } else {
      stateChecked = stateChecked.filter((e) => e !== value);
    }

    // TODO: Improve filter to reduce time complexity
    const nodes = props.nodes.filter((node) => {
      const hasNodeAnyCheckedLabelList = stateChecked.filter((checkLabel) =>
        node.labels.includes(checkLabel),
      );

      return hasNodeAnyCheckedLabelList.length;
    });

    // @ts-ignore
    setGraphState({ nodes, relationships: [] });
    setCheckedNodesLabels(stateChecked);
    setCheckedRelationshipsLabels([]);
    setSelectedOptions(null);
    setAddedNodes([]);
  };

  const handleRelationshipsLabelsCheckBoxChange = (event) => {
    const { value, checked } = event.target;
    let stateChecked = checkedRelationshipsLabels;

    if (checked) {
      // @ts-ignore
      stateChecked.push(value);
      // @ts-ignore
      const nodes = [];
      const relationships = [];
      props.relationships.map((relationship) => {
        // @ts-ignore
        if (checkedRelationshipsLabels.includes(relationship.type)) {
          // @ts-ignore
          nodes.push(props.nodesIdMap[relationship.startNodeId]);
          // @ts-ignore
          nodes.push(props.nodesIdMap[relationship.endNodeId]);
          relationships.push(relationship);
        }
      });
      // @ts-ignore
      setGraphState({ nodes: [...graphState.nodes, ...nodes], relationships });
      setSelectedOptions(null);
      setAddedNodes([]);
    } else {
      stateChecked = stateChecked.filter((e) => e !== value);
      const relationships = graphState.relationships.filter(
        (relationship) => relationship.type !== value,
      );
      setGraphState({ ...graphState, relationships });
      setSelectedOptions(null);
      setAddedNodes([]);
    }
    setCheckedRelationshipsLabels(stateChecked);
    setCheckedNodesLabels([]);
  };

  return (
    <div>
      <div style={{ display: 'flex', flex: 1, height: '95vh' }}>
        <SideBar
          nodesLabels={nodesLabels}
          relationshipsLabels={relationshipsLabels}
          handleNodeLabelsCheckBoxChange={handleNodeLabelsCheckBoxChange}
          handleRelationshipsCheckBoxChange={handleRelationshipsLabelsCheckBoxChange}
          checkedNodesLabels={checkedNodesLabels}
          checkedRelationshipsLabels={checkedRelationshipsLabels}
          styles={styles}
        />
        <div style={{ flex: 1, borderLeft: '1px solid lightgray' }}>
          <SearchBar
            selectOptions={selectOptions}
            selectedOptions={selectedOptions}
            handleSelectChange={handleSelectChange}
          />
          <div style={{ height: '86vh' }}>
            <ReactGraph
              initialState={graphState}
              nodes={props.nodes}
              relationships={props.relationships}
              addedNodes={addedNodes}
              onInspect={setDataOnInspect}
              onStyleChange={setStyles}
              width="100%"
              height="100%"
              hasLegends
              hasTruncatedFields
            />
          </div>
        </div>
      </div>
      <InfoPanel dataOnInspect={dataOnInspect} styles={styles} />
    </div>
  );
};

export default GraphDashboard;
