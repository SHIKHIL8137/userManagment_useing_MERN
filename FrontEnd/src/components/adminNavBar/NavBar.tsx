import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../redux/store'; 
import { handleNavClick } from '../../redux/slices/adminSlice';
import { getUserAvatar } from '../../utils/reuseFun';
import { logout } from '../../redux/slices/adminAuthSlice';
const NavBar = () => {
  const dispatch = useDispatch();
  const selected = useSelector((state: RootState) => state.adminNav.selected); 
  const [isOpen, setIsOpen] = useState(false);
  const currentUser = {
    name: 'Admin User',
    email: 'admin@example.com',
    image: null
  };
const adminString = localStorage.getItem('admin');
const admin = JSON.parse(adminString as string);
  const handleClick = (item: string) => {
    dispatch(handleNavClick({ item })); 
  };

  const handleLogout = () => {
    dispatch(logout())
  };

  return (
    <nav className="bg-gradient-to-t from-transparent to-gray-950 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <div className="text-white font-bold text-xl">Admin Panel</div>
            <div className="ml-10 flex space-x-4">
              {["Dashboard", "Users"].map((item) => (
                <button
                  key={item}
                  onClick={() => handleClick(item)}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition ${
                    selected === item ? "bg-blue-800 text-white" : "text-gray-300 hover:bg-blue-700 hover:text-white"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="flex items-center cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
              <div className="mr-3 text-sm text-white">Hi, {admin.name}</div>
              {getUserAvatar(admin)}
            </div>
            {isOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-gray-800 shadow-lg rounded-lg overflow-hidden z-50">
                <ul className="text-white">
                  <li className="px-4 py-2 hover:bg-gray-700 cursor-pointer" onClick={handleLogout}>Log Out</li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;