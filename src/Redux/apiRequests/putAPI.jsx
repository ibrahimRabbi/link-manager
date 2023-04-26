import Swal from 'sweetalert2';
import clientMessages from './responseMsg';

export default async function putAPI({ url, token, bodyData, reset }) {
  const response = await fetch(`${url}`, {
    method: 'PUT',
    headers: {
      'Content-type': 'application/json',
      authorization: 'Bearer ' + token,
    },
    body: JSON.stringify(bodyData),
  })
    .then((res) => {
      reset();
      if (res.ok) {
        return res.json().then((data) => {
          Swal.fire({
            title: 'Success',
            icon: 'success',
            text: data.message,
            confirmButtonColor: '#3085d6',
          });
          return data;
        });
      } else {
        if (res.status === 400) {
          clientMessages({ status: res.status, message: res.statusText });
        } else if (res.status === 401) {
          clientMessages({ status: res.status, message: res.statusText });
        } else if (res.status === 403) {
          console.log(res.status, res.statusText);
        } else if (res.status === 404) {
          console.log(res.status, res.statusText);
        } else if (res.status === 409) {
          console.log(res.status, res.statusText);
        } else if (res.status === 500) {
          clientMessages({ status: res.status, message: res.statusText });
        }
      }
      // if links not created we need return a value
      return 'Link Updating Failed';
    })
    .catch((error) => clientMessages({ isErrCatch: true, error }));
  return response;
}