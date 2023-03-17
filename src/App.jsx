import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Organization from './Components/AdminDasComponents/Organization/Organization';
import Users from './Components/AdminDasComponents/Users/Users';
import EditLink from './Components/EditLink/EditLink';
import GraphView from './Components/GraphView/GraphView';
import LinkDetails from './Components/LinkDetails/LinkDetails';
import LinkManager from './Components/LinkManager/LinkManager';
import NewLink from './Components/NewLink/NewLink';
import ProtectedRoute from './Components/Shared/ProtectedRoute/ProtectedRoute';
import './GlobalStyle.scss';
import NotFound from './Pages/404';
import AdminDashboard from './Pages/AdminDashboard';
import Dashboard from './Pages/Dashboard';
import LoginPage from './Pages/Login';
import WbeDashboard from './Pages/WbeDashboard';

function App() {
  return (
    <div className="App">
      <Routes>
        {/* This is WBE dashboard */}
        <Route
          path="/wbe"
          element={
            <ProtectedRoute>
              <WbeDashboard />
            </ProtectedRoute>
          }
        >
          <Route path="/wbe/new-link" element={<NewLink />} />
          <Route path="/wbe/edit-link/:id" element={<EditLink />} />
          <Route path="/wbe/details/:id" element={<LinkDetails />} />
          <Route path="/wbe/graph-view" element={<GraphView />} />
          <Route path="/wbe" element={<LinkManager />} />
        </Route>

        {/* This is Browser dashboard  */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        >
          <Route path="/new-link" element={<NewLink />} />
          <Route path="/edit-link/:id" element={<EditLink />} />
          <Route path="/details/:id" element={<LinkDetails />} />
          <Route path="/graph-view" element={<GraphView />} />
          <Route path="/" element={<LinkManager />} />
        </Route>

        {/* This is admin dashboard  */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        >
          <Route path="/admin/users" element={<Users />} />
          <Route path="/admin/organization" element={<Organization />} />
          <Route path="/admin" element={<Users />} />
        </Route>

        <Route path="/login" element={<LoginPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default App;
