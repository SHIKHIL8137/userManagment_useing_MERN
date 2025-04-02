import { Routes, Route, useLocation } from 'react-router-dom';
import './App.css';
import LoginSignUpPage from './pages/LoginSignUpPage';
import { useEffect } from "react";
import Home from './pages/Home';
import ProfilePage from './components/userProfile';
import { ToastContainer } from "react-toastify";
import  { PublicRoute ,ProtectedRoute, AdminProtectedRoute,AdminPublicRoute} from './utils/protectedRoute';
import NavBar from './components/NavBar/NavBar';
import { useDispatch } from "react-redux";
import { login } from "./redux/slices/authSlice";
import AdminAuthPage from './pages/adminLoginSignUp';
import AdminDashboard from './pages/adminDashboard';




function App() {
  const dispatch = useDispatch();
  useEffect(() => {
    const token = localStorage.getItem("token");
    const userString = localStorage.getItem("user");
    const user = userString ? JSON.parse(userString) : null
    if (token) {
      dispatch(login({ user, token })); 
    }
  }, [dispatch]);

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <Routes>
      <Route element={<PublicRoute />}>
          <Route path="/logIn" element={<LoginSignUpPage />} />
        </Route>
 <Route element={<><NavBar /><ProtectedRoute /></>}>
  <Route path="/" element={<Home />} />
    <Route path="/profile" element={<ProfilePage />} />
  </Route>

<Route element={<AdminPublicRoute />}>
<Route path='/admin/login' element={<AdminAuthPage/>}/>
</Route>
<Route element={<AdminProtectedRoute />}>
<Route path='/admin/' element={<AdminDashboard/>}/>
</Route>
</Routes>;
    </>
  );
}

export default App;
