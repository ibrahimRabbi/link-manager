/* eslint-disable indent */
import React from 'react';
import PlusIcon from '@rsuite/icons/Plus';
import { Button, Col, FlexboxGrid, Table } from 'rsuite';
import UseReactSelect from '../../Shared/Dropdowns/UseReactSelect';
import { useState } from 'react';
const { Column, HeaderCell, Cell } = Table;

const PropertyTable = ({
  rows,
  source,
  target,
  setRows,
  setSource,
  setTarget,
  setShowAddEnum,
}) => {
  const [open, setOpen] = useState(false);
  const [formState, setFormState] = useState({
    source_property: '',
    target_property: '',
    source_datatype: '',
    target_datatype: '',
  });
  const [updateTarget, setUpdateTarget] = useState([]);
  const [sourceEnum, setSourceEnum] = useState('');
  const [targetEnum, setTargetEnum] = useState('');
  const handleSourcePro = (selectedItem) => {
    if (selectedItem?.datatype === 'enum') {
      setSourceEnum(selectedItem);
    }
    setFormState({
      ...formState, // Spread the existing formState
      source_property: selectedItem?.id,
      source_datatype: selectedItem?.datatype,
    });
    if (selectedItem) {
      const dataType = selectedItem.datatype;
      const filteredTargetOptions = target.filter((item) => item.datatype === dataType);
      setUpdateTarget(filteredTargetOptions);
    }
  };

  const handleTargetPro = (selectedItem) => {
    if (selectedItem?.datatype === 'enum') {
      setTargetEnum(selectedItem);
    }
    setFormState({
      ...formState, // Spread the existing formState
      target_property: selectedItem?.id,
      target_datatype: selectedItem?.datatype,
    });
  };
  const isButtonDisabled = !formState.source_property || !formState.target_property;
  const handleSubmit = () => {
    // Create a new row using the current form state
    const newRow = {
      source_property: formState?.source_property,
      target_property: formState?.target_property,
      source_datatype: formState?.source_datatype,
      target_datatype: formState?.target_datatype,
      enum_mapping: {},
    };
    if (sourceEnum !== '' && targetEnum !== '') {
      setShowAddEnum(true);
      setSource(sourceEnum);
      setTarget(targetEnum);
    } else {
      setShowAddEnum(false);
    }
    setRows([...rows, newRow]);
    setFormState({
      source_property: '',
      target_property: '',
    });
    setSourceEnum('');
    setTargetEnum('');
    setOpen(false);
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
              style={{
                fontSize: '17px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: '700',
                position: 'static',
              }}
              width={300}
              align="center"
            >
              <HeaderCell>
                <h6>Source</h6>
              </HeaderCell>
              <Cell dataKey="source_property" />
            </Column>

            <Column
              style={{
                fontSize: '17px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: '700',
                position: 'static',
              }}
              width={300}
            >
              <HeaderCell>
                <h6>Target</h6>
              </HeaderCell>
              <Cell dataKey="target_property" />
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
                      {/* --- Application dropdown ---   */}
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
                      {/* --- Application dropdown ---   */}
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
                        />
                      </FlexboxGrid.Item>
                    </FlexboxGrid>
                  </FlexboxGrid.Item>
                </FlexboxGrid>
              </div>
              <div>
                <Button
                  onClick={handleSubmit}
                  appearance="primary"
                  disabled={isButtonDisabled}
                >
                  Ok
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PropertyTable;
