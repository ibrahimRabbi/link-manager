import React, { useContext, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Navigate, useLocation, useSearchParams } from 'react-router-dom';
import { handleGetSources, handleIsWbe } from '../../../Redux/slices/linksSlice';
import AuthContext from '../../../Store/Auth-Context';

const ProtectedRoute = ({ children }) => {
  const authCtx = useContext(AuthContext);
  let location = useLocation();
  const dispatch = useDispatch();
  const wbePath = location.pathname?.includes('wbe');

  // Get query parameters from the Gitlab
  const [searchParams] = useSearchParams();

  const appName = searchParams.get('appName'); // glide, gitlab, jira, github <-- from wbe
  const sourceType = searchParams.get('sourceType');
  const title = searchParams.get('title');
  const origin = searchParams.get('origin');
  const uri = searchParams.get('uri');
  const projectName = searchParams.get('project');

  const branch = searchParams.get('branch');
  const commit = searchParams.get('commit');

  useEffect(() => {
    dispatch(handleIsWbe(wbePath));
  }, [location]);

  useEffect(() => {
    if (uri && title && projectName) {
      const sources = {
        projectName,
        title,
        uri,
        branch,
        commit,
        origin,
        sourceType,
        appName,
      };
      dispatch(handleGetSources(sources));
      sessionStorage.setItem('sourceData', JSON.stringify(sources));
    }
  }, [uri, title, projectName]);

  // eslint-disable-next-line max-len
  // When the token expires, the state data is emptied after the user re-logins, so the source data is stored and reused.
  useEffect(() => {
    const source = sessionStorage.getItem('sourceData');
    if (source) dispatch(handleGetSources(JSON.parse(source)));
  }, []);

  if (authCtx.isLoggedIn) {
    return children;
  }

  return <Navigate to="/login" state={{ from: location }} />;
};

export default ProtectedRoute;
