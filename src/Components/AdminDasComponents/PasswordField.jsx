import React, { useState } from 'react';
import { Form, InputGroup } from 'rsuite';
import EyeIcon from '@rsuite/icons/legacy/Eye';
import EyeSlashIcon from '@rsuite/icons/legacy/EyeSlash';

const PasswordField = React.forwardRef((props, ref) => {
  const [visible, setVisible] = useState(false);

  const { name, label, reqText } = props;
  return (
    <Form.Group controlId={`${name}-4`} ref={ref}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <Form.ControlLabel style={{ fontSize: '17px', marginBottom: '-5px' }}>
          {label}
        </Form.ControlLabel>

        {reqText && <Form.HelpText tooltip>{reqText}</Form.HelpText>}
      </div>

      <InputGroup style={{ marginTop: '5px', fontSize: '17px' }}>
        <Form.Control
          name={name}
          type={visible ? 'text' : 'password'}
          autoComplete="off"
        />

        <InputGroup.Addon
          onClick={() => setVisible(!visible)}
          style={{ cursor: 'pointer' }}
        >
          {visible ? <EyeIcon /> : <EyeSlashIcon />}
        </InputGroup.Addon>
      </InputGroup>
    </Form.Group>
  );
});

PasswordField.displayName = 'PasswordField';

export default PasswordField;
