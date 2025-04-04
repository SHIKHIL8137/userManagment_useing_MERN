import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { validateImage } from "../utils/validation";
import { useDispatch, useSelector } from "react-redux";
import api from "../utils/axios";
import { updateUser } from "../redux/slices/authSlice";
import { logout } from "../redux/slices/authSlice";
import { AxiosError } from "axios";
import { validate } from "../utils/validation";
import { RootState } from "../redux/store";

const ProfilePage = () => {
  interface userType{
    name : string,
    email : string,
    image : string,
    userID : string
  }
  const userstring = localStorage.getItem("user");
  const user = userstring ? JSON.parse(userstring) : null;
  const dispatch = useDispatch();
  const userDataRedux = useSelector((state:RootState)=>state.auth.user);
  const [name, setName] = useState(user?.name || "");
  const [file, setFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState(user?.image || "");
  const[profileLoader,setProfileLoader] = useState(false);
  const [passwordLoader,setPasswordLoder] = useState(false);
  const[password,setPassword] = useState("");
  const[cPassword,setCpassword] = useState("")
  const [userData,setUserData] = useState<userType | null>(null);


  useEffect(() => {
    setImagePreview(user?.image || "");
  }, [user]);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    const validation = validateImage(selectedFile);
    if (!validation.isValid) {
      toast.error(validation.message);
      return;
    }

    if (imagePreview && imagePreview.startsWith("blob:")) {
      URL.revokeObjectURL(imagePreview);
    }

    setFile(selectedFile);
    const newPreviewUrl = URL.createObjectURL(selectedFile);
    setImagePreview(newPreviewUrl);
  };


  const updateProfile = async (e:any) => {
    e.preventDefault();
    try {
      setProfileLoader(true);
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Unauthorized: No token found");
        dispatch(logout());
        return;
      }
      const nameValidation = validate("name", name);
      if(!nameValidation.isValid){
        return toast.error(nameValidation.message)
      }
      const formData = new FormData();
      formData.append("userID", user.userID);
      formData.append("name", name);
      if (file) {
        formData.append("image", file); 
      }
  
  
      const response = await api.patch("/updateUser", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true, 
      });
      
      if (response.data.status) {
        setUserData(response.data.user); 
        dispatch(updateUser({ userData: response.data.user }));
        toast.success(response.data.message);
      }
      
    } catch (err:unknown) {
      const error = err as AxiosError;
      if (error.response) {
        const status = error.response.status;
        if (status === 401 || status === 403) {
          toast.error((error.response?.data as { message: string })?.message || "An error occurred");
          dispatch(logout());
        } else {
          toast.error("Failed to update profile");
        }
      } else {
        toast.error("Network error or server not responding.");
      }
    }finally{
      setProfileLoader(false);
    }
  };

  const updatePassowrd = async(e:any)=>{
    e.preventDefault()
    setPasswordLoder(true)
  try {

    const passwordValidation = validate("password", password);
    if(!passwordValidation.isValid){
      return toast.error(passwordValidation.message)
    }
    if(password.trim() !== cPassword.trim()){
      toast.error('Passowrd and Confirm Password mismached');
      return
      }
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Unauthorized: No token found");
        dispatch(logout());
        return;
      }
    
    const response =await api.patch('/updatePassword',{password,userID:user.userID}, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      withCredentials: true, 
    });
    if(!response.data.status){
    toast.error(response.data.message);
    }
    toast.success(response.data.message);
    setPassword("")
    setCpassword("");
  } catch (err:unknown) {
    const error = err as AxiosError;
    if (error.response) {
      const status = error.response.status;
      if (status === 401 || status === 403) {
        toast.error("Session expired. Please log in again.");
        dispatch(logout());
      } else {
        toast.error("Failed to update pssword");
      }
    } else {
      toast.error("Network error or server not responding.");
    }
  }finally{
setPasswordLoder(false)
  }
  }
  

  return (
    <div className="flex items-center justify-center bg-gray-900 m-16">
      <div className="w-full max-w-4xl bg-gray-800 rounded-lg shadow-lg p-8 flex flex-col md:flex-row md:space-x-8">
        <div className="md:w-1/2">
          <h2 className="text-2xl font-semibold text-center text-white mb-6">Profile</h2>
          <div className="flex flex-col items-center mb-4">
            <label htmlFor="profilePic" className="cursor-pointer">
              <img
                src={imagePreview || "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"}
                alt="Profile"
                className="w-24 h-24 rounded-full border-4 border-gray-300 object-cover"
              />
            </label>
            <input type="file" id="profilePic" accept="image/*" className="hidden" onChange={handleFileChange} />
          </div>

          <div className="mb-4">
            <label className="block text-gray-100 font-medium">Name</label>
            <input
              type="text"
              className="w-full mt-1 p-2 border-none rounded-md focus:outline-none text-gray-500"
              placeholder="Name"
              onChange={handleNameChange}
              value={name}
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-100 font-medium">Email</label>
            <input
              type="email"
              disabled
              className="w-full mt-1 p-2 cursor-not-allowed text-gray-500"
              placeholder="Email"
              value={user.email}
            />
          </div>

          <button
  className="w-full bg-blue-900 text-white py-2 rounded-md hover:bg-blue-950 transition duration-300 cursor-pointer disabled:bg-blue-800 disabled:cursor-not-allowed"
  onClick={updateProfile}
  disabled={profileLoader} 
>
  {profileLoader ? "Updating..." : "Update Profile"}
</button>

        </div>

        <div className="hidden md:block w-0.5 bg-gray-300"></div>

        <div className="md:w-1/2 mt-6 md:mt-0">
          <h2 className="text-xl font-semibold text-center text-white mb-6">Change Password</h2>
          <div className="mb-4">
            <label className="block text-gray-100 font-medium">New Password</label>
            <input
              type="password"
              className="w-full mt-1 p-2 border-none text-gray-500 rounded-md focus:outline-none"
              placeholder="Enter new password"
            onChange={(e)=>setPassword(e.target.value)} value={password}/>
          </div>

          <div className="mb-4">
            <label className="block text-gray-100 font-medium">Confirm Password</label>
            <input
              type="password"
              className="w-full mt-1 p-2 border-none text-gray-500 rounded-md focus:outline-none"
              placeholder="Confirm new password" onChange={(e)=>{setCpassword(e.target.value)}} value={cPassword}
            />
          </div>

          <button className="w-full bg-blue-900 text-white py-2 rounded-md hover:bg-blue-950 transition duration-300 cursor-pointer disabled:bg-blue-800 disabled:cursor-not-allowed"
  onClick={updatePassowrd}
  disabled={passwordLoader}>
    {passwordLoader?'Updating..':"Update Password"}            
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
