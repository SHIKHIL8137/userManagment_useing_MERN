import React, { useState } from "react";
import { validate } from "../utils/validation";
import { toast } from "react-toastify";
import api from "../utils/axios";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { login } from "../redux/slices/adminAuthSlice";
import { AxiosError } from "axios";

const AdminAuthPage = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
  });
  const [loginLoader, setLoginLoader] = useState(false);
  const [signUpLoader, setSignUpLoader] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value.trim(),
    }));
  };

  const toggleForm = () => {
    setIsLogin(!isLogin);
    setFormData({
      email: "",
      password: "",
      confirmPassword: "",
      name: "",
    });
  };

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (isLogin) {
      setLoginLoader(true);
      try {
        const emailValidation = validate("email", formData.email);
        const passwordValidation = validate("password", formData.password);

        if (!emailValidation.isValid) {
          toast.error(emailValidation.message);
          return;
        }
        if (!passwordValidation.isValid) {
          toast.error(passwordValidation.message);
          return;
        }

        const response = await api.post(`/admin/login`, {
          email: formData.email,
          password: formData.password,
        });

        if (!response.data.status) {
          toast.error(response.data.message);
          return;
        }
        const { adminDetails :user, token } = response.data;
        dispatch(login({ user, token }));
        toast.success("Login successful!");
        navigate('/admin/');
      } catch (err) {
        const error = err as AxiosError;
        const errorMessage = (error.response?.data as { message?: string })?.message || "Something went wrong!";
        toast.error(errorMessage);
        
      } finally {
        setLoginLoader(false);
      }
    } else {
      setSignUpLoader(true);
      try {

        const nameValidation = validate("name", formData.name);
        const emailValidation = validate("email", formData.email);
        const passwordValidation = validate("password", formData.password);

        if (!nameValidation.isValid) {
          toast.error(nameValidation.message);
          return;
        }
        if (!emailValidation.isValid) {
          toast.error(emailValidation.message);
          return;
        }
        if (!passwordValidation.isValid) {
          toast.error(passwordValidation.message);
          return;
        }
        if (formData.password.trim() !== formData.confirmPassword.trim()) {
          toast.error("Password and confirm password do not match");
          return;
        }

        const response = await api.post(`/admin/signUp`, formData);
        if (!response.data.status) {
          toast.error(response.data.message);
          return;
        }

        toast.success("Account created successfully! Please log in.");
        toggleForm(); 
      } catch (error) {
        console.error("Signup Error:", error);
        toast.error("Something went wrong. Please try again.");
      } finally {
        setSignUpLoader(false);
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="bg-gray-200 rounded-lg shadow-xl w-full max-w-md p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            Admin {isLogin ? "Login" : "Signup"}
          </h1>
          <p className="text-gray-600 mt-2">
            {isLogin ? "Access your admin dashboard" : "Create your admin account"}
          </p>
        </div>

        <form onSubmit={submit}>
          {!isLogin && (
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="name">
                Full Name
              </label>
              <input
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your full name"
              />
            </div>
          )}

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="email">
              Email Address
            </label>
            <input
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="password">
              Password
            </label>
            <input
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
            />
          </div>

          {!isLogin && (
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="confirmPassword">
                Confirm Password
              </label>
              <input
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm your password"
              />
            </div>
          )}

          <button
            className="w-full py-3 bg-blue-900 hover:bg-blue-800 text-white font-medium rounded-lg transition duration-300 flex justify-center items-center"
            disabled={loginLoader || signUpLoader}
            type="submit"
          >
            {loginLoader || signUpLoader ? (
              <div className="w-6 h-6 border-4 border-gray-300 border-t-white rounded-full animate-spin"></div>
            ) : (
              isLogin ? "Login" : "Create Account"
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            {isLogin ? "Don't have an account?" : "Already have an account?"}
            <button onClick={toggleForm} className="ml-1 text-blue-600 hover:text-blue-800 font-medium">
              {isLogin ? "Sign up" : "Log in"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminAuthPage;
