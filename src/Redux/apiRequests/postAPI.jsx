import { toast } from 'react-hot-toast';

export default async function postAPI({ url, token, bodyData }) {
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
        toast.success(data.message);
        return data;
      });
    } else {
      return res.json().then((data) => {
        toast.error(data.message);
      });
    }
  });
  return response;
}

export async function postAPIForm({ url, token, bodyData }) {
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
        toast.success(data.message);
        return data;
      });
    } else {
      return res.json().then((data) => {
        toast.error(data.message);
      });
    }
  });
  return response;
}
