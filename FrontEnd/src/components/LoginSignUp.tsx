
import { useEffect, useState } from "react";
import { FaUser, FaLock } from "react-icons/fa";
import axios from "axios";
import {toast} from 'react-toastify'
import { validate } from "../utils/validation";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { login } from "../../src/redux/slices/authSlice";
import api from "../utils/axios";



const LoginSignUp = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [name,setName] = useState("");
  const [email,setEmail] = useState('');
  const [password,setPassword] = useState('');
  const [cpassword,setCpassword] = useState('');
  const navigate = useNavigate()
  const dispatch = useDispatch();
  const handler = (event:any)=>{
    const {name ,value} = event.target;
    if(name === 'name') setName(value);
    if(name === 'email') setEmail(value);
    if(name === 'password') setPassword(value);
    if(name === 'cpassword') setCpassword(value);
  }
  const data={
    name:name.trim(),
    email:email.trim(),
    password:password.trim(),
  }
const submit =async(e:any)=>{
  e.preventDefault();
  if(!isLogin){
    const nameValidation = validate("name", name);
    const emailValidation = validate("email", email);
    const passwordValidation = validate("password", password);
    if(!nameValidation.isValid){
      return toast.error(nameValidation.message)
    }
    if(!emailValidation.isValid){
      return toast.error(emailValidation.message)
    }
    if(!passwordValidation.isValid){
      return toast.error(passwordValidation.message)
    }
    if(password.trim() !== cpassword.trim()){
      return toast.error('password and conform password not matched')
    }

    try {
      const response =await api.post(`/signUp`,data);
    if(!response.data.status){
    toast.error(response.data.message);
    }
    toast.success(response.data.message);
    setIsLogin(true);
    } catch (error:any) {
      toast.error(error.response?.data?.message || "Signup failed!");
    }
  }else{
    const emailValidation = validate("email", email);
    const passwordValidation = validate("password", password);
   
    if(!emailValidation.isValid){
      return toast.error(emailValidation.message)
    }
    if(!passwordValidation.isValid){
      return toast.error(passwordValidation.message)
    }
   
    try {
      const response =await api.post(`/logIn`,data);
    if(!response.data.status){
    return toast.error(response.data.message);
    }
    const { userDetails :user, token } = response.data;
    dispatch(login({ user, token }));

    toast.success(response.data.message);
    navigate('/');
    } catch (error:any) {
      toast.error(error.response?.data?.message || "Login failed");
    }
  }
}
  

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <div className="bg-gray-800 p-8 rounded-2xl shadow-lg w-96">
        <h2 className="text-white text-2xl font-semibold text-center mb-6">
          {isLogin ? "Login" : "Sign Up"}
        </h2>
        <form className="space-y-4">
          <div className="relative">
            <FaUser className="absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Email"
              className="w-full pl-10 pr-4 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"name="email" value={email} onChange={handler}
            />
          </div>
          <div className="relative">
            <FaLock className="absolute left-3 top-3 text-gray-400" />
            <input
              type="password"
              placeholder="Password"
              className="w-full pl-10 pr-4 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" name="password" value={password}
              onChange={handler}
            />
          </div>
          {!isLogin && (
            <>
            <div className="relative">
              <FaLock className="absolute left-3 top-3 text-gray-400" />
              <input
                type="password"
                placeholder="Confirm Password"
                className="w-full pl-10 pr-4 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 
                focus:ring-blue-500" name="cpassword" value={cpassword} onChange={handler}
              />             
            </div>
            <div className="relative">
            <FaUser className="absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Name"
              className="w-full pl-10 pr-4 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 
              focus:ring-blue-500" name="name" value={name} onChange={handler}
            />             
          </div>
            </>
            
          )}
          <div className="flex items-center justify-between text-sm text-gray-400">
            <label className="flex items-center space-x-2"> 
            </label>
          </div>
          <button className="w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg" onClick={submit}>
            {isLogin ? "LOGIN" : "SIGN UP"}
          </button>
        </form>
        <p className="text-gray-400 text-center mt-4">
          {isLogin ? "Don't have an account?" : "Already have an account?"}
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-blue-400 hover:underline ml-2"
          >
            {isLogin ? "Sign Up" : "Login"}
          </button>
        </p>
      </div>
    </div>
  )
}

export default LoginSignUp
