import React from 'react';
import { Form } from 'rsuite';

const TextField = React.forwardRef((props, ref) => {
  const { name, label, accepter, ...rest } = props;
  return (
    <Form.Group controlId={`${name}-4`} ref={ref}>
      <Form.ControlLabel style={{ fontSize: '17px' }}>{label}</Form.ControlLabel>
      <Form.Control name={name} accepter={accepter} {...rest} />
    </Form.Group>
  );
});

TextField.displayName = 'TextField';

export default TextField;
