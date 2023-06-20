const lmApiUrl = process.env.REACT_APP_LM_REST_API_URL;

export default function fetchAPIRequest({ urlPath, token, method, body }) {
  const apiURL = `${lmApiUrl}/${urlPath}`;
  return fetch(apiURL, {
    method: method,
    headers: {
      'Content-Type': 'application/json',
      authorization: 'Bearer ' + token,
    },
    body: JSON.stringify(body),
  })
    .then(async (response) => {
      if (response.status !== 204) {
        const res = await response.json();
        return { ...res, ok: response.ok };
      } else if (method === 'GET' && response.status === 204) {
        return {
          ok: response.ok,
          status: 'Success',
          message: 'No content available!',
        };
      } else if (method === 'DELETE' && response.status === 204) {
        return {
          ok: response.ok,
          status: 'Success',
          message: 'This content was successfully deleted!',
        };
      }
    })
    .then((data) => {
      if (!data?.ok) {
        throw new Error(data?.message);
      }
      return data;
    })
    .catch((error) => {
      throw new Error(error);
    });
}
