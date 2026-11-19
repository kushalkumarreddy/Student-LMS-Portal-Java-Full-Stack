
import api from './api';

export const getAllStudents = async () => {
  const response = await api.get('/admin/students');
  return response.data;
};

export const deleteStudent = async (studentId) => {
  const response = await api.delete(`/admin/students/${studentId}`);
  return response.data;
};
