import React from 'react';
import { Message, useToaster } from 'rsuite';

const Toaster = (res) => {
  //   const [type, setType] = React.useState('info');
  const toaster = useToaster();
  if (res) {
    const message = (
      <Message closable showIcon type="success">
        {res.message}
      </Message>
    );
    toaster.push(message, { placement: 'bottomCenter', duration: 5000 });
  }
  console.log(res.message);
  //   }
  //   console.log('409',);
  return <div></div>;
};

export default Toaster;
