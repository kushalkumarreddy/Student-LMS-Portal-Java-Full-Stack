
import axios from 'axios';

const API_URL = 'http://localhost:8080/api/enrollments';

export const enrollInCourse = async (studentId, courseId) => {
  const response = await axios.post(API_URL, {
    studentId,
    courseId
  });

  return response.data;
};

export const getStudentEnrollments = async (studentId) => {
  const response = await axios.get(
    `${API_URL}/student/${studentId}`
  );

  return response.data;
};
