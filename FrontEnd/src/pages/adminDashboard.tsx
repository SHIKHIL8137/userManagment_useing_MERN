import React, { useState } from 'react';
import NavBar from '../components/adminNavBar/NavBar';
useSelector
import { RootState } from '../redux/store';
import UserData from '../components/adminNavBar/userData';
import { useSelector } from 'react-redux';
import Dashboard from '../components/Dashboard';
const AdminDashboard = () => {
  const selected = useSelector((state: RootState) => state.adminNav.selected); 

  return (
    <>
     <NavBar/>
     {selected === 'Dashboard' ? <Dashboard/>:<UserData />}    
    </>
  );
};

export default AdminDashboard;