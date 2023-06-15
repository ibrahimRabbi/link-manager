export default async function putAPI({ url, token, bodyData, showNotification }) {
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
      return res.json().then((data) => {
        showNotification('error', data.message);
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
      const data = await res.json();
      showNotification('success', data.message);
      return data;
    } else {
      return res.json().then((data) => {
        showNotification('error', data.message);
      });
    }
  });
  return response;
}
