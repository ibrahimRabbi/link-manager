import React from 'react';
import { Message, useToaster } from 'rsuite';

const Notification = ({ type, message, setNotificationType, setNotificationMessage }) => {
  const toaster = useToaster();

  const showNotification = (type, message) => {
    const messages = (
      <Message closable showIcon type={type}>
        {message}
      </Message>
    );
    toaster.push(messages, { placement: 'bottomCenter', duration: 5000 });
  };

  // Call the showNotification function when the component mounts
  React.useEffect(() => {
    if (type && message) {
      showNotification(type, message);
      setNotificationMessage('');
      setNotificationType('');
    }
  }, [type, message, setNotificationMessage, setNotificationType]);

  return null;
};

export default Notification;
