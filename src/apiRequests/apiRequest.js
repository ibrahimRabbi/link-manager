const lmApiUrl = import.meta.env.VITE_LM_REST_API_URL;

export default function fetchAPIRequest({
  urlPath,
  token,
  method,
  body,
  showNotification,
}) {
  const apiURL = `${lmApiUrl}/${urlPath}`;
  return fetch(apiURL, {
    method: method,
    headers: {
      'Content-Type': 'application/json',
      authorization: 'Bearer ' + token,
    },
    body: JSON.stringify(body),
  })
    .then((res) => {
      if (!res.ok) {
        throw new Error(`Request failed with status: ${res.status}`);
      }
      if (method === 'GET' && res.status === 204) {
        showNotification('success', 'No content available');
        return '';
      }
      if (method === 'DELETE' && res.status === 204) {
        showNotification('success', 'The content was successfully deleted');
        return { status: 'success', message: 'The content was successfully deleted' };
      }
      return res.json().then((data) => {
        showNotification('success', data?.message);
        return data;
      });
    })
    .catch((error) => {
      console.error('Fetch error:', error);
      if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
        showNotification(
          'error',
          'Network error. Please check your internet connection.',
        );
      } else {
        showNotification('error', 'An error occurred during the fetch request.');
      }
      return Promise.reject(error);
    });
}
