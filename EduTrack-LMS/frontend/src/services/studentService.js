
import axios from 'axios';

const API_URL = 'http://localhost:8080/api/admin';

export const getAllStudents = async () => {
  const response = await axios.get(`${API_URL}/students`);
  return response.data;
};

export const deleteStudent = async (id) => {
  const response = await axios.delete(`${API_URL}/students/${id}`);
  return response.data;
};
