import Swal from 'sweetalert2';
import clientMessages from './responseMsg';
import { toast } from 'react-hot-toast';

export default async function getAPI({ url, token, message, authCtx }) {
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
            text: message ? message : 'No content available !!',
            icon: 'info',
            confirmButtonColor: '#3085d6',
          });
        }
      } else {
        if (res.status === 400) {
          clientMessages({ status: res.status, message: res.statusText });
        } else if (res.status === 401) {
          authCtx && authCtx.logout();
          clientMessages({ status: res.status, message: res.statusText });
        } else if (res.status === 403) {
          console.log(res.status, res.status);
        } else if (res.status === 500) {
          clientMessages({ status: res.status, message: res.statusText });
        }
      }
    })
    .catch((error) => toast.error(error));
  return response;
}
