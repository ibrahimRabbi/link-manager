const lmApiUrl = process.env.REACT_APP_LM_REST_API_URL;

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
  }).then(async (response) => {
    if (method === 'GET' && response.status === 204) {
      return showNotification('success', 'No content available');
    } else if (method === 'DELETE' && response.status === 204) {
      return showNotification('success', 'The content was successfully deleted');
    } else if (response.ok) {
      return response.json().then((data) => {
        showNotification('success', data.message);
        return data;
      });
    } else {
      if (response.status === 401) {
        return response.json().then((data) => {
          showNotification('error', data.message);
          window.location.replace('/login');
        });
      } else if (response.status === 403) {
        if (token) {
          showNotification('error', 'You do not have permission to access');
        } else {
          window.location.replace('/login');
        }
      } else {
        return response.json().then((data) => {
          showNotification('error', data.message);
        });
      }
    }
  });
}
