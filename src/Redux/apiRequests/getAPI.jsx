import Swal from 'sweetalert2';
import clientMessages from './responseMsg';

export default async function getAPI({ url, token }) {
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-type': 'application/json',
      authorization: 'Bearer ' + token,
    },
  })
    .then((res) => {
      if (res.ok) {
        if (res.status !== 204) {
          return res.json();
        } else {
          Swal.fire({
            text: 'No Content Available',
            icon: 'info',
            confirmButtonColor: '#3085d6',
          });
        }
      } else {
        if (res.status === 400) {
          clientMessages({ status: res.status, message: res.statusText });
        } else if (res.status === 401) {
          clientMessages({ status: res.status, message: res.statusText });
        } else if (res.status === 403) {
          console.log(res.status, res.status);
        } else if (res.status === 500) {
          clientMessages({ status: res.status, message: res.statusText });
        }
      }
    })
    .catch((error) => clientMessages({ isErrCatch: true, error }));
  return response;
}