import { toast } from 'react-hot-toast';

export default async function deleteAPI({ url, token }) {
  const response = await fetch(`${url}`, {
    method: 'DELETE',
    headers: {
      'Content-type': 'application/json',
      authorization: 'Bearer ' + token,
    },
  }).then((res) => {
    if (res.ok) {
      if (res.status === 204) {
        toast.success('Successfully deleted');
        return res;
      }
    } else {
      return res.json().then((data) => {
        toast.error(data.message);
      });
    }
  });
  return response;
}
