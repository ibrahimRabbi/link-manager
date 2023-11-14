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
      if (res.status === 403) {
        if (authCtx?.token) {
          showNotification('error', ' You do not have permission to access');
          return false;
        }
      }

      res.json().then((data) => {
        let errorMessage = data?.message;
        if (res.status === 403) {
          errorMessage = `${res?.status} not authorized ${data?.message}`;
        }
        showNotification('error', errorMessage);
        throw new Error(errorMessage);
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
      if (res.status === 403) {
        if (token) {
          showNotification('error', 'You do not have permission to access');
          return false;
        }
      }

      res.json().then((data) => {
        let errorMessage = data?.message;
        if (res.status === 403) {
          errorMessage = `${res?.status} not authorized ${data?.message}`;
        }
        showNotification('error', errorMessage);
        throw new Error(errorMessage);
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
      if (res.status === 403) {
        if (token) {
          showNotification('error', 'You do not have permission to access');
          return false;
        }
      }

      res.json().then((data) => {
        let errorMessage = data?.message;
        if (res.status === 403) {
          errorMessage = `${res?.status} not authorized ${data?.message}`;
        }
        showNotification('error', errorMessage);
        throw new Error(errorMessage);
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
      if (res.status === 403) {
        if (token) {
          showNotification('error', 'You do not have permission to access');
          return false;
        }
      }

      res.json().then((data) => {
        let errorMessage = data?.message;
        if (res.status === 403) {
          errorMessage = `${res?.status} not authorized ${data?.message}`;
        }
        showNotification('error', errorMessage);
        throw new Error(errorMessage);
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
      if (res.status === 403) {
        if (token) {
          showNotification('error', 'You do not have permission to access');
          return false;
        }
      }

      res.json().then((data) => {
        let errorMessage = data?.message;
        if (res.status === 403) {
          errorMessage = `${res?.status} not authorized ${data?.message}`;
        }
        showNotification('error', errorMessage);
        throw new Error(errorMessage);
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
      if (res.status === 403) {
        if (token) {
          showNotification('error', 'You do not have permission to access');
          return false;
        }
      }

      res.json().then((data) => {
        let errorMessage = data?.message;
        if (res.status === 403) {
          errorMessage = `${res?.status} not authorized ${data?.message}`;
        }
        showNotification('error', errorMessage);
        throw new Error(errorMessage);
      });
    }
  });
  return response;
}
