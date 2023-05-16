import Swal from 'sweetalert2';
// import clientMessages from './responseMsg';

export default async function deleteAPI({ url, token }) {
  const response = await fetch(`${url}`, {
    method: 'DELETE',
    headers: {
      'Content-type': 'application/json',
      authorization: 'Bearer ' + token,
    },
  })
    .then((res) => {
      if (res.ok) {
        if (res.status === 204) {
          Swal.fire({
            title: 'Deleted',
            icon: 'success',
            text: 'This data successfully deleted',
            confirmButtonColor: '#3085d6',
          });
          return res;
        }
      } else {
        if (res.status === 400) {
          console.log(res.status, res.statusText);
          // clientMessages({ status: res.status, message: res.statusText });
        } else if (res.status === 401) {
          console.log(res.status, res.statusText);
          // clientMessages({ status: res.status, message: res.statusText });
        } else if (res.status === 403) {
          console.log(res.status, res.statusText);
        } else if (res.status === 409) {
          console.log(res.status, res.statusText);
        } else if (res.status === 500) {
          console.log(res.status, res.statusText);
          // clientMessages({ status: res.status, message: res.statusText });
        }
      }
      // if links not created we need return a value
      return res;
    })
    .catch((error) => {
      console.log(error);
      // clientMessages({ isErrCatch: true, error });
    });
  return response;
}
