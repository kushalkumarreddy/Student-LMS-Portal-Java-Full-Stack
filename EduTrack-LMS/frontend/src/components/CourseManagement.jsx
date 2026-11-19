
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

function CourseManagement() {
  const [courses, setCourses] = useState([]);
  const [course, setCourse] = useState(emptyCourse);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const loadCourses = async () => {
    try {
      setLoading(true);
      setError('');

      const data = await getAllCourses();
      setCourses(data);
    } catch (err) {
      setError('Unable to load courses. Check your backend.');
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
    } catch (err) {
      setError(
        err.response?.data || 'Unable to save course.'
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

    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const handleDelete = async (id, title) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${title}"?`
    );

    if (!confirmed) return;

    try {
      await deleteCourse(id);

      setCourses((previous) =>
        previous.filter((item) => item.id !== id)
      );

      setMessage('Course deleted successfully!');
      setError('');

      if (editingId === id) {
        resetForm();
      }
    } catch (err) {
      setError('Unable to delete course.');
    }
  };

  return (
    <div>
      <div className="dashboard-card">
        <h4>{editingId ? 'Edit Course' : 'Add New Course'}</h4>

        <p>Enter the course information below.</p>

        {error && (
          <div className="alert alert-danger">{error}</div>
        )}

        {message && (
          <div className="alert alert-success">{message}</div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label">Course Title</label>

              <input
                type="text"
                name="title"
                className="form-control"
                placeholder="Enter course title"
                value={course.title}
                onChange={handleChange}
                required
              />
            </div>

            <div className="col-md-6 mb-3">
              <label className="form-label">Instructor</label>

              <input
                type="text"
                name="instructor"
                className="form-control"
                placeholder="Enter instructor name"
                value={course.instructor}
                onChange={handleChange}
                required
              />
            </div>

            <div className="col-md-6 mb-3">
              <label className="form-label">Duration</label>

              <input
                type="text"
                name="duration"
                className="form-control"
                placeholder="Example: 8 Weeks"
                value={course.duration}
                onChange={handleChange}
                required
              />
            </div>

            <div className="col-md-12 mb-3">
              <label className="form-label">Description</label>

              <textarea
                name="description"
                className="form-control"
                rows="4"
                placeholder="Enter course description"
                value={course.description}
                onChange={handleChange}
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary me-2"
            disabled={saving}
          >
            {saving
              ? 'Saving...'
              : editingId
                ? 'Update Course'
                : 'Add Course'}
          </button>

          {editingId && (
            <button
              type="button"
              className="btn btn-secondary"
              onClick={resetForm}
            >
              Cancel
            </button>
          )}
        </form>
      </div>

      <div className="dashboard-card">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h4>All Courses</h4>
            <p>Manage your available courses.</p>
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
          <p>Loading courses...</p>
        ) : courses.length === 0 ? (
          <p>No courses available. Add your first course above.</p>
        ) : (
          <div className="table-responsive">
            <table className="table table-hover align-middle">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Course</th>
                  <th>Instructor</th>
                  <th>Duration</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {courses.map((item) => (
                  <tr key={item.id}>
                    <td>{item.id}</td>
                    <td>
                      <strong>{item.title}</strong>
                      <div className="text-muted small">
                        {item.description}
                      </div>
                    </td>
                    <td>{item.instructor}</td>
                    <td>{item.duration}</td>
                    <td>
                      <div className="d-flex gap-2">
                        <button
                          className="btn btn-sm btn-warning"
                          onClick={() => handleEdit(item)}
                        >
                          Edit
                        </button>

                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() =>
                            handleDelete(item.id, item.title)
                          }
                        >
                          Delete
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
  );
}

export default CourseManagement;
