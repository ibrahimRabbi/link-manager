import React from 'react';
import { Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import AdminSideNav from '../Components/AdminDasComponents/AdminSideNav';
import { Container } from 'rsuite';
import NavigationBar from '../Components/Shared/NavigationBar/NavigationBar';

const AdminDashboard = () => {
  const { isAdminSidebarOpen } = useSelector((state) => state.nav);
  return (
    <>
      <div className="show-fake-browser sidebar-page">
        <NavigationBar />
        <Container>
          <div style={{ position: 'fixed' }}>
            <AdminSideNav />
          </div>
          <div
            className={
              isAdminSidebarOpen ? 'show_nav adminContainer' : 'hide_nav adminContainer'
            }
          >
            <Outlet />
          </div>
        </Container>
      </div>
    </>
  );
};

export default AdminDashboard;
