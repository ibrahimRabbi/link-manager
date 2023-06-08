import Swal from 'sweetalert2';
import { toast } from 'react-hot-toast';

export default async function getAPI({ url, token, message }) {
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-type': 'application/json',
      authorization: 'Bearer ' + token,
    },
  }).then((res) => {
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
      return res.json().then((data) => {
        toast.error(data.message);
      });
    }
  });
  return response;
}
