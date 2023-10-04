import React from 'react';
import { Form } from 'rsuite';

const SelectField = React.forwardRef((props, ref) => {
  const { name, reqText, label, accepter, error, ...rest } = props;
  return (
    <Form.Group ref={ref} className={error ? 'has-error' : ''}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <Form.ControlLabel style={{ fontSize: '17px' }}>{label}</Form.ControlLabel>
        {reqText && <Form.HelpText tooltip>{reqText}</Form.HelpText>}
      </div>

      <Form.Control
        style={{ marginTop: '5px' }}
        name={name}
        accepter={accepter}
        {...rest}
      />
    </Form.Group>
  );
});

SelectField.displayName = 'SelectField';

export default SelectField;
