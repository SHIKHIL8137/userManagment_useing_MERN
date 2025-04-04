import React, { useEffect, useState, useCallback } from 'react'
import { ChevronLeft, ChevronRight, Search } from 'lucide-react';
import api from '../../utils/axios';
import { toast } from 'react-toastify';
import LoadingSpinner from '../Loader';
import { validate } from '../../utils/validation';
import { AxiosError } from "axios";
import { logout } from '../../redux/slices/adminAuthSlice';
import { useDispatch } from 'react-redux';

const UserData = () => {
  interface User {
    _id: string;
    name: string;
    email: string;
    role: string;
    image?: string;
  }
  
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    cpassword: '',
    role: 'user',
  });
  const [users, setUsers] = useState<User[]>([]); 
  const [currentPage, setCurrentPage] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch()
  const usersPerPage = 10;
  

  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

 
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); 
  };


  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get(`/admin/getUserData?page=${currentPage}&search=${debouncedSearchTerm}`);
      if (response.data.status) {
        setUsers(response.data.userData);
        setTotalUsers(response.data.totalCount || 0);
      } else {
        toast.error(response.data.message);
      }
    } catch (err) {
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
    } finally {
      setLoading(false);
    }
  }, [currentPage, debouncedSearchTerm]);


  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      password: '',
      cpassword: '',
      role: user.role,
    });
    setShowModal(true);
  };

  const handleDelete = async (userId: string) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        const response = await api.delete(`/admin/deleteUser/${userId}`);
        if (response.data.status) {
          setUsers(users.filter((user) => user._id !== userId));
          toast.success('User deleted successfully');
        } else {
          toast.error(response.data.message || 'Failed to delete user');
        }
      } catch (err) {
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
      }
    }
  };

  const handleAddUser = () => {
    setEditingUser(null);
    setFormData({
      name: '',
      email: '',
      password: '',
      cpassword: '',
      role: 'user',
    });
    setShowModal(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if(!editingUser){
      const namelValidation = validate("name", formData.name);
      if(!namelValidation.isValid){
        return toast.error(namelValidation.message)
      }
      const emailValidation = validate("email", formData.email);
      if(!emailValidation.isValid){
        return toast.error(emailValidation.message)
      }
      const passwordValidation = validate("password", formData.password);
      if(!passwordValidation.isValid){
        return toast.error(passwordValidation.message)
      }

      if (formData.password.trim() !== formData.cpassword.trim()) {
        toast.error('Passwords do not match');
        return;
      }

      try {
        const response = await api.post('/admin/addUser', {
          name: formData.name,
          email: formData.email,
          password: formData.password,
        });

        if (!response.data.status) {
          toast.success(response.data.message);
        }

        const newUser = response.data.user;
        setUsers([ newUser,...users]);
        toast.success('User added successfully');
        if (users.length >= usersPerPage) {
          setCurrentPage(Math.ceil((totalUsers + 1) / usersPerPage));
        }
        setTotalUsers(totalUsers + 1);
      } catch (err) {
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
      } finally {
        setShowModal(false);
      }
    } else {
      const updateData = {
        name: formData.name,
        ...(formData.password ? { password: formData.password } : {})
      };
      const nameValidation = validate("name", formData.name);
      if(!nameValidation.isValid){
        return toast.error(nameValidation.message)
      }
      if(formData.password !== ''){
        const passwordValidation = validate("password", formData.password);
        if(!passwordValidation.isValid){
          return toast.error(passwordValidation.message)
        }
      }
      
      try {
        const response = await api.patch(`/admin/updateUser/${editingUser._id}`, updateData);
        if (response.data.status) {
          setUsers(users.map(user => 
            user._id === editingUser._id 
              ? { ...user, name: formData.name, role: formData.role } 
              : user
          ));

          toast.success('User updated successfully');
        }
      } catch (err) {
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
      } finally {
        setShowModal(false);
      }
    }
  }

  const nextPage = () => {
    if (currentPage * usersPerPage < totalUsers) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <>
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">User Management</h2>
              <button
                onClick={handleAddUser}
                className="bg-blue-900 hover:bg-blue-800 text-white px-4 py-2 rounded-md"
              >
                Add User
              </button>
            </div>
            
            <div className="space-y-4">
              <div className='flex justify-end'>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  className="block w-md pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                />
              </div>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        User
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Role
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                  {loading ? (
                    <tr>
                      <td colSpan={4} className="px-6 py-4">
                        <div className="flex justify-center items-center">
                          <LoadingSpinner />
                        </div>
                      </td>
                    </tr>
                  ) : (
                    users?.map((user) => (
                      <tr key={user._id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            {user?.image ? (
                              <img
                                src={user.image}
                                alt={user.name}
                                className="w-10 h-10 rounded-full object-cover"
                              />
                            ) : (
                              <div className="w-10 h-10 bg-blue-700 rounded-full flex items-center justify-center text-white font-medium">
                                {user.name.charAt(0).toUpperCase()}
                              </div>
                            )}
                            <div className="ml-4 text-sm font-medium text-gray-900">
                              {user.name}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {user.email}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {user.role}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => handleEdit(user)}
                            className="text-blue-600 hover:text-blue-900 mr-3"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(user._id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                  </tbody>
                </table>
                <div className="flex justify-between items-center mt-4">
                  <div className="text-sm text-gray-700">
                    {totalUsers > 0 ? (
                      <>
                        Showing <span className="font-medium">{(currentPage - 1) * usersPerPage + 1}</span> to{" "}
                        <span className="font-medium">
                          {Math.min(currentPage * usersPerPage, totalUsers)}
                        </span>{" "}
                        of <span className="font-medium">{totalUsers}</span> results
                      </>
                    ) : (
                      "No results found"
                    )}
                  </div>
                  <div>
                    <button
                      onClick={prevPage}
                      disabled={currentPage === 1}
                      className="bg-gray-200 p-2 rounded-md mr-2 disabled:opacity-50"
                    >
                      <ChevronLeft size={20} />
                    </button>
                    <button
                      onClick={nextPage}
                      disabled={currentPage * usersPerPage >= totalUsers}
                      className="bg-gray-200 p-2 rounded-md disabled:opacity-50"
                    >
                      <ChevronRight size={20} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {showModal && (
        <div className="fixed inset-0 backdrop-blur-md bg-white/10 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">
                {editingUser ? 'Edit User' : 'Add New User'}
              </h3>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div className="px-6 py-4">
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-medium mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
                
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-medium mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    required={!editingUser}
                    disabled={!!editingUser}
                    readOnly={!!editingUser}
                  />
                </div>
                
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-medium mb-2">
                    Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    required={!editingUser}
                    placeholder={editingUser ? "Leave blank to keep current password" : ""}
                  />
                </div>
                
                {(!editingUser || formData.password) && (
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-medium mb-2">
                      Confirm Password
                    </label>
                    <input
                      type="password"
                      name="cpassword"
                      value={formData.cpassword}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      required={!editingUser || !!formData.password}
                    />
                  </div>
                )}
              </div>
              
              <div className="px-6 py-4 bg-gray-50 flex justify-end rounded-b-lg">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="bg-white text-gray-700 px-4 py-2 rounded-md mr-2 border border-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-900 hover:bg-blue-800 text-white px-4 py-2 rounded-md"
                >
                  {editingUser ? 'Update' : 'Add'} User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}

export default UserData