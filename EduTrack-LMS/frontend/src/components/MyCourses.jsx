
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getStudentEnrollments } from '../services/enrollmentService';

function MyCourses({ studentId, email, refreshKey, onCountChange }) {
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
      const list = data || [];
      setCourses(list);
      if (onCountChange) {
        onCountChange(list.length);
      }
    } catch (err) {
      const data = err.response?.data;
      setError(
        typeof data === 'string'
          ? data
          : data?.message || 'Unable to load your enrolled courses.'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCourses();
  }, [studentId, refreshKey]);

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
          <h4 className="fw-bold mb-1" style={{ color: '#102a43' }}>
            My Courses
          </h4>
          <p className="text-muted mb-0">
            Continue learning from your enrolled courses.
          </p>
        </div>

        <button
          className="btn btn-outline-primary btn-sm"
          onClick={loadCourses}
          disabled={loading}
        >
          {loading ? 'Refreshing...' : '↻ Refresh'}
        </button>
      </div>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status" />
          <p className="text-muted mt-3">Loading your courses...</p>
        </div>
      ) : error ? (
        <div className="alert alert-danger shadow-sm">{error}</div>
      ) : courses.length === 0 ? (
        <div className="card border-0 shadow-sm rounded-4 text-center p-5 bg-white">
          <div className="display-4 text-muted mb-3">📚</div>
          <h5 className="fw-bold text-dark">You haven't enrolled in any courses yet</h5>
          <p className="text-muted mb-3">
            Browse the course catalog below and enroll to start your learning journey!
          </p>
          <div>
            <a href="#course-catalog" className="btn btn-primary px-4">
              Explore Courses
            </a>
          </div>
        </div>
      ) : (
        <div className="row g-4">
          {courses.map((course) => (
            <div className="col-md-6 col-xl-4" key={course.id}>
              <div className="card h-100 border-0 shadow-sm rounded-4 overflow-hidden course-card">
                <div
                  className="p-4 text-white position-relative"
                  style={{
                    background: 'linear-gradient(135deg, #102a43, #176b87)'
                  }}
                >
                  <span className="badge bg-success position-absolute top-0 end-0 m-3">
                    Active Student
                  </span>
                  <div className="small text-white-50 mb-1 text-uppercase fw-semibold" style={{ fontSize: '11px', letterSpacing: '0.5px' }}>
                    ENROLLED COURSE
                  </div>
                  <h5 className="fw-bold mb-0 text-white">{course.title}</h5>
                </div>

                <div className="card-body d-flex flex-column p-4">
                  <p className="text-muted small flex-grow-1" style={{ minHeight: '40px' }}>
                    {course.description || 'No course description available.'}
                  </p>

                  <div className="bg-light p-3 rounded-3 mb-3 small">
                    <div className="d-flex justify-content-between mb-1">
                      <span className="text-muted">Instructor:</span>
                      <span className="fw-semibold text-dark">{course.instructor || 'EduTrack Faculty'}</span>
                    </div>
                    <div className="d-flex justify-content-between">
                      <span className="text-muted">Duration:</span>
                      <span className="fw-semibold text-dark">{course.duration || 'Self-paced'}</span>
                    </div>
                  </div>

                  <button
                    className="btn btn-primary w-100 fw-semibold py-2 rounded-3"
                    onClick={() => startLearning(course)}
                    style={{ background: '#176b87', borderColor: '#176b87' }}
                  >
                    Start Learning →
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
