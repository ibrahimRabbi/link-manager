import React, { forwardRef } from 'react';
import { Input } from 'rsuite';

const TextArea = forwardRef((props, ref) => <Input {...props} as="textarea" ref={ref} />);

TextArea.displayName = 'Textarea';

export default TextArea;
