const lmApiUrl = process.env.REACT_APP_LM_REST_API_URL;

export default function fetchAPIRequest({ urlPath, token, method, body }) {
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
      return console.log('Success');
    } else if (method === 'DELETE' && response.status === 204) {
      return console.log('Deleted');
    } else if (response.ok) {
      return response.json().then((data) => {
        return data;
      });
    } else {
      if (response.status === 401) {
        return response.json().then((data) => {
          console.log(data.message);
          window.location.replace('/login');
        });
      } else if (response.status === 403) {
        if (token) {
          console.log('error', 'You do not have permission to access');
        } else {
          window.location.replace('/login');
        }
      } else {
        return response.json().then((data) => {
          console.log('error', data.message);
        });
      }
    }
  });
}
