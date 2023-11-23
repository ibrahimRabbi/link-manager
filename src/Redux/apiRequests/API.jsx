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
      res.json().then((data) => {
        if (res.status === 403) {
          if (token) {
            showNotification('error', 'You do not have permission to access');
            return false;
          } else {
            const errorMessage = `${res?.status} not authorized ${data?.message}`;
            showNotification('error', errorMessage);
            if (authCtx) authCtx?.logout();
            throw new Error(errorMessage);
          }
        }
        showNotification('error', data?.message);
        throw new Error(data?.message);
      });
    }
  });
  return response;
}

export async function deleteAPI({ url, token, showNotification }) {
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
      res.json().then((data) => {
        if (res?.status === 404) {
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
  });
  return response;
}

export async function saveResource({ url, token, bodyData, showNotification }) {
  const response = await fetch(`${url}`, {
    method: 'POST',
    headers: {
      'Content-type': 'application/json',
      authorization: 'Bearer ' + token,
    },
    body: JSON.stringify(bodyData),
  }).then((res) => {
    if (res.ok) {
      return res.json().then((data) => {
        showNotification('success', data.message);
        return data;
      });
    } else if (res.status === 304) {
      showNotification('success', 'Resource already linked');
      return { message: 'Resource already linked' };
    } else {
      res.json().then((data) => {
        if (res.status === 409) {
          showNotification('info', data?.message);
          return false;
        }
        if (res.status === 403) {
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
  });
  return response;
}

export async function saveResourceForm({ url, token, bodyData, showNotification }) {
  const formData = new FormData();
  for (const name in bodyData) {
    if (name === 'script_path') {
      formData.append(name, bodyData[name][0]['blobFile']);
    }
    formData.append(name, bodyData[name]);
  }
  const response = await fetch(`${url}`, {
    method: 'POST',
    headers: {
      // 'Content-type': 'application/json',
      authorization: 'Bearer ' + token,
    },
    body: formData,
  }).then((res) => {
    if (res.ok) {
      return res.json().then((data) => {
        showNotification('success', data.message);
        return data;
      });
    } else {
      res.json().then((data) => {
        if (res.status === 409) {
          showNotification('info', data?.message);
          return false;
        }
        if (res.status === 403) {
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
  });
  return response;
}
export async function putAPI({ url, token, bodyData, showNotification }) {
  const response = await fetch(`${url}`, {
    method: 'PUT',
    headers: {
      'Content-type': 'application/json',
      authorization: 'Bearer ' + token,
    },
    body: JSON.stringify(bodyData),
  }).then(async (res) => {
    if (res.ok) {
      return res.json().then((data) => {
        showNotification('success', data.message);
        return data;
      });
    } else {
      res.json().then((data) => {
        if (res?.status === 404 || res.status === 409) {
          showNotification('info', data?.message);
          return false;
        }
        if (res.status === 403) {
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
  });

  return response;
}

export async function putAPIForm({ url, token, bodyData, showNotification }) {
  const formData = new FormData();
  for (const name in bodyData) {
    if (name === 'script_path') {
      formData.append(
        name,
        bodyData[name] !== null ? bodyData[name][0]['blobFile'] : Object(),
      );
    }
    formData.append(name, bodyData[name]);
  }

  const response = await fetch(`${url}`, {
    method: 'PUT',
    headers: {
      authorization: 'Bearer ' + token,
    },
    body: formData,
  }).then(async (res) => {
    if (res.ok) {
      return res.json().then((data) => {
        showNotification('success', data.message);
        return data;
      });
    } else {
      res.json().then((data) => {
        if (res.status === 404 || res.status === 409) {
          showNotification('info', data?.message);
          return false;
        }
        if (res.status === 403) {
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
  });
  return response;
}
