export default async function getOslcAPI({ url, token }) {
  try {
    const response = await fetch(url, {
      method: 'GET',
      credentials: 'include',
      cors: true,
      headers: {
        'Content-type': 'application/json-ld',
        Accept: 'application/json-ld',
        'OSLC-OAuth2-Consumer': token,
      },
    });
    if (!response.ok) {
      throw new Error([response.statusText, await response.text()]);
    }
    return response.json();
  } catch (error) {
    throw new Error(error);
  }
}
