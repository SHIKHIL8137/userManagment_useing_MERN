import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store"; 

export const ProtectedRoute = () => {
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
console.log(isAuthenticated)
  return isAuthenticated ? <Outlet /> : <Navigate to="/logIn" />;
};

export const PublicRoute = () => {
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);

  return isAuthenticated ? <Navigate to="/" /> : <Outlet />;
};

export const AdminPublicRoute = ()=>{
  const isAuthenticated = useSelector((state:RootState)=>state.adminAuth.isAuthenticated);
  return isAuthenticated ? <Navigate to="/admin/" /> : <Outlet/>;
}

export const AdminProtectedRoute = ()=>{
  const isAuthenticated = useSelector((state:RootState)=> state.adminAuth.isAuthenticated);
  return isAuthenticated ? <Outlet/> : <Navigate to='/admin/login'/>
}