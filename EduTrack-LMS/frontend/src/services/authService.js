
import axios from 'axios';

const API_URL = 'http://localhost:8080/api/auth';
const SESSION_KEY = 'edutrack_user';

export const loginUser = async (email, password) => {
  const response = await axios.post(`${API_URL}/login`, {
    email,
    password
  });

  const user = response.data;

  localStorage.setItem(SESSION_KEY, JSON.stringify(user));

  return user;
};

export const registerStudent = async (email, password) => {
  const response = await axios.post(`${API_URL}/register`, {
    email,
    password
  });

  return response.data;
};

export const getCurrentUser = () => {
  try {
    const user = localStorage.getItem(SESSION_KEY);
    return user ? JSON.parse(user) : null;
  } catch {
    localStorage.removeItem(SESSION_KEY);
    return null;
  }
};

export const logoutUser = () => {
  localStorage.removeItem(SESSION_KEY);
};
