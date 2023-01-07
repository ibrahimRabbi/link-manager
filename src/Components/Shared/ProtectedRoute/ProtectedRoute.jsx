import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useLocation, useSearchParams } from 'react-router-dom';
import { handleGetSources, handleIsWbe } from '../../../Redux/slices/linksSlice';

const ProtectedRoute = ({ children }) => {
  // Get sources in the gitlab and display data
  let location = useLocation();
  const dispatch =useDispatch();

  // Get query parameters from the Gitlab
  const [searchParams] = useSearchParams();
  const projectName =searchParams.get('project');
  const branch= searchParams.get('branch');
  const uri =searchParams.get('uri');
  const title =searchParams.get('title');
  const commit =searchParams.get('commit');
  const origin= searchParams.get('origin');
  const sourceType= searchParams.get('sourceType');
  const isWBE = location.pathname?.includes('wbe');

  useEffect(()=>{
    dispatch(handleIsWbe(isWBE));
    if (uri && title && projectName) {
      dispatch(handleGetSources({
        projectName, branch, commit, title, uri, origin, sourceType
      }));
    }
  },[uri, title, projectName]);

  // if (loggedInUser?.token) {
  return children;
  // }
  // return <Navigate to='/login' state={{ from: location }} />;
};

export default ProtectedRoute;
