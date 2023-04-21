import React from 'react';
import { Form } from 'rsuite';

const TextField = React.forwardRef((props, ref) => {
  const { name, label, reqText, accepter, ...rest } = props;
  return (
    <Form.Group controlId={`${name}-4`} ref={ref}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <Form.ControlLabel style={{ fontSize: '17px', marginBottom: '-5px' }}>
          {label}
        </Form.ControlLabel>

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

TextField.displayName = 'TextField';

export default TextField;
