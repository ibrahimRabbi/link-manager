const editDomain = (subdomain) => {
  console.log('Subdomain: ', subdomain);

  const currentHost = window.location.hostname;
  const hostArray = window.location.hostname.split('.');

  if (subdomain) {
    if (currentHost === 'localhost' && hostArray.length === 1) {
      window.location.host = subdomain + '.' + window.location.host;
    } else if (currentHost !== 'localhost' && hostArray.length === 3) {
      window.location.host = subdomain + '.' + window.location.host;
    }
  }
};

export default editDomain;
