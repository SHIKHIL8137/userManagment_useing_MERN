import React from 'react'
import { RootState } from '../redux/store'
import { useSelector, UseSelector } from 'react-redux'

const Dashboard = () => {
  const userData = useSelector((state:RootState)=>state.adminAuth.user);
  return (
<div className="mt-10">
  <div className=" p-6">
    <div className="mb-6">
      <h2 className="text-2xl font-bold text-white">Dashboard Overview</h2>
    </div>
    
    <div className="grid grid-cols-1 gap-6 mb-6 md:grid-cols-2 lg:grid-cols-4">
      <div className="p-6 bg-gray-950 rounded-lg shadow-sm">
        <h3 className="text-base font-medium text-gray-400">Total Users</h3>
        <p className="text-2xl font-semibold text-white">8,249</p>
      </div>
      
      <div className="p-6 bg-gray-950 rounded-lg shadow-sm">
        <h3 className="text-base font-medium text-gray-400">New Signups</h3>
        <p className="text-2xl font-semibold text-white">145</p>
      </div>
      
      {/* Card 3 */}
      <div className="p-6 bg-gray-950 rounded-lg shadow-sm">
        <h3 className="text-base font-medium text-gray-400">Active Sessions</h3>
        <p className="text-2xl font-semibold text-white">327</p>
      </div>
      
      {/* Card 4 */}
      <div className="p-6 bg-gray-950 rounded-lg shadow-sm">
        <h3 className="text-base font-medium text-gray-400">Revenue</h3>
        <p className="text-2xl font-semibold text-white">$12,453</p>
      </div>
    </div>
    
    {/* Content area */}
    <div className="p-6 bg-gray-950 rounded-lg shadow-sm">
      <h3 className="mb-4 text-xl font-semibold text-white">Recent Activity</h3>
      {/* Table or list component would go here */}
    </div>
  </div>
</div>
  )
}

export default Dashboard
