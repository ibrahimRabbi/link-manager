import {useEffect, useState} from 'react';
import { useDispatch } from 'react-redux';
import { useLocation, useSearchParams } from 'react-router-dom';
import { handleGetSources } from '../../../Redux/slices/linksSlice';

const ProtectedRoute = ({ children }) => {
  let location = useLocation();
  const dispatch = useDispatch();

  const wbePath = location.pathname?.includes('wbe');

  const [isWBE, setIsWBE] = useState(wbePath);

  // Get query parameters from the Gitlab
  const [searchParams] = useSearchParams();
  const projectName =searchParams.get('project');
  const branch= searchParams.get('branch');
  const uri =searchParams.get('uri');
  const title =searchParams.get('title');
  const commit =searchParams.get('commit');
  const origin= searchParams.get('origin');
  const sourceType = searchParams.get('sourceType');
  const appName = searchParams.get('appName');

  useEffect(()=>{
    setIsWBE(isWBE);
    if (uri && title && projectName) {
      dispatch(handleGetSources({
        projectName, branch, commit, title, uri, origin, sourceType, appName
      }));
    }
  },[uri, title, projectName]);

  return children;
};

export default ProtectedRoute;
