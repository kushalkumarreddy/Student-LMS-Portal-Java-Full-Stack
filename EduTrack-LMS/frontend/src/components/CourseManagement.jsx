
import { useEffect, useState } from 'react';

import {
  getAllCourses,
  addCourse,
  updateCourse,
  deleteCourse
} from '../services/courseService';

const emptyCourse = {
  title: '',
  description: '',
  instructor: '',
  duration: ''
};

function CourseManagement({ onCoursesUpdated, onCountChange }) {
  const [courses, setCourses] = useState([]);
  const [course, setCourse] = useState(emptyCourse);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const loadCourses = async () => {
    try {
      setLoading(true);
      setError('');

      const data = await getAllCourses();
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
          : data?.message || 'Unable to load courses. Check your backend.'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCourses();
  }, []);

  const handleChange = (e) => {
    setCourse({
      ...course,
      [e.target.name]: e.target.value
    });
  };

  const resetForm = () => {
    setCourse(emptyCourse);
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError('');
    setMessage('');

    if (!course.title.trim()) {
      setError('Please provide a course title.');
      return;
    }

    setSaving(true);

    try {
      if (editingId) {
        await updateCourse(editingId, course);
        setMessage('Course updated successfully!');
      } else {
        await addCourse(course);
        setMessage('Course added successfully!');
      }

      resetForm();
      await loadCourses();
      if (onCoursesUpdated) {
        onCoursesUpdated();
      }
    } catch (err) {
      const data = err.response?.data;
      setError(
        typeof data === 'string'
          ? data
          : data?.message || 'Unable to save course.'
      );
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (selectedCourse) => {
    setCourse({
      title: selectedCourse.title || '',
      description: selectedCourse.description || '',
      instructor: selectedCourse.instructor || '',
      duration: selectedCourse.duration || ''
    });

    setEditingId(selectedCourse.id);
    setMessage('');
    setError('');

    const formElement = document.getElementById('course-form-card');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleDelete = async (id, title) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete course "${title}"? This will also remove all its associated lessons and enrollments.`
    );

    if (!confirmed) return;

    try {
      setDeletingId(id);
      setError('');
      setMessage('');

      await deleteCourse(id);

      const updated = courses.filter((item) => item.id !== id);
      setCourses(updated);
      if (onCountChange) {
        onCountChange(updated.length);
      }

      setMessage(`Course "${title}" deleted successfully!`);

      if (editingId === id) {
        resetForm();
      }

      if (onCoursesUpdated) {
        onCoursesUpdated();
      }
    } catch (err) {
      const data = err.response?.data;
      setError(
        typeof data === 'string'
          ? data
          : data?.message || 'Unable to delete course.'
      );
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div>
      {/* Course Add / Edit Form Card */}
      <div className="card border-0 shadow-sm rounded-4 mb-4 bg-white" id="course-form-card">
        <div className="card-header bg-white p-4 border-bottom">
          <h5 className="fw-bold mb-1" style={{ color: '#102a43' }}>
            {editingId ? 'Edit Course' : 'Add New Course'}
          </h5>
          <p className="text-muted small mb-0">
            {editingId
              ? 'Update the course details below.'
              : 'Fill in the information to publish a new course to the catalog.'}
          </p>
        </div>

        <div className="card-body p-4">
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

          <form onSubmit={handleSubmit}>
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label fw-semibold small">Course Title *</label>
                <input
                  type="text"
                  name="title"
                  className="form-control"
                  placeholder="e.g. Advanced Java & Cloud Native"
                  value={course.title}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-md-3">
                <label className="form-label fw-semibold small">Instructor</label>
                <input
                  type="text"
                  name="instructor"
                  className="form-control"
                  placeholder="e.g. Dr. Robert Vance"
                  value={course.instructor}
                  onChange={handleChange}
                />
              </div>

              <div className="col-md-3">
                <label className="form-label fw-semibold small">Duration</label>
                <input
                  type="text"
                  name="duration"
                  className="form-control"
                  placeholder="e.g. 10 Weeks"
                  value={course.duration}
                  onChange={handleChange}
                />
              </div>

              <div className="col-12">
                <label className="form-label fw-semibold small">Course Description</label>
                <textarea
                  name="description"
                  className="form-control"
                  rows="3"
                  placeholder="Comprehensive description of the topics and skills covered..."
                  value={course.description}
                  onChange={handleChange}
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
                  : editingId
                    ? 'Update Course'
                    : 'Publish Course'}
              </button>

              {editingId && (
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

      {/* Courses List Table Card */}
      <div className="card border-0 shadow-sm rounded-4 overflow-hidden bg-white">
        <div className="card-header bg-white p-4 border-bottom d-flex justify-content-between align-items-center flex-wrap gap-2">
          <div>
            <h5 className="fw-bold mb-1" style={{ color: '#102a43' }}>
              All Courses ({courses.length})
            </h5>
            <p className="text-muted small mb-0">
              Manage existing courses available in the LMS catalog.
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

        <div className="p-4">
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status" />
              <p className="text-muted mt-3">Loading courses...</p>
            </div>
          ) : courses.length === 0 ? (
            <div className="text-center py-5 text-muted">
              <div className="fs-1 mb-2">📚</div>
              <h6>No courses available yet</h6>
              <p className="small mb-0">Use the form above to publish your first course.</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th style={{ width: '70px' }}>ID</th>
                    <th>Course Details</th>
                    <th>Instructor</th>
                    <th>Duration</th>
                    <th className="text-end" style={{ width: '160px' }}>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {courses.map((item) => (
                    <tr key={item.id}>
                      <td>
                        <span className="badge bg-secondary-subtle text-secondary font-monospace">
                          #{item.id}
                        </span>
                      </td>
                      <td>
                        <strong className="text-dark d-block">{item.title}</strong>
                        <small className="text-muted text-truncate d-inline-block" style={{ maxWidth: '350px' }}>
                          {item.description || 'No description provided.'}
                        </small>
                      </td>
                      <td>
                        <span className="text-secondary small">
                          {item.instructor || 'Unassigned'}
                        </span>
                      </td>
                      <td>
                        <span className="badge bg-light text-dark border">
                          {item.duration || 'Flexible'}
                        </span>
                      </td>
                      <td className="text-end">
                        <div className="d-flex justify-content-end gap-1">
                          <button
                            className="btn btn-sm btn-outline-primary"
                            onClick={() => handleEdit(item)}
                          >
                            Edit
                          </button>

                          <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => handleDelete(item.id, item.title)}
                            disabled={deletingId === item.id}
                          >
                            {deletingId === item.id ? 'Deleting...' : 'Delete'}
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
    </div>
  );
}

export default CourseManagement;
