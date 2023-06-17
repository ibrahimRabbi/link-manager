export default async function deleteAPI({ url, token, showNotification }) {
  const response = await fetch(`${url}`, {
    method: 'DELETE',
    headers: {
      'Content-type': 'application/json',
      authorization: 'Bearer ' + token,
    },
  }).then((res) => {
    if (res.ok) {
      if (res.status === 204) {
        showNotification('success', 'Successfully deleted');
        return res;
      }
    } else {
      if (res.status === 401) {
        return res.json().then((data) => {
          showNotification('error', data.message);
          window.location.replace('/login');
        });
      } else if (res.status === 403) {
        if (token) {
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
