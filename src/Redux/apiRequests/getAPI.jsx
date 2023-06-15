export default async function getAPI({ url, token, message, authCtx, showNotification }) {
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-type': 'application/json',
      authorization: 'Bearer ' + token,
    },
  }).then((res) => {
    if (res.ok) {
      if (res.status !== 204) {
        return res.json();
      } else {
        showNotification('info', message ? message : 'No content available !!');
      }
    } else {
      if (res.status === 401) {
        return res.json().then((data) => {
          showNotification('error', data.message);
          window.location.replace('/login');
        });
      } else if (res.status === 403) {
        if (authCtx?.token) {
          showNotification('error', 'You do not have permission to access');
        } else {
          window.location.replace('/login');
        }
      } else {
        return res.json().then((data) => {
          showNotification('error', data.message);
        });
      }
    }
  });
  return response;
}
