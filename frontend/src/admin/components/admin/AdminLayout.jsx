import React from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import { Outlet } from 'react-router-dom';

const AdminLayout = () => {
    return (
        <div className="main-wrapper">
            <Header />
            <Sidebar />
            
            <div className="page-wrapper">
                <div className="content container-fluid">
                    {/* The nested routes will be rendered here */}
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default AdminLayout;
