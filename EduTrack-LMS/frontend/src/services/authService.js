
import api from './api';

const SESSION_KEY = 'edutrack_user';

export const loginUser = async (email, password) => {
  const response = await api.post('/auth/login', {
    email,
    password
  });

  localStorage.setItem(
    SESSION_KEY,
    JSON.stringify(response.data)
  );

  return response.data;
};

export const registerStudent = async (email, password) => {
  const response = await api.post('/auth/register', {
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

export const logoutUser = async () => {
  try {
    await api.post('/auth/logout');
  } catch {
    // Clear the local session even if the server is unavailable.
  }

  localStorage.removeItem(SESSION_KEY);
  localStorage.removeItem('edutrack_learning_course');
};
