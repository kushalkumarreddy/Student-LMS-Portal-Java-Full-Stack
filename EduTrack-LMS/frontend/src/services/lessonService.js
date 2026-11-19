
import api from './api';

export const getLessonsByCourse = async (courseId) => {
  const response = await api.get(`/lessons/course/${courseId}`);
  return response.data;
};

export const getLessonById = async (lessonId) => {
  const response = await api.get(`/lessons/${lessonId}`);
  return response.data;
};

export const addLesson = async (lessonData) => {
  const response = await api.post('/lessons', lessonData);
  return response.data;
};

export const updateLesson = async (lessonId, lessonData) => {
  const response = await api.put(`/lessons/${lessonId}`, lessonData);
  return response.data;
};

export const deleteLesson = async (lessonId) => {
  const response = await api.delete(`/lessons/${lessonId}`);
  return response.data;
};
    