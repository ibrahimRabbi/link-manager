// prettier-ignore
export const getApplicationIcons = (data) => {
  const applicationIcons = data.reduce((accumulator, currentValue) => {
    switch (currentValue?.type) {
    case 'gitlab':
      accumulator.push({
        ...currentValue,
        iconUrl: '/gitlab_logo.png',
        status: currentValue?.status,
      });
      break;
    case 'bitbucket':
      accumulator.push({
        ...currentValue,
        iconUrl: '/bitbucket_logo.png',
        status: currentValue?.status,
      });
      break;
    case 'github':
      accumulator.push({
        ...currentValue,
        iconUrl: '/github_logo.png',
        status: currentValue?.status,
      });
      break;
    case 'jira':
      accumulator.push({
        ...currentValue,
        iconUrl: '/jira_logo.png',
        status: currentValue?.status,
      });
      break;
    case 'glideyoke':
      accumulator.push({
        ...currentValue,
        iconUrl: '/glide_logo.png',
        status: currentValue?.status,
      });
      break;
    case 'valispace':
      accumulator.push({
        ...currentValue,
        iconUrl: '/valispace_logo.png',
        status: currentValue?.status,
      });
      break;
    case 'codebeamer':
      accumulator.push({
        ...currentValue,
        iconUrl: '/codebeamer_logo.png',
        status: currentValue?.status,
      });
      break;
    case 'dng':
      accumulator.push({
        ...currentValue,
        iconUrl: '/dng_logo.png',
        status: currentValue?.status,
      });
      break;
    default:
      accumulator.push({
        ...currentValue,
        iconUrl: '/default_logo.png',
        status: currentValue?.status,
      });
      break;
    }
    return accumulator;
  }, []);
  return applicationIcons;
};
