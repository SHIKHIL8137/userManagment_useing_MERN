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
import { toast } from 'react-toastify';
import { logout } from './redux/slices/authSlice';
import api from './utils/axios';
import { AxiosError } from 'axios';





function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        dispatch(logout());
        return;
      }

      try {
        const response = await api.get("/validateToken", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.data.status) {
          dispatch(login({ user: response.data.user, token }));
        } else {
          throw new Error("Invalid user data");
        }
      } catch (err) {
        const error = err as AxiosError;
              if (error.response) {
                const status = error.response.status;
                if (status === 401 || status === 403) {
                  toast.error((error.response?.data as { message: string })?.message || "An error occurred");
                  localStorage.removeItem("token");
                  localStorage.removeItem("user");
                  dispatch(logout());
                } else {
                  toast.error("Failed to update profile");
                }
              } else {
                toast.error("Network error or server not responding.");
              }
      }
    };

    fetchUserData();
  }, [dispatch]);

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} style={{ top: '80px' }} />
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
