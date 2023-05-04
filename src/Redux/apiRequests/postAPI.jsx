import Swal from 'sweetalert2';
import clientMessages from './responseMsg';

export default async function postAPI({ url, token, bodyData, sendMsg }) {
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
          if (sendMsg) {
            Swal.fire({
              title: 'Success',
              icon: 'success',
              text: data.message,
              confirmButtonColor: '#3085d6',
            });
          }
          return data;
        });
      } else {
        if (res.status === 304) {
          Swal.fire({
            title: 'Already exists',
            icon: 'info',
            text: 'This User is already exists. please try to create another user',
            confirmButtonColor: '#3085d6',
          });
        } else if (res.status === 400) {
          clientMessages({ status: res.status, message: res.statusText });
        } else if (res.status === 401) {
          clientMessages({ status: res.status, message: res.statusText });
        } else if (res.status === 403) {
          console.log(res.status, res.statusText);
        } else if (res.status === 409) {
          console.log(res.status, res.statusText);
        } else if (res.status === 500) {
          clientMessages({ status: res.status, message: res.statusText });
        }
      }
      // if links not created we need return a value
      return 'Link creating Failed';
    })
    .catch((error) => clientMessages({ isErrCatch: true, error }));
  return response;
}
