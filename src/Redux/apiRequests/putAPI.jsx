import { toast } from 'react-hot-toast';

export default async function putAPI({ url, token, bodyData }) {
  const response = await fetch(`${url}`, {
    method: 'PUT',
    headers: {
      'Content-type': 'application/json',
      authorization: 'Bearer ' + token,
    },
    body: JSON.stringify(bodyData),
  })
    .then(async (res) => {
      if (res.ok) {
        return res.json().then((data) => {
          // Toaster(data);
          toast.success(data.message);
          return data;
        });
      } else {
        if (res.status === 304) {
          return res.json().then((data) => {
            toast.error(data.message);
          });
        } else if (res.status === 400) {
          return res.json().then((data) => {
            toast.error(data.message);
          });
        } else if (res.status === 401) {
          return res.json().then((data) => {
            toast.error(data.message);
          });
        } else if (res.status === 403) {
          return res.json().then((data) => {
            toast.error(data.message);
          });
        } else if (res.status === 409) {
          return res.json().then((data) => {
            toast.error(data.message);
          });
        } else if (res.status === 500) {
          toast.error('Internal Server error');
        }
      }
    })
    .catch((error) => toast.error(error));

  return response;
}
export async function putAPIForm({ url, token, bodyData }) {
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
  })
    .then(async (res) => {
      if (res.ok) {
        const data = await res.json();
        toast.success(data.message);
        return data;
      } else {
        if (res.status === 304) {
          return res.json().then((data) => {
            toast.error(data.message);
          });
        } else if (res.status === 400) {
          return res.json().then((data) => {
            toast.error(data.message);
          });
        } else if (res.status === 401) {
          return res.json().then((data) => {
            toast.error(data.message);
          });
        } else if (res.status === 403) {
          return res.json().then((data) => {
            toast.error(data.message);
          });
        } else if (res.status === 409) {
          return res.json().then((data) => {
            toast.error(data.message);
          });
        } else if (res.status === 500) {
          toast.error('Internal Server error');
        }
      }
    })
    .catch((error) => toast.error(error));

  return response;
}
