import clientMessages from './responseMsg';
import { toast } from 'react-hot-toast';
// import Toaster from '../../Components/Shared/Toaster';

export default async function postAPI({ url, token, bodyData }) {
  const response = await fetch(`${url}`, {
    method: 'POST',
    headers: {
      'Content-type': 'application/json',
      authorization: 'Bearer ' + token,
    },
    body: JSON.stringify(bodyData),
  })
    .then((res) => {
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
      // if links not created we need return a value
      return 'Link creating Failed';
    })
    .catch((error) => clientMessages({ isErrCatch: true, error }));
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
  })
    .then((res) => {
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
      // if links not created we need return a value
      return 'Link creating Failed';
    })
    .catch((error) => toast.error(error));
  return response;
}
