import axios from "axios";
import { logout } from "../redux/slices/authSlice"; 
import store  from "../redux/store"; 
import { toast } from "react-toastify";

const api = axios.create({
  baseURL: "http://localhost:3000",
  withCredentials: true, 
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      toast.error("Session expired! Please log in again.");
      store.dispatch(logout());
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;
