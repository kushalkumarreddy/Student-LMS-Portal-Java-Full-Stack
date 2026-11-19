
import { useEffect, useState } from 'react';
import {
  getAllCourses
} from '../services/courseService';

import {
  enrollInCourse,
  getStudentEnrollments
} from '../services/enrollmentService';

function CourseCatalog({ studentId }) {
  const [courses, setCourses] = useState([]);
  const [enrolledIds, setEnrolledIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [enrollingId, setEnrollingId] = useState(null);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const loadCatalog = async () => {
    if (!studentId) {
      setError('Student account information is missing.');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError('');

      const [courseData, enrollmentData] = await Promise.all([
        getAllCourses(),
        getStudentEnrollments(studentId)
      ]);

      setCourses(courseData || []);

      setEnrolledIds(
        (enrollmentData || []).map((item) => Number(item.courseId))
      );
    } catch (err) {
      setError(
        err.response?.data?.message ||
        'Unable to load the course catalog.'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCatalog();
  }, [studentId]);

  const handleEnroll = async (courseId) => {
    try {
      setEnrollingId(courseId);
      setError('');
      setMessage('');

      await enrollInCourse(studentId, courseId);

      setEnrolledIds((current) => [
        ...current,
        Number(courseId)
      ]);

      setMessage('You have successfully enrolled in the course.');
    } catch (err) {
      setError(
        typeof err.response?.data === 'string'
          ? err.response.data
          : err.response?.data?.message ||
            'Unable to enroll in this course.'
      );
    } finally {
      setEnrollingId(null);
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-4">
        <div>
          <h4 className="fw-bold mb-1">Explore Courses</h4>
          <p className="text-muted mb-0">
            Discover courses and enroll to start learning.
          </p>
        </div>

        <button
          className="btn btn-outline-primary"
          onClick={loadCatalog}
          disabled={loading}
        >
          Refresh
        </button>
      </div>

      {error && (
        <div className="alert alert-danger">{error}</div>
      )}

      {message && (
        <div className="alert alert-success">{message}</div>
      )}

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" />
          <p className="text-muted mt-3">Loading courses...</p>
        </div>
      ) : courses.length === 0 ? (
        <div className="card border-0 shadow-sm">
          <div className="card-body text-center py-5">
            <h5>No courses available</h5>
            <p className="text-muted mb-0">
              Courses added by the administrator will appear here.
            </p>
          </div>
        </div>
      ) : (
        <div className="row g-4">
          {courses.map((course) => {
            const enrolled = enrolledIds.includes(Number(course.id));

            return (
              <div className="col-md-6 col-xl-4" key={course.id}>
                <div className="card h-100 border-0 shadow-sm">
                  <div
                    className="p-4 text-white"
                    style={{
                      background: 'linear-gradient(135deg, #102a43, #176b87)'
                    }}
                  >
                    <div className="small text-white-50 mb-2">
                      EDUTRACK COURSE
                    </div>
                    <h5 className="fw-bold mb-0">{course.title}</h5>
                  </div>

                  <div className="card-body d-flex flex-column p-4">
                    <p className="text-muted">
                      {course.description || 'No description available.'}
                    </p>

                    <div className="small mb-2">
                      <strong>Instructor:</strong>{' '}
                      {course.instructor || 'Not specified'}
                    </div>

                    <div className="small mb-3">
                      <strong>Duration:</strong>{' '}
                      {course.duration || 'Not specified'}
                    </div>

                    {enrolled ? (
                      <button
                        className="btn btn-success mt-auto"
                        disabled
                      >
                        Already Enrolled
                      </button>
                    ) : (
                      <button
                        className="btn btn-primary mt-auto"
                        onClick={() => handleEnroll(course.id)}
                        disabled={enrollingId === course.id}
                      >
                        {enrollingId === course.id
                          ? 'Enrolling...'
                          : 'Enroll Now'}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default CourseCatalog;
