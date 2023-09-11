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
    .then((response) => {
      if (response.ok) {
        if (method === 'GET' && response.status === 204) {
          showNotification('success', 'No content available');
          return '';
        } else if (method === 'DELETE' && response.status === 204) {
          showNotification('success', 'The content was successfully deleted');
          return '';
        }
        return response.json().then((data) => {
          showNotification('success', data?.message);
          return data;
        });
      } else {
        if (response.status === 401) {
          response.json().then((data) => {
            showNotification('error', data.message);
            window.location.replace('/login');
          });
          return '';
        } else if (response.status === 403) {
          if (token) {
            showNotification('error', 'You do not have permission to access');
          } else {
            window.location.replace('/login');
          }
          return '';
        }

        return response.json().then((data) => {
          showNotification('error', data?.message);
          return '';
        });
      }
    })
    .catch((error) => showNotification('error', error?.message));
}
