
import { useEffect, useState } from 'react';

import { getAllCourses } from '../services/courseService';

import {
  getLessonsByCourse,
  addLesson,
  updateLesson,
  deleteLesson
} from '../services/lessonService';

function LessonManagement({ courseVersion }) {
  const [courses, setCourses] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState('');

  const [lessons, setLessons] = useState([]);

  const [lessonId, setLessonId] = useState(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [lessonOrder, setLessonOrder] = useState(1);

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const loadCourses = async () => {
    try {
      setError('');

      const data = await getAllCourses();
      const list = data || [];
      setCourses(list);

      if (list.length > 0) {
        setSelectedCourseId((prev) => {
          if (prev && list.some((c) => String(c.id) === String(prev))) {
            return prev;
          }
          return String(list[0].id);
        });
      } else {
        setSelectedCourseId('');
        setLessons([]);
      }
    } catch (err) {
      const data = err.response?.data;
      setError(
        typeof data === 'string'
          ? data
          : data?.message || 'Unable to load courses. Please check the backend.'
      );
    }
  };

  useEffect(() => {
    loadCourses();
  }, [courseVersion]);

  useEffect(() => {
    if (selectedCourseId) {
      loadLessons(selectedCourseId);
    } else {
      setLessons([]);
    }
  }, [selectedCourseId]);

  const loadLessons = async (courseId) => {
    try {
      setLoading(true);
      setError('');

      const data = await getLessonsByCourse(courseId);
      const list = data || [];
      setLessons(list);
      setLessonOrder(list.length + 1);
    } catch (err) {
      const data = err.response?.data;
      setError(
        typeof data === 'string'
          ? data
          : data?.message || 'Unable to load lessons.'
      );
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setLessonId(null);
    setTitle('');
    setContent('');
    setLessonOrder(lessons.length + 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError('');
    setSuccess('');

    if (!selectedCourseId) {
      setError('Please select a course.');
      return;
    }

    if (!title.trim()) {
      setError('Please enter a lesson title.');
      return;
    }

    const lessonData = {
      title: title.trim(),
      content: content.trim(),
      lessonOrder: Number(lessonOrder),
      courseId: Number(selectedCourseId)
    };

    try {
      setSaving(true);

      if (lessonId) {
        await updateLesson(lessonId, lessonData);
        setSuccess('Lesson updated successfully.');
      } else {
        await addLesson(lessonData);
        setSuccess('Lesson added successfully.');
      }

      resetForm();
      await loadLessons(selectedCourseId);
    } catch (err) {
      const data = err.response?.data;
      setError(
        typeof data === 'string'
          ? data
          : data?.message || 'Unable to save lesson. Please try again.'
      );
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (lesson) => {
    setLessonId(lesson.id);
    setTitle(lesson.title || '');
    setContent(lesson.content || '');
    setLessonOrder(lesson.lessonOrder || 1);

    setError('');
    setSuccess('');

    const formElement = document.getElementById('lesson-form-card');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleDelete = async (id, lessonTitle) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete lesson "${lessonTitle}"?`
    );

    if (!confirmed) return;

    try {
      setDeletingId(id);
      setError('');
      setSuccess('');

      await deleteLesson(id);

      setSuccess(`Lesson "${lessonTitle}" deleted successfully.`);

      if (lessonId === id) {
        resetForm();
      }

      await loadLessons(selectedCourseId);
    } catch (err) {
      const data = err.response?.data;
      setError(
        typeof data === 'string'
          ? data
          : data?.message || 'Unable to delete lesson.'
      );
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-4">
        <div>
          <h4 className="fw-bold mb-1" style={{ color: '#102a43' }}>
            Lesson Management
          </h4>
          <p className="text-muted mb-0">
            Create, organize, and manage curriculum lessons for your courses.
          </p>
        </div>
      </div>

      {error && (
        <div className="alert alert-danger shadow-sm alert-dismissible fade show" role="alert">
          {error}
          <button type="button" className="btn-close" onClick={() => setError('')} />
        </div>
      )}

      {success && (
        <div className="alert alert-success shadow-sm alert-dismissible fade show" role="alert">
          {success}
          <button type="button" className="btn-close" onClick={() => setSuccess('')} />
        </div>
      )}

      {courses.length === 0 ? (
        <div className="card border-0 shadow-sm rounded-4 text-center p-5 bg-white">
          <div className="display-4 text-muted mb-3">📝</div>
          <h5 className="fw-bold text-dark">No courses available</h5>
          <p className="text-muted mb-3">
            Please create and publish at least one course before adding lessons.
          </p>
          <div>
            <a href="#courses" className="btn btn-primary px-4">
              Go to Course Management
            </a>
          </div>
        </div>
      ) : (
        <>
          {/* Add / Edit Lesson Form */}
          <div className="card border-0 shadow-sm rounded-4 mb-4 bg-white" id="lesson-form-card">
            <div className="card-header bg-white p-4 border-bottom">
              <h5 className="fw-bold mb-1" style={{ color: '#102a43' }}>
                {lessonId ? 'Edit Lesson' : 'Add New Lesson'}
              </h5>
              <p className="text-muted small mb-0">
                {lessonId
                  ? 'Update the curriculum content for this lesson.'
                  : 'Add a new lesson topic to the selected course.'}
              </p>
            </div>

            <div className="card-body p-4">
              <form onSubmit={handleSubmit}>
                <div className="row g-3">
                  <div className="col-md-5">
                    <label className="form-label fw-semibold small">
                      Select Target Course *
                    </label>
                    <select
                      className="form-select"
                      value={selectedCourseId}
                      onChange={(e) => {
                        setSelectedCourseId(e.target.value);
                        resetForm();
                        setSuccess('');
                        setError('');
                      }}
                      required
                    >
                      {courses.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.title}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="col-md-5">
                    <label className="form-label fw-semibold small">
                      Lesson Title *
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. Setting up Spring Security"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      required
                    />
                  </div>

                  <div className="col-md-2">
                    <label className="form-label fw-semibold small">
                      Order / Sequence
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      min="1"
                      value={lessonOrder}
                      onChange={(e) => setLessonOrder(e.target.value)}
                      required
                    />
                  </div>

                  <div className="col-12">
                    <label className="form-label fw-semibold small">
                      Lesson Content / Study Material
                    </label>
                    <textarea
                      className="form-control font-monospace"
                      rows="6"
                      placeholder="Detailed tutorial text, explanation, code snippets, notes..."
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                    />
                  </div>
                </div>

                <div className="d-flex gap-2 mt-4">
                  <button
                    type="submit"
                    className="btn btn-primary px-4 fw-semibold"
                    disabled={saving}
                    style={{ background: '#176b87', borderColor: '#176b87' }}
                  >
                    {saving
                      ? 'Saving...'
                      : lessonId
                        ? 'Update Lesson'
                        : 'Add Lesson'}
                  </button>

                  {lessonId && (
                    <button
                      type="button"
                      className="btn btn-outline-secondary px-3"
                      onClick={resetForm}
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>

          {/* Existing Lessons for Course */}
          <div className="card border-0 shadow-sm rounded-4 overflow-hidden bg-white">
            <div className="card-header bg-white p-4 border-bottom d-flex justify-content-between align-items-center flex-wrap gap-2">
              <div>
                <h5 className="fw-bold mb-1" style={{ color: '#102a43' }}>
                  Course Lessons ({lessons.length})
                </h5>
                <p className="text-muted small mb-0">
                  Showing lessons for:{' '}
                  <strong className="text-primary">
                    {courses.find((c) => String(c.id) === String(selectedCourseId))?.title || 'Selected Course'}
                  </strong>
                </p>
              </div>

              <button
                className="btn btn-outline-primary btn-sm"
                onClick={() => loadLessons(selectedCourseId)}
                disabled={loading}
              >
                {loading ? 'Refreshing...' : '↻ Refresh Lessons'}
              </button>
            </div>

            <div className="p-4">
              {loading ? (
                <div className="text-center py-5">
                  <div className="spinner-border text-primary" role="status" />
                  <p className="text-muted mt-3">Loading lessons...</p>
                </div>
              ) : lessons.length === 0 ? (
                <div className="text-center py-5 text-muted">
                  <div className="fs-1 mb-2">📖</div>
                  <h6>No lessons created for this course yet</h6>
                  <p className="small mb-0">Use the form above to add the first lesson.</p>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover align-middle mb-0">
                    <thead className="table-light">
                      <tr>
                        <th style={{ width: '80px' }}>Order</th>
                        <th>Lesson Title</th>
                        <th>Content Preview</th>
                        <th className="text-end" style={{ width: '160px' }}>Actions</th>
                      </tr>
                    </thead>

                    <tbody>
                      {lessons.map((lesson) => (
                        <tr key={lesson.id}>
                          <td>
                            <span className="badge bg-primary-subtle text-primary fw-bold">
                              #{lesson.lessonOrder}
                            </span>
                          </td>
                          <td>
                            <strong className="text-dark">{lesson.title}</strong>
                          </td>
                          <td>
                            <small className="text-muted text-truncate d-inline-block" style={{ maxWidth: '350px' }}>
                              {lesson.content || 'No text content.'}
                            </small>
                          </td>
                          <td className="text-end">
                            <div className="d-flex justify-content-end gap-1">
                              <button
                                className="btn btn-sm btn-outline-primary"
                                onClick={() => handleEdit(lesson)}
                              >
                                Edit
                              </button>

                              <button
                                className="btn btn-sm btn-outline-danger"
                                onClick={() => handleDelete(lesson.id, lesson.title)}
                                disabled={deletingId === lesson.id}
                              >
                                {deletingId === lesson.id ? 'Deleting...' : 'Delete'}
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default LessonManagement;
