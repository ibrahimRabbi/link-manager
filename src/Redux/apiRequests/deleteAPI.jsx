import { toast } from 'react-hot-toast';
// import Swal from 'sweetalert2';
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
          toast.success('Successfully deleted');
          return res;
        }
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
      return res;
    })
    .catch((error) => {
      console.log(error);
      // clientMessages({ isErrCatch: true, error });
    });
  return response;
}
