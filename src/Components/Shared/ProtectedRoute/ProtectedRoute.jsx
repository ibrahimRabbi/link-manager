import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useLocation, useSearchParams } from 'react-router-dom';
import { handleGetSources, handleIsWbe } from '../../../Redux/slices/linksSlice';

const ProtectedRoute = ({ children }) => {
  let location = useLocation();
  const dispatch = useDispatch();

  // Get query parameters from the Gitlab
  const [searchParams] = useSearchParams();

  const appName = searchParams.get('appName'); // glide, gitlab, jira, github <-- from wbe
  const sourceType = searchParams.get('sourceType');
  const title =searchParams.get('title');
  const origin= searchParams.get('origin');
  const uri =searchParams.get('uri');
  const projectName =searchParams.get('project');

  const branch= searchParams.get('branch');
  const commit =searchParams.get('commit');

  const isWBE = location.pathname?.includes('wbe');

  useEffect(()=>{
    dispatch(handleIsWbe(isWBE));
    if (uri && title && projectName) {
      dispatch(handleGetSources({
        projectName,
        branch,
        commit,
        title,
        uri,
        origin,
        sourceType,
        appName
      }));
    }
  },[uri, title, projectName]);

  return children;
};

export default ProtectedRoute;
