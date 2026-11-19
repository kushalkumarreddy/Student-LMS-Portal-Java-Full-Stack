
import { useEffect, useState } from 'react';
import { getAllCourses } from '../services/courseService';
import { enrollInCourse, getStudentEnrollments } from '../services/enrollmentService';

function CourseCatalog({ studentId, onEnrolled, onCountChange }) {
  const [courses, setCourses] = useState([]);
  const [enrolledIds, setEnrolledIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [enrollingId, setEnrollingId] = useState(null);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [selectedCourseForModal, setSelectedCourseForModal] = useState(null);

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

      const courseList = courseData || [];
      setCourses(courseList);
      if (onCountChange) {
        onCountChange(courseList.length);
      }

      setEnrolledIds(
        (enrollmentData || []).map((item) => Number(item.courseId))
      );
    } catch (err) {
      const data = err.response?.data;
      setError(
        typeof data === 'string'
          ? data
          : data?.message || 'Unable to load the course catalog.'
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

      setMessage('You have successfully enrolled in the course!');
      if (onEnrolled) {
        onEnrolled(courseId);
      }
    } catch (err) {
      const data = err.response?.data;
      setError(
        typeof data === 'string'
          ? data
          : data?.message || 'Unable to enroll in this course.'
      );
    } finally {
      setEnrollingId(null);
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-4">
        <div>
          <h4 className="fw-bold mb-1" style={{ color: '#102a43' }}>
            Explore Courses
          </h4>
          <p className="text-muted mb-0">
            Discover courses and enroll to start learning.
          </p>
        </div>

        <button
          className="btn btn-outline-primary btn-sm"
          onClick={loadCatalog}
          disabled={loading}
        >
          {loading ? 'Refreshing...' : '↻ Refresh'}
        </button>
      </div>

      {error && (
        <div className="alert alert-danger shadow-sm alert-dismissible fade show" role="alert">
          {error}
          <button type="button" className="btn-close" onClick={() => setError('')} />
        </div>
      )}

      {message && (
        <div className="alert alert-success shadow-sm alert-dismissible fade show" role="alert">
          {message}
          <button type="button" className="btn-close" onClick={() => setMessage('')} />
        </div>
      )}

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status" />
          <p className="text-muted mt-3">Loading courses...</p>
        </div>
      ) : courses.length === 0 ? (
        <div className="card border-0 shadow-sm rounded-4 text-center p-5 bg-white">
          <div className="display-4 text-muted mb-3">📖</div>
          <h5 className="fw-bold text-dark">No courses available</h5>
          <p className="text-muted mb-0">
            Courses added by the administrator will appear here.
          </p>
        </div>
      ) : (
        <div className="row g-4">
          {courses.map((course) => {
            const enrolled = enrolledIds.includes(Number(course.id));

            return (
              <div className="col-md-6 col-xl-4" key={course.id}>
                <div className="card h-100 border-0 shadow-sm rounded-4 overflow-hidden course-card">
                  <div
                    className="p-4 text-white position-relative"
                    style={{
                      background: 'linear-gradient(135deg, #102a43, #176b87)'
                    }}
                  >
                    <div className="small text-white-50 mb-1 text-uppercase fw-semibold" style={{ fontSize: '11px', letterSpacing: '0.5px' }}>
                      EDUTRACK COURSE
                    </div>
                    <h5 className="fw-bold mb-0 text-white">{course.title}</h5>
                  </div>

                  <div className="card-body d-flex flex-column p-4">
                    <p className="text-muted small flex-grow-1" style={{ minHeight: '40px' }}>
                      {course.description || 'No description available.'}
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

                    <div className="d-flex gap-2 mt-auto">
                      <button
                        className="btn btn-outline-secondary btn-sm flex-grow-1"
                        onClick={() => setSelectedCourseForModal(course)}
                      >
                        Details
                      </button>

                      {enrolled ? (
                        <button
                          className="btn btn-success btn-sm flex-grow-1"
                          disabled
                        >
                          ✓ Enrolled
                        </button>
                      ) : (
                        <button
                          className="btn btn-primary btn-sm flex-grow-1"
                          onClick={() => handleEnroll(course.id)}
                          disabled={enrollingId === course.id}
                          style={{ background: '#176b87', borderColor: '#176b87' }}
                        >
                          {enrollingId === course.id
                            ? 'Enrolling...'
                            : 'Enroll Now'}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Course Details Modal */}
      {selectedCourseForModal && (
        <div
          className="modal show d-block"
          tabIndex="-1"
          style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content rounded-4 border-0 shadow">
              <div
                className="modal-header text-white"
                style={{ background: 'linear-gradient(135deg, #102a43, #176b87)' }}
              >
                <h5 className="modal-title fw-bold">
                  {selectedCourseForModal.title}
                </h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setSelectedCourseForModal(null)}
                />
              </div>
              <div className="modal-body p-4">
                <h6 className="fw-bold text-muted text-uppercase mb-2" style={{ fontSize: '12px' }}>
                  Course Overview
                </h6>
                <p className="mb-4 text-dark" style={{ lineHeight: '1.7' }}>
                  {selectedCourseForModal.description || 'No description provided.'}
                </p>

                <div className="row g-2 mb-3">
                  <div className="col-6">
                    <div className="p-3 bg-light rounded-3">
                      <small className="text-muted d-block">Instructor</small>
                      <strong className="text-dark">{selectedCourseForModal.instructor || 'EduTrack Staff'}</strong>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="p-3 bg-light rounded-3">
                      <small className="text-muted d-block">Duration</small>
                      <strong className="text-dark">{selectedCourseForModal.duration || 'Self-paced'}</strong>
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer bg-light border-0">
                <button
                  type="button"
                  className="btn btn-secondary btn-sm px-3"
                  onClick={() => setSelectedCourseForModal(null)}
                >
                  Close
                </button>
                {!enrolledIds.includes(Number(selectedCourseForModal.id)) && (
                  <button
                    type="button"
                    className="btn btn-primary btn-sm px-4"
                    onClick={() => {
                      const id = selectedCourseForModal.id;
                      setSelectedCourseForModal(null);
                      handleEnroll(id);
                    }}
                    style={{ background: '#176b87', borderColor: '#176b87' }}
                  >
                    Enroll Now
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CourseCatalog;
