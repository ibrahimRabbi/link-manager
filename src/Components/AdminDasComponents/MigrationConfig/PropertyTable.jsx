/* eslint-disable indent */
import React, { useEffect } from 'react';
import PlusIcon from '@rsuite/icons/Plus';
import { Button, Col, FlexboxGrid, IconButton, Table } from 'rsuite';
import UseReactSelect from '../../Shared/Dropdowns/UseReactSelect';
import { useState } from 'react';
import { MdEdit } from 'react-icons/md';
const { Column, HeaderCell, Cell } = Table;

const PropertyTable = ({
  rows,
  source,
  target,
  setRows,
  setSource,
  setTarget,
  setShowAddEnum,
  property,
  showNotification,
}) => {
  const [open, setOpen] = useState(false);
  const [editingRow, setEditingRow] = useState(null);
  const [formState, setFormState] = useState({
    source_property: '',
    target_property: '',
    source_datatype: '',
    target_datatype: '',
  });
  const [updateTarget, setUpdateTarget] = useState([]);
  const [sourceEnum, setSourceEnum] = useState('');
  const [targetEnum, setTargetEnum] = useState('');

  useEffect(() => {
    const toCamelCase = (str) => {
      const camelCaseStr = str.replace(/[-_](.)/g, (_, char) => char.toUpperCase());
      return camelCaseStr.charAt(0).toUpperCase() + camelCaseStr.slice(1);
    };
    const updatedApiResponse = property?.map((obj) => ({
      ...obj,
      source_name: toCamelCase(obj?.source_property),
      target_name: toCamelCase(obj?.target_property),
      enum_mapping: {},
    }));
    setRows(updatedApiResponse);
  }, [property]);
  const updateTargetDropdown = (selectedItem) => {
    if (selectedItem?.source_name) {
      const editDataType = selectedItem.source_datatype;
      const editFilteredTarget = target.filter((item) => item.datatype === editDataType);
      setUpdateTarget(editFilteredTarget);
    } else {
      const dataType = selectedItem.datatype;
      const filteredTargetOptions = target.filter((item) => item.datatype === dataType);
      setUpdateTarget(filteredTargetOptions);
    }
  };
  const handleSourcePro = (selectedItem) => {
    if (selectedItem?.datatype === 'enum') {
      setSourceEnum(selectedItem);
    }
    setFormState({
      ...formState,
      source_property: selectedItem?.id,
      source_name: selectedItem?.name,
      source_datatype: selectedItem?.datatype,
    });
    updateTargetDropdown(selectedItem);
  };

  const handleTargetPro = (selectedItem) => {
    if (selectedItem?.datatype === 'enum') {
      setTargetEnum(selectedItem);
    }
    setFormState({
      ...formState,
      target_property: selectedItem?.id,
      target_name: selectedItem?.name,
      target_datatype: selectedItem?.datatype,
    });
  };

  const isButtonDisabled = !formState.source_property || !formState.target_property;

  const handleSubmit = () => {
    const newRow = {
      source_property: formState?.source_property,
      source_name: formState?.source_name,
      target_property: formState?.target_property,
      target_name: formState?.target_name,
      source_datatype: formState?.source_datatype,
      target_datatype: formState?.target_datatype,
      enum_mapping: {},
    };
    // Check for duplicate rows
    const isDuplicate = rows.some(
      (row) =>
        row.source_property === newRow.source_property &&
        row.target_property === newRow.target_property &&
        row.source_name === newRow.source_name &&
        row.target_name === newRow.target_name &&
        row.source_datatype === newRow.source_datatype &&
        row.target_datatype === newRow.target_datatype,
    );
    if (isDuplicate) {
      showNotification('error', 'Duplicate row. Already exist data!!!!.');
      return;
    }

    if (sourceEnum !== '' && targetEnum !== '') {
      setShowAddEnum(true);
      setSource(sourceEnum);
      setTarget(targetEnum);
    } else {
      setShowAddEnum(false);
    }
    if (editingRow) {
      const updatedRows = rows.map((row) =>
        row === editingRow ? { ...newRow, enum_mapping: editingRow.enum_mapping } : row,
      );
      setRows(updatedRows);
      setEditingRow(null);
    } else {
      setRows([...rows, newRow]);
    }
    setFormState({
      source_property: '',
      target_property: '',
      source_datatype: '',
      target_datatype: '',
    });
    setSourceEnum('');
    setTargetEnum('');
    setOpen(false);
  };

  const handleEditClick = (rowData) => {
    setEditingRow(rowData);

    const updatedFormState = {
      source_property: rowData.source_property,
      source_name: rowData.source_name,
      target_property: rowData.target_property,
      target_name: rowData.target_name,
      source_datatype: rowData.source_datatype,
      target_datatype: rowData.target_datatype,
    };
    setFormState(updatedFormState);
    setTimeout(() => {
      updateTargetDropdown(rowData);
    }, 0);

    setOpen(true);
  };

  const handleCancelEdit = () => {
    setEditingRow(null);
    setOpen(false);
    setFormState({});
    setUpdateTarget([]);
  };
  const handleSubmitEdit = () => {
    const isDuplicateUpdate = rows.some(
      (row) =>
        row !== editingRow &&
        row.source_property === formState.source_property &&
        row.target_property === formState.target_property &&
        row.source_name === formState.source_name &&
        row.target_name === formState.target_name &&
        row.source_datatype === formState.source_datatype &&
        row.target_datatype === formState.target_datatype,
    );

    if (isDuplicateUpdate) {
      showNotification('error', 'Cannot update. Already exist data!!!!.');
      return;
    }

    const updatedRows = rows.map((row) =>
      row === editingRow
        ? {
            ...row,
            source_property: formState.source_property,
            source_name: formState.source_name,
            target_property: formState.target_property,
            target_name: formState.target_name,
            source_datatype: formState.source_datatype,
            target_datatype: formState.target_datatype,
            enum_mapping: {},
          }
        : row,
    );
    setRows(updatedRows);
    handleCancelEdit();
  };

  return (
    <div>
      <div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Table
            data={rows}
            autoHeight
            virtualized
            bordered
            width={600}
            headerHeight={50}
            style={{ position: 'static' }}
          >
            <Column
              width={250}
              style={{
                fontSize: '17px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: '700',
              }}
              align="center"
            >
              <HeaderCell>
                <h6>Source</h6>
              </HeaderCell>
              <Cell dataKey="source_name" />
            </Column>
            <Column
              width={250}
              style={{
                fontSize: '17px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: '700',
              }}
            >
              <HeaderCell>
                <h6>Target</h6>
              </HeaderCell>
              <Cell dataKey="target_name" />
            </Column>
            <Column
              width={100}
              style={{
                fontSize: '17px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: '700',
              }}
            >
              <HeaderCell>
                <h6>Action</h6>
              </HeaderCell>
              <Cell>
                {(rowData) => (
                  <IconButton
                    style={{ cursor: 'pointer', padding: 5 }}
                    size="md"
                    title="Edit"
                    onClick={() => handleEditClick(rowData)}
                  >
                    <MdEdit />
                  </IconButton>
                )}
              </Cell>
            </Column>
          </Table>
        </div>
        {!open ? (
          <div
            style={{
              height: '50px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <span
              onClick={() => {
                setOpen(true);
                setShowAddEnum(false);
              }}
              style={{
                marginLeft: '10px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <PlusIcon style={{ marginBottom: '4px', fontSize: '20px' }} />
              <h5>Add a mapping</h5>
            </span>
          </div>
        ) : (
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              height: '70px',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '70px',
                width: '100%',
              }}
            >
              <div style={{ width: '20%' }}>
                <FlexboxGrid>
                  <FlexboxGrid.Item colspan={24}>
                    <FlexboxGrid justify="start">
                      <FlexboxGrid.Item
                        as={Col}
                        colspan={24}
                        style={{ paddingLeft: '0' }}
                      >
                        <UseReactSelect
                          name="application_type"
                          placeholder="Choose property"
                          onChange={handleSourcePro}
                          items={source?.length ? source : []}
                          value={formState?.source_name}
                        />
                      </FlexboxGrid.Item>
                    </FlexboxGrid>
                  </FlexboxGrid.Item>
                </FlexboxGrid>
              </div>
              <div style={{ width: '20%' }}>
                <FlexboxGrid>
                  <FlexboxGrid.Item colspan={24}>
                    <FlexboxGrid justify="start">
                      <FlexboxGrid.Item
                        as={Col}
                        colspan={24}
                        style={{ paddingLeft: '0' }}
                      >
                        <UseReactSelect
                          name="application_type"
                          placeholder="Choose property"
                          onChange={handleTargetPro}
                          items={updateTarget?.length ? updateTarget : []}
                          value={formState?.target_name}
                        />
                      </FlexboxGrid.Item>
                    </FlexboxGrid>
                  </FlexboxGrid.Item>
                </FlexboxGrid>
              </div>
              <div>
                <Button
                  onClick={editingRow ? handleSubmitEdit : handleSubmit}
                  appearance="primary"
                  disabled={isButtonDisabled}
                >
                  {editingRow ? 'Save' : 'Ok'}
                </Button>
                {editingRow && (
                  <Button onClick={handleCancelEdit} appearance="subtle">
                    Cancel
                  </Button>
                )}
                {!editingRow && (
                  <Button onClick={() => setOpen(false)} appearance="subtle">
                    Cancel
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PropertyTable;
