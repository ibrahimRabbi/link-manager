import React from 'react';
import PlusIcon from '@rsuite/icons/Plus';
import { Button, Col, FlexboxGrid, Table } from 'rsuite';
import { useState } from 'react';
import UseReactSelect from '../../Shared/Dropdowns/UseReactSelect';
const { Column, HeaderCell, Cell } = Table;

const EnumValueTable = ({
  rows,
  source,
  target,
  setRows,
  setSource,
  setTarget,
  sourceProperty,
  TargetProperty,
  showAddEnum,
  setShowAddEnum,
}) => {
  const [open, setOpen] = useState(false);
  const [formState, setFormState] = useState({
    source: '',
    target: '',
  });
  const handleSourcePro = (selectedItem) => {
    setFormState({
      ...formState,
      source: selectedItem?.label,
    });
  };

  const handleTargetPro = (selectedItem) => {
    setFormState({
      ...formState,
      target: selectedItem?.label,
    });
  };
  const isButtonDisabled = !formState.source || !formState.target;
  const handleSubmit = () => {
    const newRow = {
      source: formState?.source,
      target: formState?.target,
    };

    const updatedSource = sourceProperty.map((item) => {
      if (item.datatype === 'enum') {
        const updatedEnumValues = item.enum_values.filter(
          (enumValue) => enumValue.name !== formState.source,
        );
        return {
          ...item,
          enum_values: updatedEnumValues,
        };
      } else {
        return item;
      }
    });

    const updatedTarget = TargetProperty.map((item) => {
      if (item.datatype === 'enum') {
        const updatedEnumValues = item.enum_values.filter(
          (enumValue) => enumValue.name !== formState.target,
        );
        return {
          ...item,
          enum_values: updatedEnumValues,
        };
      } else {
        return item;
      }
    });

    setRows([...rows, newRow]);

    setSource(updatedSource);
    setTarget(updatedTarget);

    setFormState({
      source: '',
      target: '',
    });
    setShowAddEnum(false);
    setOpen(false);
  };

  return (
    <div>
      <div>
        <h4 style={{ textAlign: 'center' }}>Enum Value Mapping</h4>
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
          >
            <Column
              style={{
                fontSize: '17px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: '700',
              }}
              width={300}
              align="center"
            >
              <HeaderCell>
                <h6>Source Value</h6>
              </HeaderCell>
              <Cell dataKey="source" />
            </Column>

            <Column
              style={{
                fontSize: '17px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: '700',
              }}
              width={300}
            >
              <HeaderCell>
                <h6>Target Value</h6>
              </HeaderCell>
              <Cell dataKey="target" />
            </Column>
          </Table>
        </div>
        {showAddEnum && (
          <div>
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
                  onClick={() => setOpen(true)}
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
                    width: '85%',
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
                              items={source?.enum_values}
                              onChange={handleSourcePro}
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
                              items={target?.enum_values}
                              onChange={handleTargetPro}
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
        )}
      </div>
    </div>
  );
};

export default EnumValueTable;
