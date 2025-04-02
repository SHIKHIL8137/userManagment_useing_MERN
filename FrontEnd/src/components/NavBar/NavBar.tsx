import React,{useEffect, useState} from 'react'
import { useDispatch, useSelector } from "react-redux";
import { RiHome2Line } from "react-icons/ri";
import { logout } from "../../redux/slices/authSlice";
import { useLocation, useNavigate } from "react-router-dom";
import { changeData } from '../../redux/slices/dynamicSlice';

const NavBar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation()
  const [isOpen, setIsOpen] = useState(false);
  const path = location.pathname;
  useEffect(()=>{
    if(path === '/'){
      dispatch(changeData({navText1:'Dashboard'}))
    }else if(path === '/profile'){
      dispatch(changeData({navText1:'Profile'}))
    }
  },[path,dispatch])
  const data = useSelector((state:any)=>state.dynamic.navText1);
  const handleLogout = () => {
    dispatch(logout()); 
    navigate("/login"); 
  };
  const profileNavigate = ()=>{
    navigate('/profile');
    setIsOpen(false);
  }


  return (
    <nav className="flex items-center justify-between px-6 py-4 bg-gradient-to-t from-transparent to-gray-900 shadow-lg">
      {location.pathname === '/' ? null : <RiHome2Line className="text-white opacity-70 hover:opacity-100 transition-all cursor-pointer" onClick={()=>navigate('/')}/>}
      <p className="text-white text-2xl font-semibold">{data}</p>
      
      <div className="relative">
        <p
          className="userLogo flex items-center justify-center w-10 h-10 bg-blue-950 text-white font-bold rounded-full shadow-md cursor-pointer"
          onClick={() => setIsOpen(!isOpen)}
        >
          S
        </p>
        {isOpen && (
          <div className="absolute right-0 mt-2 w-40 bg-gray-800 shadow-lg rounded-lg overflow-hidden">
            <ul className="text-white">
              <li className="px-4 py-2 cursor-pointer hover:bg-gray-700" onClick={profileNavigate}>Profile</li>
              <li className="px-4 py-2 hover:bg-gray-700 cursor-pointer" onClick={handleLogout}>Log Out</li>
            </ul>
          </div>
        )}
      </div>
    </nav>
  )
}

export default NavBar
