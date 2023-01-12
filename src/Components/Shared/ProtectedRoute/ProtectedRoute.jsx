import {useEffect, useState} from 'react';
import { useDispatch } from 'react-redux';
import { useLocation, useSearchParams } from 'react-router-dom';
import { handleGetSources } from '../../../Redux/slices/linksSlice';

const ProtectedRoute = ({ children }) => {
  let location = useLocation();
  const dispatch = useDispatch();

  const wbePath = location.pathname?.includes('wbe');
  console.log('ProtectedRoute.jsx -> wbePath', wbePath);

  const [isWBE, setIsWBE] = useState(wbePath);
  console.log('ProtectedRoute.jsx -> isWBE', isWBE);

  console.log('ProtectedRoute.jsx');
  // Get sources in the gitlab and display data

  // Get query parameters from the Gitlab
  const [searchParams] = useSearchParams();
  const projectName =searchParams.get('project');
  const branch= searchParams.get('branch');
  const uri =searchParams.get('uri');
  const title =searchParams.get('title');
  const commit =searchParams.get('commit');
  const origin= searchParams.get('origin');
  const sourceType= searchParams.get('sourceType');
  const appName = searchParams.get('appName');

  console.log('ProtectedRoute -> uri', uri);
  console.log('ProtectedRoute -> title', title);
  console.log('ProtectedRoute -> projectName', projectName);
  console.log('ProtectedRoute -> appName', appName);

  useEffect(()=>{
    // dispatch(handleIsWbe(isWBE));
    setIsWBE(isWBE);
    if (uri && title && projectName) {
      dispatch(handleGetSources({
        projectName, branch, commit, title, uri, origin, sourceType, appName
      }));
    }
  },[uri, title, projectName]);

  // if (loggedInUser?.token) {
  return children;
  // }
  // return <Navigate to='/login' state={{ from: location }} />;
};

export default ProtectedRoute;
