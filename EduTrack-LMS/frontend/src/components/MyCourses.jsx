
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getStudentEnrollments } from '../services/enrollmentService';

function MyCourses({ studentId, email }) {
  const navigate = useNavigate();

  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadCourses = async () => {
    if (!studentId) {
      setError('Student account information is missing. Please sign in again.');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError('');

      const data = await getStudentEnrollments(studentId);
      setCourses(data || []);
    } catch (err) {
      setError(
        err.response?.data?.message ||
        'Unable to load your enrolled courses.'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCourses();
  }, [studentId]);

  const startLearning = (course) => {
    localStorage.setItem(
      'edutrack_learning_course',
      JSON.stringify({
        courseId: course.courseId,
        courseTitle: course.title
      })
    );

    navigate('/course-learning', {
      state: {
        courseId: course.courseId,
        courseTitle: course.title,
        studentId,
        email
      }
    });
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-4">
        <div>
          <h4 className="fw-bold mb-1">My Courses</h4>
          <p className="text-muted mb-0">
            Continue learning from your enrolled courses.
          </p>
        </div>

        <button
          className="btn btn-outline-primary"
          onClick={loadCourses}
          disabled={loading}
        >
          Refresh
        </button>
      </div>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" />
          <p className="text-muted mt-3">Loading your courses...</p>
        </div>
      ) : error ? (
        <div className="alert alert-danger">{error}</div>
      ) : courses.length === 0 ? (
        <div className="card border-0 shadow-sm">
          <div className="card-body text-center py-5">
            <h5 className="fw-bold">You haven't enrolled in any courses yet.</h5>
            <p className="text-muted mb-0">
              Browse the course catalog below to get started.
            </p>
          </div>
        </div>
      ) : (
        <div className="row g-4">
          {courses.map((course) => (
            <div className="col-md-6 col-xl-4" key={course.id}>
              <div className="card h-100 border-0 shadow-sm">
                <div
                  className="p-4 text-white"
                  style={{
                    background: 'linear-gradient(135deg, #102a43, #176b87)'
                  }}
                >
                  <div className="small text-white-50 mb-2">
                    ENROLLED COURSE
                  </div>
                  <h5 className="fw-bold mb-0">{course.title}</h5>
                </div>

                <div className="card-body d-flex flex-column p-4">
                  <p className="text-muted">
                    {course.description || 'No course description available.'}
                  </p>

                  <div className="small mb-2">
                    <strong>Instructor:</strong>{' '}
                    {course.instructor || 'Not specified'}
                  </div>

                  <div className="small mb-3">
                    <strong>Duration:</strong>{' '}
                    {course.duration || 'Not specified'}
                  </div>

                  <button
                    className="btn btn-primary mt-auto"
                    onClick={() => startLearning(course)}
                  >
                    Start Learning
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyCourses;
