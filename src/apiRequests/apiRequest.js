const lmApiUrl = import.meta.env.VITE_LM_REST_API_URL;

export default function fetchAPIRequest({
  urlPath,
  token,
  method,
  body,
  showNotification,
}) {
  const apiURL = `${lmApiUrl}/${urlPath}`;
  return fetch(apiURL, {
    method: method,
    headers: {
      'Content-Type': 'application/json',
      authorization: 'Bearer ' + token,
    },
    body: JSON.stringify(body),
  })
    .then((res) => {
      if (res.ok) {
        if (method === 'GET' && res.status === 204) {
          showNotification('success', 'No content available');
          return '';
        } else if (method === 'DELETE' && res.status === 204) {
          showNotification('success', 'The content was successfully deleted');
          return { status: 'success', message: 'The content was successfully deleted' };
        }
        return res.json().then((data) => {
          showNotification('success', data?.message);
          return data;
        });
      } else {
        res.json().then((data) => {
          if (res?.status === 404 || res.status === 409) {
            showNotification('info', data?.message);
            return false;
          } else if (res.status === 403) {
            if (token) {
              showNotification('error', 'You do not have permission to access');
              return false;
            } else {
              const errorMessage = `${res?.status} not authorized ${data?.message}`;
              showNotification('error', errorMessage);
              throw new Error(errorMessage);
            }
          }
          showNotification('error', data?.message);
          throw new Error(data?.message);
        });
      }
    })
    .catch((error) => {
      showNotification('error', error?.message);
      throw new Error(error?.message);
    });
}
