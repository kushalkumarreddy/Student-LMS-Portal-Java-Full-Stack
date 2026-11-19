
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import DashboardLayout from '../components/DashboardLayout';
import { getLessonsByCourse } from '../services/lessonService';
import { getCurrentUser } from '../services/authService';

function CourseLearning() {
  const location = useLocation();
  const navigate = useNavigate();
  const user = getCurrentUser();

  const [course, setCourse] = useState(() => {
    const navigationCourse = location.state;

    if (navigationCourse?.courseId) {
      return {
        courseId: navigationCourse.courseId,
        courseTitle: navigationCourse.courseTitle || 'Course Learning'
      };
    }

    try {
      return JSON.parse(
        localStorage.getItem('edutrack_learning_course')
      );
    } catch {
      return null;
    }
  });

  const [lessons, setLessons] = useState([]);
  const [selectedLesson, setSelectedLesson] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const email = user?.email || 'Student';

  useEffect(() => {
    if (location.state?.courseId) {
      const selectedCourse = {
        courseId: location.state.courseId,
        courseTitle: location.state.courseTitle || 'Course Learning'
      };

      setCourse(selectedCourse);

      localStorage.setItem(
        'edutrack_learning_course',
        JSON.stringify(selectedCourse)
      );
    }
  }, [location.state]);

  useEffect(() => {
    const loadLessons = async () => {
      if (!course?.courseId) {
        setError('Course information is unavailable. Please select a course from My Courses.');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError('');

        const data = await getLessonsByCourse(course.courseId);

        setLessons(data || []);
        setSelectedLesson(0);
      } catch (err) {
        setError(
          err.response?.data?.message ||
          'Unable to load course lessons.'
        );
      } finally {
        setLoading(false);
      }
    };

    loadLessons();
  }, [course?.courseId]);

  const currentLesson = lessons[selectedLesson];

  const goBack = () => {
    navigate('/student-dashboard', { replace: true });
  };

  const previousLesson = () => {
    setSelectedLesson((current) => Math.max(0, current - 1));
  };

  const nextLesson = () => {
    setSelectedLesson((current) =>
      Math.min(lessons.length - 1, current + 1)
    );
  };

  return (
    <DashboardLayout
      title={course?.courseTitle || 'Course Learning'}
      email={email}
      role="STUDENT"
    >
      <button
        className="btn btn-outline-secondary mb-4"
        onClick={goBack}
      >
        ← Back to My Courses
      </button>

      <div className="row g-4">
        <div className="col-lg-4">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-white p-3">
              <h5 className="fw-bold mb-1">Course Content</h5>
              <small className="text-muted">
                {lessons.length} lessons
              </small>
            </div>

            <div className="list-group list-group-flush">
              {lessons.map((lesson, index) => (
                <button
                  type="button"
                  key={lesson.id}
                  onClick={() => setSelectedLesson(index)}
                  className={`list-group-item list-group-item-action p-3 ${
                    selectedLesson === index ? 'active' : ''
                  }`}
                >
                  <div className="d-flex gap-2 align-items-center">
                    <span>{index + 1}.</span>
                    <span>{lesson.title}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="col-lg-8">
          <div className="card border-0 shadow-sm">
            <div className="card-body p-4 p-md-5">
              {loading ? (
                <div className="text-center py-5">
                  <div className="spinner-border text-primary" />
                  <p className="text-muted mt-3">
                    Loading lessons...
                  </p>
                </div>
              ) : error ? (
                <div className="alert alert-warning">{error}</div>
              ) : lessons.length === 0 ? (
                <div className="text-center py-5">
                  <h5>No lessons available</h5>
                  <p className="text-muted mb-0">
                    No lessons have been added to this course yet.
                  </p>
                </div>
              ) : (
                <>
                  <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-4">
                    <span className="badge bg-primary">
                      Lesson {selectedLesson + 1} of {lessons.length}
                    </span>

                    <span className="text-muted small">
                      {course?.courseTitle}
                    </span>
                  </div>

                  <h3 className="fw-bold mb-4">
                    {currentLesson?.title}
                  </h3>

                  <div
                    style={{
                      whiteSpace: 'pre-wrap',
                      lineHeight: '1.9',
                      minHeight: '250px'
                    }}
                  >
                    {currentLesson?.content || 'No lesson content available.'}
                  </div>

                  <hr className="my-4" />

                  <div className="d-flex justify-content-between">
                    <button
                      className="btn btn-outline-secondary"
                      onClick={previousLesson}
                      disabled={selectedLesson === 0}
                    >
                      ← Previous
                    </button>

                    {selectedLesson === lessons.length - 1 ? (
                      <button
                        className="btn btn-success"
                        onClick={goBack}
                      >
                        Finish Course
                      </button>
                    ) : (
                      <button
                        className="btn btn-primary"
                        onClick={nextLesson}
                      >
                        Next Lesson →
                      </button>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default CourseLearning;
