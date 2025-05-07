import axios from 'axios';

const API_URL = 'http://localhost:5000/api/users';

// Register user
const register = async (userData) => {
  const response = await axios.post(API_URL, userData);
  if (response.data) {
    localStorage.setItem('user', JSON.stringify(response.data));
  }
  return response.data;
};

// Login user
const login = async (userData) => {
  const response = await axios.post(`${API_URL}/login`, userData);
  if (response.data) {
    localStorage.setItem('user', JSON.stringify(response.data));
  }
  return response.data;
};

// Logout user
const logout = () => {
  localStorage.removeItem('user');
};

// Update user profile
const updateProfile = async (userData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };

  const response = await axios.put(`${API_URL}/profile`, userData, config);
  if (response.data) {
    const user = JSON.parse(localStorage.getItem('user'));
    user.name = response.data.name;
    user.email = response.data.email;
    localStorage.setItem('user', JSON.stringify(user));
  }
  return response.data;
};

// Update user password
const updatePassword = async (passwordData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };

  const response = await axios.put(`${API_URL}/password`, passwordData, config);
  if (response.data) {
    const user = JSON.parse(localStorage.getItem('user'));
    localStorage.setItem('user', JSON.stringify(user));
  }
  return response.data;
};

const authService = {
  register,
  login,
  logout,
  updateProfile,
  updatePassword
};

export default authService; 