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
  const [searchParams] = useSearchParams();

  // Get query parameters from the WBE
  // glide, gitlab, jira, github, valispace <-- from wbe
  const origin = searchParams.get('origin');
  const appName = searchParams.get('appName');
  const sourceType = searchParams.get('sourceType');
  const uri = searchParams.get('uri');
  const title = searchParams.get('title');
  const titleLabel = searchParams.get('titleLabel');
  const projectName = searchParams.get('project');
  const branch = searchParams.get('branch');
  const commit = searchParams.get('commit');
  const logoUrl = searchParams.get('logoUrl');

  useEffect(() => {
    dispatch(handleIsWbe(wbePath));
  }, [location]);

  useEffect(() => {
    if (uri) {
      const sources = {
        projectName,
        title,
        titleLabel,
        uri,
        branch,
        commit,
        origin,
        sourceType,
        appName,
        logoUrl,
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
