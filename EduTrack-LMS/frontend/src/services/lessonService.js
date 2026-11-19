
import axios from 'axios';

const API_URL = 'http://localhost:8080/api/lessons';

export const getLessonsByCourse = async (courseId) => {
  const response = await axios.get(`${API_URL}/course/${courseId}`);
  return response.data;
};

export const getLessonById = async (lessonId) => {
  const response = await axios.get(`${API_URL}/${lessonId}`);
  return response.data;
};

export const addLesson = async (lessonData) => {
  const response = await axios.post(API_URL, lessonData);
  return response.data;
};

export const updateLesson = async (lessonId, lessonData) => {
  const response = await axios.put(`${API_URL}/${lessonId}`, lessonData);
  return response.data;
};

export const deleteLesson = async (lessonId) => {
  const response = await axios.delete(`${API_URL}/${lessonId}`);
  return response.data;
};
