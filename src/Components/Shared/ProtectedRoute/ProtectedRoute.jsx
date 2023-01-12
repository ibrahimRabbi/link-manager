import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useLocation, useSearchParams } from 'react-router-dom';
import { handleGetSources, handleIsWbe } from '../../../Redux/slices/linksSlice';

const ProtectedRoute = ({ children }) => {
  let location = useLocation();
  const dispatch = useDispatch();
  const wbePath = location.pathname?.includes('wbe');

  // Get query parameters from the Gitlab
  const [searchParams] = useSearchParams();
  const projectName =searchParams.get('project');
  const title =searchParams.get('title');
  const uri =searchParams.get('uri');
  const origin= searchParams.get('origin');
  const sourceType = searchParams.get('sourceType');
  const appName = searchParams.get('appName');

  useEffect(()=>{
    dispatch(handleIsWbe(wbePath));
    if (uri && title && projectName) {
      dispatch(handleGetSources({
        projectName, title, uri, origin, sourceType, appName
      }));
    }
  },[uri, title, projectName]);

  return children;
};

export default ProtectedRoute;
